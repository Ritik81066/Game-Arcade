import { leaderboardService } from '../services/leaderboardService.js';

export const leaderboardController = {
  async getGlobalLeaderboard(req, res, next) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const leaderboard = await leaderboardService.getGlobalLeaderboard(limit);
      
      const withRanks = leaderboard.map((user, index) => ({
        rank: index + 1,
        ...user
      }));

      res.status(200).json(withRanks);
    } catch (error) {
      next(error);
    }
  },

  async getGameLeaderboard(req, res, next) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const leaderboard = await leaderboardService.getGameLeaderboardBySlug(req.params.gameSlug, limit);
      res.status(200).json(leaderboard);
    } catch (error) {
      next(error);
    }
  },

  async getUserRank(req, res, next) {
    try {
      const rank = await leaderboardService.getUserRank(req.userId);
      res.status(200).json(rank);
    } catch (error) {
      next(error);
    }
  }
};
