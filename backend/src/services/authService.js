import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/passwordHash.js';
import { generateToken } from '../utils/jwt.js';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmail = async (to, subject, text) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[EMAIL] To: ${to}, Subject: ${subject}, Body: ${text}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

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
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        totalScore: 0,
        gamesPlayed: 0,
        otp,
        otpExpiry,
        emailVerified: false,
      }
    });

    // Send OTP email
    try {
      await sendEmail(
        email,
        'Game Arcade - Verify Your Email',
        `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.`
      );
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }

    return {
      message: 'Verification OTP sent to your email. Please verify to complete registration.',
      email,
      requiresVerification: true
    };
  },

  async verifyRegistration(email, otp) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    if (user.otp !== otp) {
      throw { status: 400, message: 'Invalid OTP' };
    }

    if (user.otpExpiry && user.otpExpiry < new Date()) {
      throw { status: 400, message: 'OTP expired. Please register again.' };
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        otp: null,
        otpExpiry: null,
      }
    });

    const token = generateToken(updatedUser.id);
    return {
      token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        totalScore: updatedUser.totalScore,
        gamesPlayed: updatedUser.gamesPlayed
      }
    };
  },

  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    if (!user.emailVerified) {
      throw { status: 403, message: 'Please verify your email before logging in' };
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
