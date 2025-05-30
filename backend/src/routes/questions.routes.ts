import { Router } from 'express';
import { questionsController } from '../controllers/questions.controller';
import { authenticateUser, checkResourceOwnership } from '../middleware/auth.middleware';

const router = Router();

// Public routes
// Get all questions with pagination
router.get('/', questionsController.getQuestions);

// Get a specific question by ID
router.get('/:id', questionsController.getQuestionById);

// Protected routes
// Get questions by user ID (protected + ownership check)
router.get('/user/:userId', authenticateUser, checkResourceOwnership, questionsController.getUserQuestions);

// Create a new question (protected)
router.post('/', authenticateUser, questionsController.createQuestion);

// Update a question (protected + ownership check)
router.put('/:id', authenticateUser, checkResourceOwnership, questionsController.updateQuestion);

// Delete a question (protected + ownership check)
router.delete('/:id', authenticateUser, checkResourceOwnership, questionsController.deleteQuestion);

export default router; 