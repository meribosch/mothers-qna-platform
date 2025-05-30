import request from 'supertest';
import { createTestUser, loginTestUser, deleteTestUser } from './utils/auth.utils';
import { supabase } from '../src/services/supabase';
import app from '../src/server';

describe('Search API', () => {
  let testUser: { user: any; email: string; password: string };
  let authToken: string;
  let testQuestions: any[] = [];
  let testTags: any[] = [];

  beforeAll(async () => {
    // Create test user
    testUser = await createTestUser();
    const session = await loginTestUser(testUser.email, testUser.password);
    authToken = session?.access_token || '';

    // Create test tags
    const tags = [
      { name: 'feeding', description: 'Questions about feeding' },
      { name: 'sleep', description: 'Questions about sleep' },
      { name: 'health', description: 'Questions about health' }
    ];

    for (const tag of tags) {
      const { data } = await supabase
        .from('tags')
        .insert(tag)
        .select()
        .single();
      
      if (data) testTags.push(data);
    }

    // Create test questions with different tags
    const questions = [
      {
        content: 'How often should I feed my newborn?',
        user_id: testUser.user.id,
        tags: [testTags[0].id] // feeding
      },
      {
        content: 'Best sleep schedule for 3-month-old',
        user_id: testUser.user.id,
        tags: [testTags[1].id] // sleep
      },
      {
        content: 'Baby not sleeping and feeding issues',
        user_id: testUser.user.id,
        tags: [testTags[0].id, testTags[1].id] // feeding, sleep
      },
      {
        content: 'Common health issues in newborns',
        user_id: testUser.user.id,
        tags: [testTags[2].id] // health
      }
    ];

    for (const question of questions) {
      const { data: questionData } = await supabase
        .from('momsquestions')
        .insert({ content: question.content, user_id: question.user_id })
        .select()
        .single();

      if (questionData) {
        // Add tags to question
        await supabase.from('question_tags').insert(
          question.tags.map(tagId => ({
            question_id: questionData.id,
            tag_id: tagId
          }))
        );
        testQuestions.push(questionData);
      }
    }
  });

  afterAll(async () => {
    // Clean up test data
    const questionIds = testQuestions.map(q => q.id);
    await supabase.from('question_tags').delete().in('question_id', questionIds);
    await supabase.from('momsquestions').delete().in('id', questionIds);
    await supabase.from('tags').delete().in('id', testTags.map(t => t.id));
    await deleteTestUser(testUser.user.id);
  });

  describe('Search Questions', () => {
    it('should search questions by text query', async () => {
      const response = await request(app)
        .get('/api/search/questions?query=feeding');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2); // Should find 2 questions with "feeding"
      expect(response.body.data.every((q: any) => 
        q.content.toLowerCase().includes('feed')
      )).toBe(true);
    });

    it('should filter questions by tags', async () => {
      const response = await request(app)
        .get(`/api/search/questions?tags=${testTags[0].id}`); // feeding tag

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2); // Should find 2 questions with feeding tag
      expect(response.body.data.every((q: any) => 
        q.tags.some((t: any) => t.id === testTags[0].id)
      )).toBe(true);
    });

    it('should filter questions by multiple tags', async () => {
      const response = await request(app)
        .get(`/api/search/questions?tags=${testTags[0].id}&tags=${testTags[1].id}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1); // Should find 1 question with both tags
      expect(response.body.data[0].tags.length).toBe(2);
    });

    it('should paginate search results', async () => {
      const response = await request(app)
        .get('/api/search/questions?limit=2&page=0');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.pagination).toEqual({
        page: 0,
        limit: 2,
        total: 4
      });
    });

    it('should filter questions by user', async () => {
      const response = await request(app)
        .get(`/api/search/questions?userId=${testUser.user.id}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(4); // Should find all test questions
      expect(response.body.data.every((q: any) => 
        q.user_id === testUser.user.id
      )).toBe(true);
    });
  });

  describe('Related Questions', () => {
    it('should get related questions based on tags', async () => {
      // Get related questions for the question with both feeding and sleep tags
      const questionWithMultipleTags = testQuestions.find(q => 
        q.content.includes('not sleeping and feeding')
      );

      const response = await request(app)
        .get(`/api/search/questions/${questionWithMultipleTags.id}/related`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2); // Should find 2 related questions (one with feeding, one with sleep)
      expect(response.body.data.every((q: any) => 
        q.id !== questionWithMultipleTags.id
      )).toBe(true);
    });

    it('should limit related questions', async () => {
      const questionWithMultipleTags = testQuestions.find(q => 
        q.content.includes('not sleeping and feeding')
      );

      const response = await request(app)
        .get(`/api/search/questions/${questionWithMultipleTags.id}/related?limit=1`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
    });
  });
}); 