import { Router } from 'express';
import { scoreController } from '../controllers/scoreController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateToken, scoreController.submitScore);
router.post('/by-slug', authenticateToken, scoreController.submitScoreBySlug);
router.get('/user', authenticateToken, scoreController.getUserScores);
router.get('/highest', scoreController.getHighestScores);
router.get('/game/:gameId', scoreController.getGameScores);

export default router;
