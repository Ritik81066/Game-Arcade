import api from './api';

export const authService = {
  register: (email, username, password) =>
    api.post('/auth/register', { email, username, password }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  getProfile: () =>
    api.get('/auth/profile'),

  updateProfile: (data) =>
    api.put('/auth/profile', data),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const gameService = {
  getAllGames: () =>
    api.get('/games'),

  getGameById: (id) =>
    api.get(`/games/${id}`),

  getGameBySlug: (slug) =>
    api.get(`/games/by-slug/${slug}`),

  getGamesByCategory: (category) =>
    api.get(`/games/by-category/${category}`),
};

export const scoreService = {
  submitScore: (gameId, points, duration) =>
    api.post('/scores', { gameId, points, duration }),

  getUserScores: (limit = 50) =>
    api.get('/scores/user', { params: { limit } }),

  getGameScores: (gameId, limit = 50) =>
    api.get(`/scores/game/${gameId}`, { params: { limit } }),

  getHighestScores: (limit = 50) =>
    api.get('/scores/highest', { params: { limit } }),
};

export const leaderboardService = {
  getGlobalLeaderboard: (limit = 10) =>
    api.get('/leaderboards/global', { params: { limit } }),

  getGameLeaderboard: (gameSlug, limit = 10) =>
    api.get(`/leaderboards/game/${gameSlug}`, { params: { limit } }),

  getUserRank: () =>
    api.get('/leaderboards/my-rank'),
};

export const achievementService = {
  getAllAchievements: () =>
    api.get('/achievements'),

  getUserAchievements: () =>
    api.get('/achievements/user'),

  getAchievementStats: () =>
    api.get('/achievements/stats'),

  getAchievementById: (id) =>
    api.get(`/achievements/${id}`),

  getAchievementBySlug: (slug) =>
    api.get(`/achievements/by-slug/${slug}`),
};
