import request from 'supertest';
import { createTestUser, loginTestUser, deleteTestUser } from './utils/auth.utils';
import { supabase } from '../src/services/supabase';
import app from '../src/server';

describe('Answers API', () => {
  let testUser: { user: any; email: string; password: string };
  let authToken: string;
  let testQuestionId: number;

  beforeAll(async () => {
    // Create a test user and question
    testUser = await createTestUser();
    const session = await loginTestUser(testUser.email, testUser.password);
    authToken = session?.access_token || '';

    // Create a test question
    const { data: question } = await supabase
      .from('momsquestions')
      .insert({ user_id: testUser.user.id, content: 'Test question for answers' })
      .select()
      .single();

    testQuestionId = question?.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (testQuestionId) {
      await supabase.from('answers').delete().eq('question_id', testQuestionId);
      await supabase.from('momsquestions').delete().eq('id', testQuestionId);
    }
    if (testUser?.user?.id) {
      await deleteTestUser(testUser.user.id);
    }
  });

  describe('Answer Creation', () => {
    it('should create a new answer', async () => {
      const response = await request(app)
        .post(`/api/answers/question/${testQuestionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Test answer content' });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('content', 'Test answer content');
      expect(response.body.data).toHaveProperty('question_id', testQuestionId);
      expect(response.body.data).toHaveProperty('user_id', testUser.user.id);
    });

    it('should reject answer creation without authentication', async () => {
      const response = await request(app)
        .post(`/api/answers/question/${testQuestionId}`)
        .send({ content: 'Test answer content' });

      expect(response.status).toBe(401);
    });
  });

  describe('Answer Retrieval', () => {
    let testAnswerId: number;

    beforeAll(async () => {
      // Create a test answer
      const { data } = await supabase
        .from('answers')
        .insert({
          question_id: testQuestionId,
          user_id: testUser.user.id,
          content: 'Test answer for retrieval'
        })
        .select()
        .single();

      testAnswerId = data?.id;
    });

    it('should retrieve answers for a question', async () => {
      const response = await request(app)
        .get(`/api/answers/question/${testQuestionId}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('content');
    });

    it('should support pagination', async () => {
      // Create multiple answers
      await Promise.all([
        supabase.from('answers').insert({
          question_id: testQuestionId,
          user_id: testUser.user.id,
          content: 'Pagination test 1'
        }),
        supabase.from('answers').insert({
          question_id: testQuestionId,
          user_id: testUser.user.id,
          content: 'Pagination test 2'
        })
      ]);

      const response = await request(app)
        .get(`/api/answers/question/${testQuestionId}?page=0&limit=2`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });
  });

  describe('Answer Management', () => {
    let testAnswerId: number;

    beforeEach(async () => {
      // Create a fresh test answer before each test
      const { data } = await supabase
        .from('answers')
        .insert({
          question_id: testQuestionId,
          user_id: testUser.user.id,
          content: 'Test answer for management'
        })
        .select()
        .single();

      testAnswerId = data?.id;
    });

    it('should update an answer', async () => {
      const response = await request(app)
        .put(`/api/answers/${testAnswerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Updated answer content' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('content', 'Updated answer content');
    });

    it('should delete an answer', async () => {
      const response = await request(app)
        .delete(`/api/answers/${testAnswerId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Answer deleted successfully');

      // Verify deletion
      const { data } = await supabase
        .from('answers')
        .select()
        .eq('id', testAnswerId);

      expect(data?.length).toBe(0);
    });

    it('should not allow unauthorized updates', async () => {
      // Create another user
      const anotherUser = await createTestUser();
      const anotherSession = await loginTestUser(anotherUser.email, anotherUser.password);

      const response = await request(app)
        .put(`/api/answers/${testAnswerId}`)
        .set('Authorization', `Bearer ${anotherSession?.access_token}`)
        .send({ content: 'Unauthorized update attempt' });

      expect(response.status).toBe(403);

      // Clean up
      await deleteTestUser(anotherUser.user.id);
    });
  });

  describe('Answer Acceptance', () => {
    let testAnswerId: number;

    beforeAll(async () => {
      // Create a test answer
      const { data } = await supabase
        .from('answers')
        .insert({
          question_id: testQuestionId,
          user_id: testUser.user.id,
          content: 'Test answer for acceptance'
        })
        .select()
        .single();

      testAnswerId = data?.id;
    });

    it('should accept an answer', async () => {
      const response = await request(app)
        .post(`/api/answers/${testAnswerId}/question/${testQuestionId}/accept`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('is_accepted', true);
    });

    it('should only allow one accepted answer per question', async () => {
      // Create another answer
      const { data: anotherAnswer } = await supabase
        .from('answers')
        .insert({
          question_id: testQuestionId,
          user_id: testUser.user.id,
          content: 'Another test answer'
        })
        .select()
        .single();

      // Accept the new answer
      await request(app)
        .post(`/api/answers/${anotherAnswer?.id}/question/${testQuestionId}/accept`)
        .set('Authorization', `Bearer ${authToken}`);

      // Check that the previous answer is no longer accepted
      const { data: previousAnswer } = await supabase
        .from('answers')
        .select()
        .eq('id', testAnswerId)
        .single();

      expect(previousAnswer?.is_accepted).toBe(false);
    });
  });
}); 