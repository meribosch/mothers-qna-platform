import { supabase } from '../supabase';
import { Database } from '../database.types';

type Answer = Database['public']['Tables']['answers']['Row'];
type AnswerInsert = Database['public']['Tables']['answers']['Insert'];
type AnswerUpdate = Database['public']['Tables']['answers']['Update'];

export const answersApi = {
  async getAnswers(questionId: number) {
    const { data, error } = await supabase
      .from('answers')
      .select(`
        *,
        user:user_id (
          email,
          user_metadata
        )
      `)
      .eq('question_id', questionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createAnswer(answer: AnswerInsert) {
    const { data, error } = await supabase
      .from('answers')
      .insert(answer)
      .select()
      .single();

    if (error) throw error;
    return data as Answer;
  },

  async updateAnswer(id: number, answer: AnswerUpdate) {
    const { data, error } = await supabase
      .from('answers')
      .update(answer)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Answer;
  },

  async deleteAnswer(id: number) {
    const { error } = await supabase
      .from('answers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async acceptAnswer(id: number) {
    const { data: answer, error: getError } = await supabase
      .from('answers')
      .select('question_id')
      .eq('id', id)
      .single();

    if (getError) throw getError;

    // First, remove accepted status from all answers of this question
    const { error: updateError } = await supabase
      .from('answers')
      .update({ is_accepted: false })
      .eq('question_id', answer.question_id);

    if (updateError) throw updateError;

    // Then, set this answer as accepted
    const { data, error } = await supabase
      .from('answers')
      .update({ is_accepted: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Answer;
  },
}; 