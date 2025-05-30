import { supabase } from './supabase';

interface Tag {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
}

interface QuestionTag {
  question_id: number;
  tag_id: number;
}

export const tagsService = {
  // Create a new tag
  async createTag(name: string, description?: string): Promise<{ data: Tag | null; error: any }> {
    const { data, error } = await supabase
      .from('tags')
      .insert({ name, description })
      .select()
      .single();

    return { data, error };
  },

  // Get all tags
  async getTags(): Promise<{ data: Tag[] | null; error: any }> {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    return { data, error };
  },

  // Get tags for a specific question
  async getQuestionTags(questionId: number): Promise<{ data: Tag[] | null; error: any }> {
    const { data, error } = await supabase
      .from('tags')
      .select(`
        *,
        question_tags!inner(question_id)
      `)
      .eq('question_tags.question_id', questionId);

    return { data, error };
  },

  // Add tags to a question
  async addTagsToQuestion(questionId: number, tagIds: number[]): Promise<{ error: any }> {
    const questionTags = tagIds.map(tagId => ({
      question_id: questionId,
      tag_id: tagId
    }));

    const { error } = await supabase
      .from('question_tags')
      .insert(questionTags);

    return { error };
  },

  // Remove tags from a question
  async removeTagsFromQuestion(questionId: number, tagIds: number[]): Promise<{ error: any }> {
    const { error } = await supabase
      .from('question_tags')
      .delete()
      .eq('question_id', questionId)
      .in('tag_id', tagIds);

    return { error };
  },

  // Search tags by name
  async searchTags(query: string): Promise<{ data: Tag[] | null; error: any }> {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name');

    return { data, error };
  },

  // Get popular tags (most used)
  async getPopularTags(limit = 10): Promise<{ data: any[] | null; error: any }> {
    const { data, error } = await supabase
      .from('question_tags')
      .select(`
        tag_id,
        tags!inner(name),
        count:count(*)
      `)
      .groupBy('tag_id, tags.name')
      .order('count', { ascending: false })
      .limit(limit);

    return { data, error };
  }
}; 