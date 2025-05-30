import { Router } from 'express';
import { tagsController } from '../controllers/tags.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', tagsController.getTags);
router.get('/search', tagsController.searchTags);
router.get('/popular', tagsController.getPopularTags);
router.get('/question/:questionId', tagsController.getQuestionTags);

// Protected routes
router.use(authMiddleware);

// Admin only
router.post('/', tagsController.createTag); // TODO: Add admin middleware

// Question owner only
router.post('/question/:questionId', tagsController.addTagsToQuestion);
router.delete('/question/:questionId', tagsController.removeTagsFromQuestion);

export default router; 