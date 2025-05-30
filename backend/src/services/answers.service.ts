import { supabase } from './supabase';

interface Answer {
  id?: number;
  question_id: number;
  user_id: string;
  content: string;
  created_at?: string;
  is_accepted?: boolean;
}

export const answersService = {
  // Create a new answer
  async createAnswer(questionId: number, userId: string, content: string): Promise<{ data: Answer | null; error: any }> {
    const { data, error } = await supabase
      .from('answers')
      .insert({
        question_id: questionId,
        user_id: userId,
        content,
        is_accepted: false
      })
      .select()
      .single();

    return { data, error };
  },

  // Get all answers for a specific question
  async getQuestionAnswers(questionId: number, page = 0, limit = 10): Promise<{ data: Answer[] | null; error: any }> {
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .eq('question_id', questionId)
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    return { data, error };
  },

  // Update an answer
  async updateAnswer(answerId: number, content: string): Promise<{ data: Answer | null; error: any }> {
    const { data, error } = await supabase
      .from('answers')
      .update({ content })
      .eq('id', answerId)
      .select()
      .single();

    return { data, error };
  },

  // Delete an answer
  async deleteAnswer(answerId: number): Promise<{ error: any }> {
    const { error } = await supabase
      .from('answers')
      .delete()
      .eq('id', answerId);

    return { error };
  },

  // Mark an answer as accepted
  async acceptAnswer(answerId: number, questionId: number): Promise<{ data: Answer | null; error: any }> {
    // First, unmark any previously accepted answer for this question
    await supabase
      .from('answers')
      .update({ is_accepted: false })
      .eq('question_id', questionId);

    // Then mark the new accepted answer
    const { data, error } = await supabase
      .from('answers')
      .update({ is_accepted: true })
      .eq('id', answerId)
      .select()
      .single();

    return { data, error };
  }
}; 