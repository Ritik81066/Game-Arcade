import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const achievementService = {
  async getAllAchievements() {
    return prisma.achievement.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  async getUserAchievements(userId) {
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' }
    });

    return userAchievements.map(ua => ({
      id: ua.achievement.id,
      name: ua.achievement.name,
      slug: ua.achievement.slug,
      description: ua.achievement.description,
      icon: ua.achievement.icon,
      reward: ua.achievement.reward,
      unlockedAt: ua.unlockedAt
    }));
  },

  async getAchievementById(achievementId) {
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId }
    });

    if (!achievement) {
      throw { status: 404, message: 'Achievement not found' };
    }

    return achievement;
  },

  async getAchievementBySlug(slug) {
    const achievement = await prisma.achievement.findUnique({
      where: { slug }
    });

    if (!achievement) {
      throw { status: 404, message: 'Achievement not found' };
    }

    return achievement;
  },

  async getAchievementStats() {
    const achievements = await prisma.achievement.findMany({
      include: {
        users: true
      }
    });

    return achievements.map(achievement => ({
      id: achievement.id,
      name: achievement.name,
      slug: achievement.slug,
      description: achievement.description,
      unlockedBy: achievement.users.length
    }));
  },

  async checkUserAchievement(userId, achievementId) {
    const userAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId
        }
      }
    });

    return !!userAchievement;
  }
};
