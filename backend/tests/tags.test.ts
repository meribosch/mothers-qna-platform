import request from 'supertest';
import { createTestUser, loginTestUser, deleteTestUser } from './utils/auth.utils';
import { supabase } from '../src/services/supabase';
import app from '../src/server';

interface Question {
  id: number;
  user_id: string;
  content: string;
  created_at?: string;
}

describe('Tags API', () => {
  let testUser: { user: any; email: string; password: string };
  let authToken: string;
  let testQuestionId: number;
  let testTagIds: number[] = [];

  beforeAll(async () => {
    // Create a test user and question
    testUser = await createTestUser();
    const session = await loginTestUser(testUser.email, testUser.password);
    authToken = session?.access_token || '';

    // Create a test question
    const { data: question } = await supabase
      .from('momsquestions')
      .insert({ user_id: testUser.user.id, content: 'Test question for tags' })
      .select()
      .single();

    testQuestionId = question?.id;

    // Create some test tags
    const testTags = [
      { name: 'test-tag-1', description: 'Test tag 1 description' },
      { name: 'test-tag-2', description: 'Test tag 2 description' },
      { name: 'test-tag-3', description: 'Test tag 3 description' }
    ];

    for (const tag of testTags) {
      const { data } = await supabase
        .from('tags')
        .insert(tag)
        .select()
        .single();
      
      if (data) testTagIds.push(data.id);
    }
  });

  afterAll(async () => {
    // Clean up test data
    if (testTagIds.length > 0) {
      await supabase.from('question_tags').delete().in('tag_id', testTagIds);
      await supabase.from('tags').delete().in('id', testTagIds);
    }
    if (testQuestionId) {
      await supabase.from('momsquestions').delete().eq('id', testQuestionId);
    }
    if (testUser?.user?.id) {
      await deleteTestUser(testUser.user.id);
    }
  });

  describe('Tag Management', () => {
    it('should create a new tag', async () => {
      const response = await request(app)
        .post('/api/tags')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'test-create-tag',
          description: 'Tag created during test'
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('name', 'test-create-tag');
      
      // Clean up created tag
      if (response.body.data?.id) {
        testTagIds.push(response.body.data.id);
      }
    });

    it('should not allow duplicate tag names', async () => {
      const response = await request(app)
        .post('/api/tags')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'test-tag-1', // Using existing tag name
          description: 'Duplicate tag test'
        });

      expect(response.status).toBe(500); // Or 400 depending on how we handle this
    });

    it('should get all tags', async () => {
      const response = await request(app)
        .get('/api/tags');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('name');
    });

    it('should search tags', async () => {
      const response = await request(app)
        .get('/api/tags/search?query=test-tag');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data.every((tag: any) => tag.name.includes('test-tag'))).toBe(true);
    });
  });

  describe('Question Tags', () => {
    it('should add tags to a question', async () => {
      const response = await request(app)
        .post(`/api/tags/question/${testQuestionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          tagIds: [testTagIds[0], testTagIds[1]]
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });

    it('should get tags for a question', async () => {
      const response = await request(app)
        .get(`/api/tags/question/${testQuestionId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    it('should remove tags from a question', async () => {
      const response = await request(app)
        .delete(`/api/tags/question/${testQuestionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          tagIds: [testTagIds[0]]
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');

      // Verify removal
      const checkResponse = await request(app)
        .get(`/api/tags/question/${testQuestionId}`);

      expect(checkResponse.body.data.length).toBe(1);
    });
  });

  describe('Popular Tags', () => {
    beforeAll(async () => {
      // Add tags to multiple questions to create popularity data
      const questions: Question[] = [];
      for (let i = 0; i < 3; i++) {
        const { data } = await supabase
          .from('momsquestions')
          .insert({ user_id: testUser.user.id, content: `Popularity test question ${i}` })
          .select<any, Question>()
          .single();
        
        if (data) questions.push(data);
      }

      // Add test-tag-1 to all questions and test-tag-2 to one question
      for (const question of questions) {
        await supabase.from('question_tags').insert({
          question_id: question.id,
          tag_id: testTagIds[0]
        });
      }

      await supabase.from('question_tags').insert({
        question_id: questions[0].id,
        tag_id: testTagIds[1]
      });

      // Clean up questions after test
      afterAll(async () => {
        const questionIds = questions.map(q => q.id);
        await supabase.from('question_tags').delete().in('question_id', questionIds);
        await supabase.from('momsquestions').delete().in('id', questionIds);
      });
    });

    it('should get popular tags', async () => {
      const response = await request(app)
        .get('/api/tags/popular');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      const popularTags = response.body.data;
      const firstTag = popularTags[0];
      const secondTag = popularTags[1];

      // test-tag-1 should be most popular
      expect(firstTag.name).toBe('test-tag-1');
      expect(firstTag.count).toBe(3);

      // test-tag-2 should be second
      expect(secondTag.name).toBe('test-tag-2');
      expect(secondTag.count).toBe(1);
    });

    it('should limit popular tags results', async () => {
      const response = await request(app)
        .get('/api/tags/popular?limit=1');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
  });
}); 