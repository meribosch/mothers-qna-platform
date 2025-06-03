import { supabase } from '../supabase';
import { Database } from '../database.types';

type Question = Database['public']['Tables']['momsquestions']['Row'];
type QuestionInsert = Database['public']['Tables']['momsquestions']['Insert'];
type QuestionUpdate = Database['public']['Tables']['momsquestions']['Update'];

export const questionsApi = {
  async getQuestions() {
    const { data, error } = await supabase
      .from('momsquestions')
      .select(`
        *,
        user:user_id (
          email,
          user_metadata
        ),
        answers (count),
        question_tags (
          tags (
            name
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getQuestionById(id: number) {
    const { data, error } = await supabase
      .from('momsquestions')
      .select(`
        *,
        user:user_id (
          email,
          user_metadata
        ),
        answers (
          *,
          user:user_id (
            email,
            user_metadata
          )
        ),
        question_tags (
          tags (
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createQuestion(question: QuestionInsert) {
    const { data, error } = await supabase
      .from('momsquestions')
      .insert(question)
      .select()
      .single();

    if (error) throw error;
    return data as Question;
  },

  async updateQuestion(id: number, question: QuestionUpdate) {
    const { data, error } = await supabase
      .from('momsquestions')
      .update(question)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Question;
  },

  async deleteQuestion(id: number) {
    const { error } = await supabase
      .from('momsquestions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async addTags(questionId: number, tagIds: number[]) {
    const tags = tagIds.map(tagId => ({
      question_id: questionId,
      tag_id: tagId,
    }));

    const { error } = await supabase
      .from('question_tags')
      .insert(tags);

    if (error) throw error;
  },

  async removeTags(questionId: number, tagIds: number[]) {
    const { error } = await supabase
      .from('question_tags')
      .delete()
      .eq('question_id', questionId)
      .in('tag_id', tagIds);

    if (error) throw error;
  },
}; 