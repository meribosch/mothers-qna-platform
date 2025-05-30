import { Request, Response } from 'express';
import { answersService } from '../services/answers.service';

export const answersController = {
  // Create a new answer
  async createAnswer(req: Request, res: Response) {
    try {
      const { questionId } = req.params;
      const { content } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated'
        });
      }

      const { data, error } = await answersService.createAnswer(
        parseInt(questionId),
        userId,
        content
      );

      if (error) throw error;

      res.status(201).json({
        status: 'success',
        data
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error creating answer',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  // Get all answers for a question
  async getQuestionAnswers(req: Request, res: Response) {
    try {
      const { questionId } = req.params;
      const page = parseInt(req.query.page as string) || 0;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data, error } = await answersService.getQuestionAnswers(
        parseInt(questionId),
        page,
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
        message: 'Error fetching answers',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  // Update an answer
  async updateAnswer(req: Request, res: Response) {
    try {
      const { answerId } = req.params;
      const { content } = req.body;
      const userId = req.user?.id;

      // First, check if the user owns this answer
      const { data: answer } = await answersService.getQuestionAnswers(parseInt(answerId));
      
      if (!answer || !answer[0]) {
        return res.status(404).json({
          status: 'error',
          message: 'Answer not found'
        });
      }

      if (answer[0].user_id !== userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized to update this answer'
        });
      }

      const { data, error } = await answersService.updateAnswer(
        parseInt(answerId),
        content
      );

      if (error) throw error;

      res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error updating answer',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  // Delete an answer
  async deleteAnswer(req: Request, res: Response) {
    try {
      const { answerId } = req.params;
      const userId = req.user?.id;

      // First, check if the user owns this answer
      const { data: answer } = await answersService.getQuestionAnswers(parseInt(answerId));
      
      if (!answer || !answer[0]) {
        return res.status(404).json({
          status: 'error',
          message: 'Answer not found'
        });
      }

      if (answer[0].user_id !== userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized to delete this answer'
        });
      }

      const { error } = await answersService.deleteAnswer(parseInt(answerId));

      if (error) throw error;

      res.status(200).json({
        status: 'success',
        message: 'Answer deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error deleting answer',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  // Accept an answer
  async acceptAnswer(req: Request, res: Response) {
    try {
      const { answerId, questionId } = req.params;
      const userId = req.user?.id;

      // First, check if the user owns the question
      const { data: question } = await answersService.getQuestionAnswers(parseInt(questionId));
      
      if (!question) {
        return res.status(404).json({
          status: 'error',
          message: 'Question not found'
        });
      }

      // TODO: Add check for question ownership once we have the questions service integrated

      const { data, error } = await answersService.acceptAnswer(
        parseInt(answerId),
        parseInt(questionId)
      );

      if (error) throw error;

      res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error accepting answer',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
}; 