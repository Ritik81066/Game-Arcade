import { Router } from 'express';
import { achievementController } from '../controllers/achievementController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', achievementController.getAllAchievements);
router.get('/user', authenticateToken, achievementController.getUserAchievements);
router.get('/stats', achievementController.getAchievementStats);
router.get('/by-slug/:slug', achievementController.getAchievementBySlug);
router.get('/:id', achievementController.getAchievementById);

export default router;
