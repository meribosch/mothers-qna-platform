import { Request, Response } from 'express';
import { questionsService } from '../services/supabase';

export const questionsController = {
  async createQuestion(req: Request, res: Response) {
    try {
      const { content } = req.body;
      const userId = req.user?.id;

      if (!content || !userId) {
        return res.status(400).json({
          status: 'error',
          message: 'Content is required and user must be authenticated'
        });
      }

      const { data, error } = await questionsService.createQuestion(userId, content);

      if (error) throw error;

      res.status(201).json({
        status: 'success',
        data
      });
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error creating question',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  async getQuestions(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const { data, error } = await questionsService.getQuestions(limit, offset);

      if (error) throw error;

      res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching questions',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  async getQuestionById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { data, error } = await questionsService.getQuestionById(id);

      if (error) throw error;
      if (!data) {
        return res.status(404).json({
          status: 'error',
          message: 'Question not found'
        });
      }

      res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      console.error('Error fetching question:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching question',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  async getUserQuestions(req: Request, res: Response) {
    try {
      const userId = req.user?.id; // Using authenticated user's ID
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'User must be authenticated'
        });
      }

      const { data, error } = await questionsService.getUserQuestions(userId, limit, offset);

      if (error) throw error;

      res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      console.error('Error fetching user questions:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching user questions',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  async updateQuestion(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { content } = req.body;
      const userId = req.user?.id;

      if (!content || !userId) {
        return res.status(400).json({
          status: 'error',
          message: 'Content is required and user must be authenticated'
        });
      }

      // Verify ownership before update
      const { data: existingQuestion, error: fetchError } = await questionsService.getQuestionById(id);
      
      if (fetchError) throw fetchError;
      if (!existingQuestion) {
        return res.status(404).json({
          status: 'error',
          message: 'Question not found'
        });
      }

      if (existingQuestion.user_id !== userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized to update this question'
        });
      }

      const { data, error } = await questionsService.updateQuestion(id, content);

      if (error) throw error;

      res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error updating question',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  async deleteQuestion(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'User must be authenticated'
        });
      }

      // Verify ownership before deletion
      const { data: existingQuestion, error: fetchError } = await questionsService.getQuestionById(id);
      
      if (fetchError) throw fetchError;
      if (!existingQuestion) {
        return res.status(404).json({
          status: 'error',
          message: 'Question not found'
        });
      }

      if (existingQuestion.user_id !== userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized to delete this question'
        });
      }

      const { error } = await questionsService.deleteQuestion(id);

      if (error) throw error;

      res.status(200).json({
        status: 'success',
        message: 'Question deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error deleting question',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
}; 