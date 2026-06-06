import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/passwordHash.js';
import { generateToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

export const authService = {
  async register(email, username, password) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      throw { status: 400, message: 'Email already registered' };
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      throw { status: 400, message: 'Username already taken' };
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        totalScore: 0,
        gamesPlayed: 0
      }
    });

    const token = generateToken(user.id);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        totalScore: user.totalScore,
        gamesPlayed: user.gamesPlayed
      }
    };
  },

  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    const token = generateToken(user.id);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        totalScore: user.totalScore,
        gamesPlayed: user.gamesPlayed
      }
    };
  },

  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: {
          include: { achievement: true }
        }
      }
    });

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      totalScore: user.totalScore,
      gamesPlayed: user.gamesPlayed,
      achievements: user.achievements.map(ua => ({
        id: ua.achievement.id,
        name: ua.achievement.name,
        slug: ua.achievement.slug,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
        unlockedAt: ua.unlockedAt
      }))
    };
  },

  async updateUserProfile(userId, data) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.username && { username: data.username }),
        ...(data.avatar && { avatar: data.avatar }),
        ...(data.bio && { bio: data.bio })
      }
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      totalScore: user.totalScore,
      gamesPlayed: user.gamesPlayed
    };
  }
};
