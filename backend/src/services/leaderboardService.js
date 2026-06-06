import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const leaderboardService = {
  async getGlobalLeaderboard(limit = 10) {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        avatar: true,
        totalScore: true,
        gamesPlayed: true
      },
      orderBy: { totalScore: 'desc' },
      take: limit
    });
  },

  async getGameLeaderboard(gameId, limit = 10) {
    const scores = await prisma.score.findMany({
      where: { gameId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      },
      orderBy: { points: 'desc' },
      take: limit,
      distinct: ['userId']
    });

    return scores.map((score, index) => ({
      rank: index + 1,
      userId: score.user.id,
      username: score.user.username,
      avatar: score.user.avatar,
      points: score.points,
      gameId: score.gameId
    }));
  },

  async getUserRank(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalScore: true, username: true }
    });

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    const rank = await prisma.user.count({
      where: { totalScore: { gt: user.totalScore } }
    });

    return {
      rank: rank + 1,
      username: user.username,
      totalScore: user.totalScore
    };
  },

  async getGameLeaderboardBySlug(gameSlug, limit = 10) {
    const game = await prisma.game.findUnique({
      where: { slug: gameSlug },
      select: { id: true, name: true }
    });

    if (!game) {
      throw { status: 404, message: 'Game not found' };
    }

    return this.getGameLeaderboard(game.id, limit);
  }
};
