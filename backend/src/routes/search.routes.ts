import { Router } from 'express';
import { searchController } from '../controllers/search.controller';

const router = Router();

// Search questions with filters
router.get('/questions', searchController.searchQuestions);

// Get related questions
router.get('/questions/:questionId/related', searchController.getRelatedQuestions);

export default router; 