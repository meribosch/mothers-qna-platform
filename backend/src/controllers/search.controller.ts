import { Request, Response } from 'express';
import { searchService } from '../services/search.service';

export const searchController = {
  // Search questions
  async searchQuestions(req: Request, res: Response) {
    try {
      const {
        query,
        tags,
        page = '0',
        limit = '10',
        userId
      } = req.query;

      const searchOptions = {
        query: query as string,
        tagIds: tags ? (Array.isArray(tags) ? tags.map(Number) : [Number(tags)]) : undefined,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        userId: userId as string
      };

      const [{ data, error }, { count, error: countError }] = await Promise.all([
        searchService.searchQuestions(searchOptions),
        searchService.getSearchResultsCount(searchOptions)
      ]);

      if (error || countError) throw error || countError;

      res.status(200).json({
        status: 'success',
        data,
        pagination: {
          page: searchOptions.page,
          limit: searchOptions.limit,
          total: count
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error searching questions',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  // Get related questions
  async getRelatedQuestions(req: Request, res: Response) {
    try {
      const { questionId } = req.params;
      const limit = parseInt(req.query.limit as string) || 5;

      const { data, error } = await searchService.getRelatedQuestions(
        parseInt(questionId),
        limit
      );

      if (error) throw error;

      res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching related questions',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
}; 