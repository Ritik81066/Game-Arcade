import { body, validationResult } from 'express-validator';
import { authService } from '../services/authService.js';

export const authController = {
  async register(req, res, next) {
    try {
      await body('email').isEmail().run(req);
      await body('username').isLength({ min: 3 }).run(req);
      await body('password').isLength({ min: 8 }).run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, username, password } = req.body;
      const result = await authService.register(email, username, password);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      await body('email').isEmail().run(req);
      await body('password').exists().run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req, res, next) {
    try {
      const user = await authService.getUserById(req.userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const { username, avatar, bio } = req.body;
      const user = await authService.updateUserProfile(req.userId, {
        username,
        avatar,
        bio
      });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
};
