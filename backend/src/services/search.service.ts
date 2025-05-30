import { supabase } from './supabase';

interface SearchOptions {
  query?: string;
  tagIds?: number[];
  page?: number;
  limit?: number;
  userId?: string;
}

interface SearchResult {
  id: number;
  content: string;
  user_id: string;
  created_at: string;
  tags: {
    id: number;
    name: string;
  }[];
  answer_count: number;
}

export const searchService = {
  // Search questions with various filters
  async searchQuestions(options: SearchOptions = {}): Promise<{ data: SearchResult[] | null; error: any }> {
    const {
      query = '',
      tagIds = [],
      page = 0,
      limit = 10,
      userId
    } = options;

    let queryBuilder = supabase
      .from('momsquestions')
      .select(`
        *,
        tags:question_tags(
          tag:tags(
            id,
            name
          )
        ),
        answer_count:answers(count)
      `);

    // Add text search if query is provided
    if (query) {
      queryBuilder = queryBuilder.textSearch('content', query);
    }

    // Add tag filter if tagIds are provided
    if (tagIds.length > 0) {
      queryBuilder = queryBuilder.in('question_tags.tag_id', tagIds);
    }

    // Add user filter if userId is provided
    if (userId) {
      queryBuilder = queryBuilder.eq('user_id', userId);
    }

    // Add pagination
    queryBuilder = queryBuilder
      .range(page * limit, (page + 1) * limit - 1)
      .order('created_at', { ascending: false });

    const { data, error } = await queryBuilder;

    if (error) return { data: null, error };

    // Transform the data to match SearchResult interface
    const transformedData = data.map(item => ({
      id: item.id,
      content: item.content,
      user_id: item.user_id,
      created_at: item.created_at,
      tags: item.tags.map((t: any) => t.tag),
      answer_count: item.answer_count?.[0]?.count || 0
    }));

    return { data: transformedData, error: null };
  },

  // Get total count of search results (for pagination)
  async getSearchResultsCount(options: SearchOptions = {}): Promise<{ count: number | null; error: any }> {
    const {
      query = '',
      tagIds = [],
      userId
    } = options;

    let queryBuilder = supabase
      .from('momsquestions')
      .select('*', { count: 'exact', head: true });

    if (query) {
      queryBuilder = queryBuilder.textSearch('content', query);
    }

    if (tagIds.length > 0) {
      queryBuilder = queryBuilder.in('question_tags.tag_id', tagIds);
    }

    if (userId) {
      queryBuilder = queryBuilder.eq('user_id', userId);
    }

    const { count, error } = await queryBuilder;

    return { count, error };
  },

  // Get related questions based on tags
  async getRelatedQuestions(questionId: number, limit = 5): Promise<{ data: SearchResult[] | null; error: any }> {
    // First get the tags of the current question
    const { data: questionTags, error: tagsError } = await supabase
      .from('question_tags')
      .select('tag_id')
      .eq('question_id', questionId);

    if (tagsError) return { data: null, error: tagsError };

    const tagIds = questionTags.map(t => t.tag_id);

    if (tagIds.length === 0) {
      return { data: [], error: null };
    }

    // Then find questions with similar tags
    const { data, error } = await supabase
      .from('momsquestions')
      .select(`
        *,
        tags:question_tags(
          tag:tags(
            id,
            name
          )
        ),
        answer_count:answers(count)
      `)
      .neq('id', questionId) // Exclude the current question
      .in('question_tags.tag_id', tagIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error };

    // Transform the data
    const transformedData = data.map(item => ({
      id: item.id,
      content: item.content,
      user_id: item.user_id,
      created_at: item.created_at,
      tags: item.tags.map((t: any) => t.tag),
      answer_count: item.answer_count?.[0]?.count || 0
    }));

    return { data: transformedData, error: null };
  }
}; 