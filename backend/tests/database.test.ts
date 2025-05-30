import { supabase } from '../src/services/supabase';
import { createTestUser, deleteTestUser } from './utils/auth.utils';
import { questionsService } from '../src/services/supabase';

describe('Database Operations', () => {
  let testUser: { user: any; email: string; password: string };
  let testQuestionId: number;

  beforeAll(async () => {
    // Create a test user
    testUser = await createTestUser();
  });

  afterAll(async () => {
    // Clean up test user and their questions
    if (testUser?.user?.id) {
      await supabase
        .from('momsquestions')
        .delete()
        .eq('user_id', testUser.user.id);
      
      await deleteTestUser(testUser.user.id);
    }
  });

  describe('Questions CRUD Operations', () => {
    it('should create a new question', async () => {
      const { data, error } = await questionsService.createQuestion(
        testUser.user.id,
        'Test question content'
      );

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data).toHaveProperty('content', 'Test question content');
      expect(data).toHaveProperty('user_id', testUser.user.id);

      testQuestionId = data.id;
    });

    it('should retrieve questions with pagination', async () => {
      // Create multiple questions for pagination test
      await Promise.all([
        questionsService.createQuestion(testUser.user.id, 'Question 1'),
        questionsService.createQuestion(testUser.user.id, 'Question 2'),
        questionsService.createQuestion(testUser.user.id, 'Question 3')
      ]);

      const { data, error } = await questionsService.getQuestions(2, 0);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeLessThanOrEqual(2);
    });

    it('should retrieve a specific question by ID', async () => {
      const { data, error } = await questionsService.getQuestionById(testQuestionId);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data).toHaveProperty('id', testQuestionId);
      expect(data).toHaveProperty('content', 'Test question content');
    });

    it('should retrieve questions for a specific user', async () => {
      const { data, error } = await questionsService.getUserQuestions(testUser.user.id);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data.every(q => q.user_id === testUser.user.id)).toBe(true);
    });

    it('should update a question', async () => {
      const updatedContent = 'Updated test question content';
      const { data, error } = await questionsService.updateQuestion(
        testQuestionId,
        updatedContent
      );

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data).toHaveProperty('id', testQuestionId);
      expect(data).toHaveProperty('content', updatedContent);
    });

    it('should delete a question', async () => {
      const { error } = await questionsService.deleteQuestion(testQuestionId);
      expect(error).toBeNull();

      // Verify question is deleted
      const { data, error: fetchError } = await questionsService.getQuestionById(testQuestionId);
      expect(data).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent question retrieval', async () => {
      const { data, error } = await questionsService.getQuestionById(999999);
      expect(data).toBeNull();
    });

    it('should handle invalid question updates', async () => {
      const { data, error } = await questionsService.updateQuestion(999999, 'Updated content');
      expect(error).toBeDefined();
    });

    it('should handle invalid question deletions', async () => {
      const { error } = await questionsService.deleteQuestion(999999);
      expect(error).toBeDefined();
    });
  });
}); 