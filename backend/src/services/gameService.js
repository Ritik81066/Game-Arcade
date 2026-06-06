import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const gameService = {
  async getAllGames() {
    return prisma.game.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  async getGameById(gameId) {
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      throw { status: 404, message: 'Game not found' };
    }
    return game;
  },

  async getGameBySlug(slug) {
    const game = await prisma.game.findUnique({ where: { slug } });
    if (!game) {
      throw { status: 404, message: 'Game not found' };
    }
    return game;
  },

  async getGamesByCategory(category) {
    return prisma.game.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' }
    });
  }
};
