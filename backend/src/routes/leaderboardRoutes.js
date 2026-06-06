import { Router } from 'express';
import { leaderboardController } from '../controllers/leaderboardController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/global', leaderboardController.getGlobalLeaderboard);
router.get('/game/:gameSlug', leaderboardController.getGameLeaderboard);
router.get('/my-rank', authenticateToken, leaderboardController.getUserRank);

export default router;
