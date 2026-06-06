import { Router } from 'express';
import { gameController } from '../controllers/gameController.js';

const router = Router();

router.get('/', gameController.getAllGames);
router.get('/by-slug/:slug', gameController.getGameBySlug);
router.get('/by-category/:category', gameController.getGamesByCategory);
router.get('/:id', gameController.getGameById);

export default router;
