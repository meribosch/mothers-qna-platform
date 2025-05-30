import { Request, Response } from 'express';
import { tagsService } from '../services/tags.service';

export const tagsController = {
  // Create a new tag (admin only)
  async createTag(req: Request, res: Response) {
    try {
      const { name, description } = req.body;

      // TODO: Add admin role check
      const { data, error } = await tagsService.createTag(name, description);

      if (error) throw error;

      res.status(201).json({
        status: 'success',
        data
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error creating tag',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  // Get all tags
  async getTags(req: Request, res: Response) {
    try {
      const { data, error } = await tagsService.getTags();

      if (error) throw error;

      res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching tags',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  // Get tags for a specific question
  async getQuestionTags(req: Request, res: Response) {
    try {
      const { questionId } = req.params;
      const { data, error } = await tagsService.getQuestionTags(parseInt(questionId));

      if (error) throw error;

      res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching question tags',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  // Add tags to a question
  async addTagsToQuestion(req: Request, res: Response) {
    try {
      const { questionId } = req.params;
      const { tagIds } = req.body;
      const userId = req.user?.id;

      // TODO: Add check for question ownership

      const { error } = await tagsService.addTagsToQuestion(parseInt(questionId), tagIds);

      if (error) throw error;

      res.status(200).json({
        status: 'success',
        message: 'Tags added successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error adding tags',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  // Remove tags from a question
  async removeTagsFromQuestion(req: Request, res: Response) {
    try {
      const { questionId } = req.params;
      const { tagIds } = req.body;
      const userId = req.user?.id;

      // TODO: Add check for question ownership

      const { error } = await tagsService.removeTagsFromQuestion(parseInt(questionId), tagIds);

      if (error) throw error;

      res.status(200).json({
        status: 'success',
        message: 'Tags removed successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error removing tags',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  // Search tags
  async searchTags(req: Request, res: Response) {
    try {
      const { query } = req.query;

      if (typeof query !== 'string') {
        return res.status(400).json({
          status: 'error',
          message: 'Search query is required'
        });
      }

      const { data, error } = await tagsService.searchTags(query);

      if (error) throw error;

      res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error searching tags',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  // Get popular tags
  async getPopularTags(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const { data, error } = await tagsService.getPopularTags(limit);

      if (error) throw error;

      res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching popular tags',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
}; 