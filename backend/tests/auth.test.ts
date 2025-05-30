import request from 'supertest';
import { createTestUser, loginTestUser, deleteTestUser } from './utils/auth.utils';
import { supabase } from '../src/services/supabase';
import app from '../src/server'; // Make sure to export app from server.ts

describe('Authentication', () => {
  let testUser: { user: any; email: string; password: string };
  let authToken: string;

  beforeAll(async () => {
    // Create a test user
    testUser = await createTestUser();
    const session = await loginTestUser(testUser.email, testUser.password);
    authToken = session?.access_token || '';
  });

  afterAll(async () => {
    // Clean up test user
    if (testUser?.user?.id) {
      await deleteTestUser(testUser.user.id);
    }
  });

  describe('Protected Routes', () => {
    it('should reject requests without authentication', async () => {
      const response = await request(app)
        .post('/api/questions')
        .send({ content: 'Test question' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'No authorization header');
    });

    it('should accept requests with valid authentication', async () => {
      const response = await request(app)
        .post('/api/questions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Test question' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('content', 'Test question');
    });

    it('should reject requests with invalid token', async () => {
      const response = await request(app)
        .post('/api/questions')
        .set('Authorization', 'Bearer invalid_token')
        .send({ content: 'Test question' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid or expired token');
    });
  });

  describe('Resource Ownership', () => {
    let questionId: number;

    beforeAll(async () => {
      // Create a test question
      const { data } = await supabase
        .from('momsquestions')
        .insert({ user_id: testUser.user.id, content: 'Test question for ownership' })
        .select()
        .single();
      
      questionId = data?.id;
    });

    it('should allow user to access their own questions', async () => {
      const response = await request(app)
        .get(`/api/questions/user/${testUser.user.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.some((q: any) => q.content === 'Test question for ownership')).toBe(true);
    });

    it('should not allow user to access other users questions', async () => {
      const response = await request(app)
        .get('/api/questions/user/other-user-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Unauthorized to access this resource');
    });

    it('should allow user to update their own question', async () => {
      const response = await request(app)
        .put(`/api/questions/${questionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Updated test question' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('content', 'Updated test question');
    });

    it('should allow user to delete their own question', async () => {
      const response = await request(app)
        .delete(`/api/questions/${questionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Question deleted successfully');
    });
  });
}); 