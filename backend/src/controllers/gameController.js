import { gameService } from '../services/gameService.js';

export const gameController = {
  async getAllGames(req, res, next) {
    try {
      const games = await gameService.getAllGames();
      res.status(200).json(games);
    } catch (error) {
      next(error);
    }
  },

  async getGameById(req, res, next) {
    try {
      const game = await gameService.getGameById(req.params.id);
      res.status(200).json(game);
    } catch (error) {
      next(error);
    }
  },

  async getGameBySlug(req, res, next) {
    try {
      const game = await gameService.getGameBySlug(req.params.slug);
      res.status(200).json(game);
    } catch (error) {
      next(error);
    }
  },

  async getGamesByCategory(req, res, next) {
    try {
      const games = await gameService.getGamesByCategory(req.params.category);
      res.status(200).json(games);
    } catch (error) {
      next(error);
    }
  }
};
