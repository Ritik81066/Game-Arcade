# Database Schema Documentation

## Overview
The Game Arcade database uses PostgreSQL with Prisma ORM for type-safe database access.

## Database Models

### 1. User Model
Stores user account information and statistics.

```prisma
model User {
  id                String               @id @default(cuid())
  email             String               @unique
  username          String               @unique
  password          String
  avatar            String?
  bio               String?
  totalScore        Int                  @default(0)
  gamesPlayed       Int                  @default(0)
  createdAt         DateTime             @default(now())
  updatedAt         DateTime             @updatedAt
  scores            Score[]
  achievements      UserAchievement[]
}
```

**Fields:**
- `id`: Unique identifier (CUID format)
- `email`: User email (unique)
- `username`: Display name (unique)
- `password`: Bcrypt hashed password
- `avatar`: Optional profile picture URL
- `bio`: Optional user biography
- `totalScore`: Sum of all game scores
- `gamesPlayed`: Count of games played
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### 2. Game Model
Contains game metadata and configurations.

```prisma
model Game {
  id                String               @id @default(cuid())
  name              String               @unique
  slug              String               @unique
  description       String
  difficulty        String               @default("medium")
  category          String
  icon              String?
  instructions      String?
  createdAt         DateTime             @default(now())
  scores            Score[]
}
```

**Fields:**
- `id`: Unique identifier (CUID format)
- `name`: Game display name (unique)
- `slug`: URL-friendly identifier (unique)
- `description`: Game description
- `difficulty`: "easy" | "medium" | "hard"
- `category`: Game category (arcade, puzzle, classic)
- `icon`: Optional emoji or image URL
- `instructions`: Optional gameplay instructions
- `createdAt`: Creation timestamp

**Difficulty Levels:**
- `easy`: Beginner friendly
- `medium`: Intermediate
- `hard`: Advanced

**Categories:**
- `arcade`: Fast-paced action games
- `classic`: Classic arcade/retro games
- `puzzle`: Strategy and puzzle games

### 3. Score Model
Tracks individual game scores played by users.

```prisma
model Score {
  id                String               @id @default(cuid())
  userId            String
  user              User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  gameId            String
  game              Game                 @relation(fields: [gameId], references: [id], onDelete: Cascade)
  points            Int
  duration          Int
  timestamp         DateTime             @default(now())
  createdAt         DateTime             @default(now())
  @@index([userId])
  @@index([gameId])
  @@index([points])
  @@index([timestamp])
}
```

**Fields:**
- `id`: Unique identifier (CUID format)
- `userId`: Foreign key to User
- `user`: User relationship
- `gameId`: Foreign key to Game
- `game`: Game relationship
- `points`: Score value
- `duration`: Game duration in seconds
- `timestamp`: When score was achieved
- `createdAt`: Record creation time

**Indexes:**
- Index on userId for user score queries
- Index on gameId for game leaderboards
- Index on points for ranking queries
- Index on timestamp for recent scores

### 4. Achievement Model
Defines available achievements users can unlock.

```prisma
model Achievement {
  id                String               @id @default(cuid())
  name              String               @unique
  slug              String               @unique
  description       String
  icon              String?
  criteria          String
  reward            Int                  @default(0)
  createdAt         DateTime             @default(now())
  users             UserAchievement[]
}
```

**Fields:**
- `id`: Unique identifier (CUID format)
- `name`: Achievement name (unique)
- `slug`: URL-friendly identifier (unique)
- `description`: Achievement description
- `icon`: Optional emoji or icon
- `criteria`: Achievement unlock criteria
- `reward`: Points awarded for unlocking
- `createdAt`: Creation timestamp

**Achievement Criteria:**
- `win_game`: User has at least 1 score
- `score_1000`: User has score >= 1000
- `play_10_games`: User has 10+ scores
- `play_50_games`: User has 50+ scores
- `speed_run`: Game completed in < 30 seconds
- `perfect_score`: Score >= 10000
- `top_score`: User is #1 in a game
- `master_all_games`: #1 in all games

