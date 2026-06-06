import { achievementService } from '../services/achievementService.js';

export const achievementController = {
  async getAllAchievements(req, res, next) {
    try {
      const achievements = await achievementService.getAllAchievements();
      res.status(200).json(achievements);
    } catch (error) {
      next(error);
    }
  },

  async getUserAchievements(req, res, next) {
    try {
      const achievements = await achievementService.getUserAchievements(req.userId);
      res.status(200).json(achievements);
    } catch (error) {
      next(error);
    }
  },

  async getAchievementById(req, res, next) {
    try {
      const achievement = await achievementService.getAchievementById(req.params.id);
      res.status(200).json(achievement);
    } catch (error) {
      next(error);
    }
  },

  async getAchievementBySlug(req, res, next) {
    try {
      const achievement = await achievementService.getAchievementBySlug(req.params.slug);
      res.status(200).json(achievement);
    } catch (error) {
      next(error);
    }
  },

  async getAchievementStats(req, res, next) {
    try {
      const stats = await achievementService.getAchievementStats();
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
};
