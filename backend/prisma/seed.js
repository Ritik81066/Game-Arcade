import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

const games = [
  {
    name: 'Flappy Bird Clone',
    slug: 'flappy-bird',
    description: 'Navigate through pipes in this classic arcade game',
    difficulty: 'easy',
    category: 'arcade',
    instructions: 'Click or tap to make the bird fly. Avoid the pipes and score points!'
  },
  {
    name: 'Snake Master',
    slug: 'snake-master',
    description: 'Grow your snake by eating food while avoiding walls and yourself',
    difficulty: 'medium',
    category: 'classic',
    instructions: 'Use arrow keys or WASD to move. Eat food to grow. Don\'t hit the walls or yourself!'
  },
  {
    name: 'Memory Match',
    slug: 'memory-match',
    description: 'Match pairs of cards in this brain-training game',
    difficulty: 'easy',
    category: 'puzzle',
    instructions: 'Click on cards to reveal them. Match all pairs to win!'
  },
  {
    name: 'Brick Breaker',
    slug: 'brick-breaker',
    description: 'Break bricks with a bouncing ball in this classic game',
    difficulty: 'medium',
    category: 'arcade',
    instructions: 'Use the paddle to bounce the ball. Break all bricks to advance!'
  },
  {
    name: 'Tetris Clone',
    slug: 'tetris-clone',
    description: 'Stack falling blocks to complete lines',
    difficulty: 'hard',
    category: 'puzzle',
    instructions: 'Use arrow keys to move blocks. Space to rotate. Complete lines to clear them!'
  },
  {
    name: 'Pacman Arena',
    slug: 'pacman-arena',
    description: 'Navigate a maze and collect pellets while avoiding ghosts',
    difficulty: 'hard',
    category: 'classic',
    instructions: 'Use arrow keys to move. Collect all pellets and avoid ghosts!'
  }
];

const achievements = [
  {
    name: 'First Victory',
    slug: 'first-victory',
    description: 'Win your first game',
    criteria: 'win_game',
    reward: 10
  },
  {
    name: 'Score 1000+',
    slug: 'score-1000',
    description: 'Achieve a score of 1000 or more in a single game',
    criteria: 'score_1000',
    reward: 50
  },
  {
    name: 'Play 10 Games',
    slug: 'play-10-games',
    description: 'Play 10 games across the arcade',
    criteria: 'play_10_games',
    reward: 25
  },
  {
    name: 'Arcade Champion',
    slug: 'arcade-champion',
    description: 'Achieve top score in any game',
    criteria: 'top_score',
    reward: 100
  },
  {
    name: 'Speed Runner',
    slug: 'speed-runner',
    description: 'Complete a game in under 30 seconds',
    criteria: 'speed_run',
    reward: 30
  },
  {
    name: 'Perfect Game',
    slug: 'perfect-game',
    description: 'Get a perfect score in Memory Match',
    criteria: 'perfect_score',
    reward: 75
  },
  {
    name: 'Persistence Pays',
    slug: 'persistence-pays',
    description: 'Play 50 games',
    criteria: 'play_50_games',
    reward: 100
  },
  {
    name: 'Master of All',
    slug: 'master-of-all',
    description: 'Get top score in all games',
    criteria: 'master_all_games',
    reward: 500
  }
];

async function main() {
  console.log('Starting database seed...');

  try {
    // Create demo user
    const hashedPassword = await bcryptjs.hash('Demo@1234', 10);
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@gamearcade.com' },
      update: {},
      create: {
        email: 'demo@gamearcade.com',
        username: 'demo_player',
        password: hashedPassword,
        bio: 'Welcome to Game Arcade!',
        totalScore: 0,
        gamesPlayed: 0
      }
    });

    console.log('✓ Demo user created/updated');

    // Create games
    for (const game of games) {
      await prisma.game.upsert({
        where: { slug: game.slug },
        update: {},
        create: game
      });
    }

    console.log('✓ Games created');

    // Create achievements
    for (const achievement of achievements) {
      await prisma.achievement.upsert({
        where: { slug: achievement.slug },
        update: {},
        create: achievement
      });
    }

    console.log('✓ Achievements created');

    // Create some sample scores
    const allGames = await prisma.game.findMany();
    const sampleScores = [
      { gameId: allGames[0].id, userId: demoUser.id, points: 250, duration: 45 },
      { gameId: allGames[1].id, userId: demoUser.id, points: 500, duration: 120 },
      { gameId: allGames[2].id, userId: demoUser.id, points: 100, duration: 30 },
    ];

    for (const score of sampleScores) {
      await prisma.score.create({
        data: score
      });
    }

    console.log('✓ Sample scores created');

    // Update user total score and games played
    const userScores = await prisma.score.findMany({ where: { userId: demoUser.id } });
    const totalScore = userScores.reduce((sum, score) => sum + score.points, 0);

    await prisma.user.update({
      where: { id: demoUser.id },
      data: {
        totalScore,
        gamesPlayed: userScores.length
      }
    });

    console.log('✓ User statistics updated');
    console.log('✅ Database seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