### 5. UserAchievement Model
Junction table linking users to unlocked achievements.

```prisma
model UserAchievement {
  id                String               @id @default(cuid())
  userId            String
  user              User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievementId     String
  achievement       Achievement          @relation(fields: [achievementId], references: [id], onDelete: Cascade)
  unlockedAt        DateTime             @default(now())
  @@unique([userId, achievementId])
  @@index([userId])
}
```

**Fields:**
- `id`: Unique identifier (CUID format)
- `userId`: Foreign key to User
- `user`: User relationship
- `achievementId`: Foreign key to Achievement
- `achievement`: Achievement relationship
- `unlockedAt`: Timestamp when achievement was unlocked

**Constraints:**
- Unique constraint on userId + achievementId (user can't unlock same achievement twice)
- Index on userId for quick achievement lookup

## Relationships

### User → Scores
- One user has many scores
- Cascade delete: Deleting user deletes all scores

### User → UserAchievements
- One user has many achievements
- Cascade delete: Deleting user deletes achievement associations

### Game → Scores
- One game has many scores
- Cascade delete: Deleting game deletes all scores

### Achievement → UserAchievements
- One achievement has many user associations
- Cascade delete: Deleting achievement deletes associations

## Queries & Operations

### User Operations
```javascript
// Register user
await prisma.user.create({
  data: { email, username, password }
});

// Find user by email
await prisma.user.findUnique({ where: { email } });

// Update user profile
await prisma.user.update({
  where: { id },
  data: { avatar, bio }
});

// Get user with achievements
await prisma.user.findUnique({
  where: { id },
  include: { achievements: { include: { achievement: true } } }
});
```

### Game Operations
```javascript
// Get all games
await prisma.game.findMany();

// Get game by slug
await prisma.game.findUnique({ where: { slug } });

// Get games by category
await prisma.game.findMany({ where: { category } });
```

### Score Operations
```javascript
// Submit score
await prisma.score.create({
  data: { userId, gameId, points, duration }
});

// Get user scores
await prisma.score.findMany({ where: { userId } });

// Get top scores
await prisma.score.findMany({
  orderBy: { points: 'desc' },
  take: 10
});

// Get leaderboard for game
await prisma.score.findMany({
  where: { gameId },
  include: { user: true },
  orderBy: { points: 'desc' },
  take: 10
});
```

### Achievement Operations
```javascript
// Get all achievements
await prisma.achievement.findMany();

// Unlock achievement
await prisma.userAchievement.create({
  data: { userId, achievementId }
});

// Get user achievements
await prisma.userAchievement.findMany({
  where: { userId },
  include: { achievement: true }
});
```

## Migration Commands

```bash
# Create new migration
npm run prisma:migrate -- --name your_migration_name

# Reset database (drop all data)
npm run db:reset

# Push schema changes
npm run db:push

# Generate Prisma client
npm run prisma:generate

# Seed database
npm run prisma:seed
```

## Indexes for Performance

The Score model includes strategic indexes:
- `userId`: Fast user score lookups
- `gameId`: Fast per-game queries
- `points`: Fast ranking queries
- `timestamp`: Fast recent scores queries

## Data Types

- **CUID**: Cryptographically Unique Identifiers (collision-resistant)
- **DateTime**: ISO 8601 timestamps
- **String**: Text fields (unlimited)
- **Int**: Integer values
- **Boolean**: True/false values

## Constraints

### Unique Constraints
- User.email
- User.username
- Game.name
- Game.slug
- Achievement.name
- Achievement.slug
- UserAchievement (userId, achievementId)

### Foreign Keys
- All use CASCADE delete policy
- Referential integrity maintained

## Seeding

The application includes seed data for:
- 6 games (Flappy Bird, Snake, Memory Match, Brick Breaker, Tetris, Pacman)
- 8 achievements
- 1 demo user (demo@gamearcade.com)
- Sample scores

Run: `npm run prisma:seed`

---

**Database Status**: ✅ Production Ready
**Version**: 1.0.0
