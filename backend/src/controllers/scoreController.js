import { scoreService } from '../services/scoreService.js';
import { body, validationResult } from 'express-validator';

export const scoreController = {
  async submitScore(req, res, next) {
    try {
      await body('gameId').exists().run(req);
      await body('points').isInt({ min: 0 }).run(req);
      await body('duration').isInt({ min: 0 }).run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { gameId, points, duration } = req.body;
      const score = await scoreService.submitScore(req.userId, gameId, points, duration);
      res.status(201).json(score);
    } catch (error) {
      next(error);
    }
  },

  async submitScoreBySlug(req, res, next) {
    try {
      await body('gameSlug').exists().run(req);
      await body('points').isInt({ min: 0 }).run(req);
      await body('duration').isInt({ min: 0 }).run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { gameSlug, points, duration } = req.body;
      const score = await scoreService.submitScoreBySlug(req.userId, gameSlug, points, duration);
      res.status(201).json(score);
    } catch (error) {
      next(error);
    }
  },

  async getUserScores(req, res, next) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;
      const scores = await scoreService.getUserScores(req.userId, limit);
      res.status(200).json(scores);
    } catch (error) {
      next(error);
    }
  },

  async getGameScores(req, res, next) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;
      const scores = await scoreService.getGameScores(req.params.gameId, limit);
      res.status(200).json(scores);
    } catch (error) {
      next(error);
    }
  },

  async getHighestScores(req, res, next) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;
      const scores = await scoreService.getHighestScores(limit);
      res.status(200).json(scores);
    } catch (error) {
      next(error);
    }
  }
};
