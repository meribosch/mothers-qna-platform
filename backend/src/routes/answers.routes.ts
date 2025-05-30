import { Router } from 'express';
import { answersController } from '../controllers/answers.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get all answers for a question (public)
router.get('/question/:questionId', answersController.getQuestionAnswers);

// Protected routes (require authentication)
router.use(authMiddleware);

// Create a new answer
router.post('/question/:questionId', answersController.createAnswer);

// Update an answer
router.put('/:answerId', answersController.updateAnswer);

// Delete an answer
router.delete('/:answerId', answersController.deleteAnswer);

// Accept an answer
router.post('/:answerId/question/:questionId/accept', answersController.acceptAnswer);

export default router; 