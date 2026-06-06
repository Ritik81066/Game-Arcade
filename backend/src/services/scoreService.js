import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const scoreService = {
  async submitScore(userId, gameId, points, duration) {
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      throw { status: 404, message: 'Game not found' };
    }

    const score = await prisma.score.create({
      data: {
        userId,
        gameId,
        points,
        duration
      }
    });

    // Update user total score and games played
    const allScores = await prisma.score.findMany({ where: { userId } });
    const totalScore = allScores.reduce((sum, s) => sum + s.points, 0);

    await prisma.user.update({
      where: { id: userId },
      data: {
        totalScore,
        gamesPlayed: allScores.length
      }
    });

    // Check and award achievements
    await this.checkAndAwardAchievements(userId);

    return score;
  },

  async submitScoreBySlug(userId, gameSlug, points, duration) {
    const game = await prisma.game.findUnique({ where: { slug: gameSlug } });
    if (!game) {
      throw { status: 404, message: 'Game not found' };
    }

    return this.submitScore(userId, game.id, points, duration);
  },

  async getUserScores(userId, limit = 50) {
    return prisma.score.findMany({
      where: { userId },
      include: { game: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  },

  async getGameScores(gameId, limit = 50) {
    return prisma.score.findMany({
      where: { gameId },
      include: { user: true },
      orderBy: { points: 'desc' },
      take: limit
    });
  },

  async getHighestScores(limit = 50) {
    return prisma.score.findMany({
      include: { user: true, game: true },
      orderBy: { points: 'desc' },
      take: limit,
      distinct: ['gameId', 'userId']
    });
  },

  async getTopScoreForGame(gameId) {
    return prisma.score.findFirst({
      where: { gameId },
      include: { user: true },
      orderBy: { points: 'desc' }
    });
  },

  async checkAndAwardAchievements(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { achievements: true, scores: true }
    });

    const achievements = await prisma.achievement.findMany();

    for (const achievement of achievements) {
      // Check if already unlocked
      const alreadyUnlocked = user.achievements.some(ua => ua.achievementId === achievement.id);
      if (alreadyUnlocked) continue;

      let shouldUnlock = false;

      switch (achievement.criteria) {
        case 'win_game':
          shouldUnlock = user.scores.length > 0;
          break;
        case 'score_1000':
          shouldUnlock = user.scores.some(s => s.points >= 1000);
          break;
        case 'play_10_games':
          shouldUnlock = user.scores.length >= 10;
          break;
        case 'play_50_games':
          shouldUnlock = user.scores.length >= 50;
          break;
        case 'speed_run':
          shouldUnlock = user.scores.some(s => s.duration < 30);
          break;
        case 'top_score':
          // Check if this user has the top score in any game
          for (const score of user.scores) {
            const topScore = await prisma.score.findFirst({
              where: { gameId: score.gameId },
              orderBy: { points: 'desc' }
            });
            if (topScore.userId === userId) {
              shouldUnlock = true;
              break;
            }
          }
          break;
        case 'perfect_score':
          shouldUnlock = user.scores.some(s => s.points >= 10000);
          break;
      }

      if (shouldUnlock) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id
          }
        }).catch(() => {
          // Achievement may already exist
        });
      }
    }
  }
};
