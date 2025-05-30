import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const questionsService = {
  async createQuestion(userId: string, content: string) {
    return await supabase
      .from('momsquestions')
      .insert({
        user_id: userId,
        content
      })
      .select()
      .single();
  },

  async getQuestions(limit = 10, offset = 0) {
    return await supabase
      .from('momsquestions')
      .select(`
        *,
        Users (
          email
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
  },

  async getQuestionById(id: number) {
    return await supabase
      .from('momsquestions')
      .select(`
        *,
        Users (
          email
        )
      `)
      .eq('id', id)
      .single();
  },

  async getUserQuestions(userId: string, limit = 10, offset = 0) {
    return await supabase
      .from('momsquestions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
  },

  async updateQuestion(id: number, content: string) {
    return await supabase
      .from('momsquestions')
      .update({ content })
      .eq('id', id)
      .select()
      .single();
  },

  async deleteQuestion(id: number) {
    return await supabase
      .from('momsquestions')
      .delete()
      .eq('id', id);
  }
}; 