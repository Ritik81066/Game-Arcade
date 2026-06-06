# CRITICAL ACTION ITEMS - IMMEDIATE FIXES REQUIRED

**Priority**: 🔴 CRITICAL - Do Not Deploy Without Fixing

---

## 1. SECURITY HOTFIXES (Fix Today)

### 1.1 JWT Secret Vulnerability
**File**: `backend/src/utils/jwt.js`
**Issue**: Default secret in code allows token forgery

**Current (VULNERABLE)**:
```javascript
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production';
```

**Fixed**:
```javascript
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Terminating.');
}

if (process.env.JWT_SECRET === 'your_super_secret_jwt_key_change_this_in_production') {
  throw new Error('FATAL: JWT_SECRET is using the default value. Must be changed in production.');
}

const JWT_SECRET = process.env.JWT_SECRET;
```

**Update `.env.example`**:
```
# MUST be a strong random string, minimum 32 characters
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="your_strong_random_jwt_secret_min_32_chars"
```

---

### 1.2 Add Rate Limiting
**File**: Create `backend/src/middleware/rateLimiter.js`

```javascript
import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 failed login attempts per hour
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again in 1 hour.',
});

export const scoreSubmitLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 score submissions per minute
  skipSuccessfulRequests: false,
});
```

**Update `backend/src/index.js`**:
```javascript
import { globalLimiter, authLimiter, scoreSubmitLimiter } from './middleware/rateLimiter.js';

// Add global limiter
app.use(globalLimiter);

// Add to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Add to score routes
app.use('/api/scores', scoreSubmitLimiter);
```

**Install**:
```bash
npm install express-rate-limit
```

---

### 1.3 Fix Tetris Game Not Loading
**File**: `frontend/src/pages/GamePlayer.jsx`
**Issue**: TetrisGame imported but not mapped

**Current (BROKEN)**:
```javascript
import { TetrisGame } from '../games/TetrisGame';

const gameComponents = {
  'flappy-bird': FlappyBirdGame,
  'snake-master': SnakeGame,
  'memory-match': MemoryMatchGame,
  'brick-breaker': BrickBreakerGame,
  // Missing Tetris!
};
```

**Fixed**:
```javascript
const gameComponents = {
  'flappy-bird': FlappyBirdGame,
  'snake-master': SnakeGame,
  'memory-match': MemoryMatchGame,
  'brick-breaker': BrickBreakerGame,
  'tetris-clone': TetrisGame,  // ✅ ADD THIS LINE
};
```

---

### 1.4 Add Input Sanitization
**File**: `backend/src/controllers/authController.js`
**Issue**: User bio and avatar not sanitized - XSS vulnerability

**Install**:
```bash
npm install sanitize-html validator
```

**Update authController**:
```javascript
import sanitizeHtml from 'sanitize-html';
import validator from 'validator';

async updateProfile(req, res, next) {
  try {
    const { username, avatar, bio } = req.body;

    // Sanitize inputs
    const sanitizedBio = sanitizeHtml(bio, {
      allowedTags: [],
      allowedAttributes: {}
    });

    const sanitizedUsername = validator.trim(username);
    const sanitizedAvatar = validator.isURL(avatar) ? avatar : null;

    // Validate
    if (sanitizedUsername.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }

    const user = await authService.updateUserProfile(req.userId, {
      username: sanitizedUsername,
      avatar: sanitizedAvatar,
      bio: sanitizedBio
    });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}
```

---

### 1.5 Fix N+1 Query in Score Submission
**File**: `backend/src/services/scoreService.js`
**Issue**: Fetches all user scores after every submission

**Current (INEFFICIENT)**:
```javascript
async submitScore(userId, gameId, points, duration) {
  const score = await prisma.score.create({
    data: { userId, gameId, points, duration }
  });

  // ❌ This fetches ALL scores - inefficient!
  const allScores = await prisma.score.findMany({ where: { userId } });
  const totalScore = allScores.reduce((sum, s) => sum + s.points, 0);

  await prisma.user.update({
    where: { id: userId },
    data: {
      totalScore,
      gamesPlayed: allScores.length
    }
  });

  return score;
}
```

**Fixed**:
```javascript
async submitScore(userId, gameId, points, duration) {
  const score = await prisma.score.create({
    data: { userId, gameId, points, duration }
  });

  // ✅ Use aggregation instead
  const stats = await prisma.score.aggregate({
    where: { userId },
    _sum: { points: true },
    _count: true
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      totalScore: stats._sum.points || 0,
      gamesPlayed: stats._count
    }
  });

  return score;
}
```

---

### 1.6 Add Missing Database Indexes
**File**: `backend/prisma/schema.prisma`
**Issue**: Missing indexes for frequently queried fields

**Add to schema**:
```prisma
model User {
  // ... existing fields ...
  
  @@index([email])
  @@index([username])
}

model Game {
  // ... existing fields ...
  
  @@index([slug])
  @@index([category])
}

model Achievement {
  // ... existing fields ...
  
  @@index([slug])
}
```

**Migrate**:
```bash
npx prisma migrate dev --name add_missing_indexes
```

---

### 1.7 Fix Canvas Game Memory Leaks
**File**: All Canvas game components
**Issue**: requestAnimationFrame callbacks don't clean up

**Example - FlappyBirdGame.jsx**:

**Current (LEAKED)**:
```javascript
useEffect(() => {
  const gameLoop = () => {
    // Game logic
    requestAnimationFrame(gameLoop); // ❌ Loops forever, even after unmount
  };
  requestAnimationFrame(gameLoop);
}, []);
```

**Fixed**:
```javascript
useEffect(() => {
  let animationFrameId;
  let isMounted = true;

  const gameLoop = () => {
    if (!isMounted) return; // Don't update if unmounted
    
    // Game logic here
    
    if (!gameState.gameOver) {
      animationFrameId = requestAnimationFrame(gameLoop);
    }
  };

  animationFrameId = requestAnimationFrame(gameLoop);

  return () => {
    isMounted = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}, []);
```

---

### 1.8 Make Canvas Games Responsive
**File**: All Canvas game components
**Issue**: Hardcoded canvas dimensions don't work on mobile

**Example - FlappyBirdGame.jsx**:

**Current (NOT RESPONSIVE)**:
```javascript
<canvas
  ref={canvasRef}
  width={400}  // ❌ HARDCODED
  height={600} // ❌ HARDCODED
/>
```

**Fixed**:
```javascript
const [canvasSize, setCanvasSize] = useState({ width: 400, height: 600 });
const containerRef = useRef(null);

useEffect(() => {
  const handleResize = () => {
    if (containerRef.current) {
      const maxWidth = Math.min(containerRef.current.clientWidth - 20, 400);
      const maxHeight = Math.min(window.innerHeight - 200, 600);
      const aspectRatio = 400 / 600;
      
      setCanvasSize({
        width: maxWidth,
        height: maxWidth / aspectRatio
      });
    }
  };

  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

return (
  <div ref={containerRef} className="flex justify-center">
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      className="border-4 border-primary rounded-lg bg-gray-900"
    />
  </div>
);
```

---

### 1.9 Add Touch Support to Games
**File**: FlappyBirdGame.jsx, BrickBreakerGame.jsx
**Issue**: Games not playable on mobile

**Add to game components**:
```javascript
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const handleTouchStart = (e) => {
    // Simulate space key press
    const event = new KeyboardEvent('keydown', { key: ' ' });
    handleKeyDown(event);
  };

  const handleTouchEnd = (e) => {
    const event = new KeyboardEvent('keyup', { key: ' ' });
    handleKeyUp?.(event);
  };

  canvas.addEventListener('touchstart', handleTouchStart);
  canvas.addEventListener('touchend', handleTouchEnd);

  return () => {
    canvas.removeEventListener('touchstart', handleTouchStart);
    canvas.removeEventListener('touchend', handleTouchEnd);
  };
}, []);
```

---

### 1.10 Complete Achievement Unlock Logic
**File**: `backend/src/services/scoreService.js` (lines 60-100)
**Issue**: Missing implementation for several achievement criteria

**Add complete logic**:
```javascript
async checkAndAwardAchievements(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      achievements: { include: { achievement: true } },
      scores: true
    }
  });

  const achievements = await prisma.achievement.findMany();

  for (const achievement of achievements) {
    const alreadyUnlocked = user.achievements.some(
      ua => ua.achievement.id === achievement.id
    );
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
      case 'perfect_score':
        // Perfect score in Memory Match is (16 - 8) * 50 = 400
        shouldUnlock = user.scores.some(s => s.points >= 400 && s.points === (16 - 8) * 50);
        break;
      case 'top_score':
        // Check if this user has the top score in any game
        const gameScores = await prisma.score.groupBy({
          by: ['gameId'],
          _max: { points: true }
        });
        shouldUnlock = gameScores.some(gs =>
          user.scores.find(s => s.gameId === gs.gameId && s.points === gs._max.points)
        );
        break;
      case 'master_all_games':
        // Must have top score in ALL games
        const games = await prisma.game.findMany();
        shouldUnlock = games.length > 0 && games.every(game => {
          const topScore = user.scores
            .filter(s => s.gameId === game.id)
            .sort((a, b) => b.points - a.points)[0];
          return topScore && topScore.points > 0;
        });
        break;
    }

    if (shouldUnlock) {
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id
        }
      });
    }
  }
}
```

---

## 2. FEATURE PRIORITY FIXES (Fix This Week)

### 2.1 Add Mobile Navigation Menu
**File**: `frontend/src/components/Navigation.jsx`

```javascript
import { useState } from 'react';

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // ... rest of code

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          {/* ... existing */}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-800"
          >
            <span className="text-2xl">☰</span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* ... existing menu */}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            <Link to="/games" className="block px-4 py-2 hover:bg-gray-800">Games</Link>
            <Link to="/leaderboard" className="block px-4 py-2 hover:bg-gray-800">Leaderboard</Link>
            <Link to="/achievements" className="block px-4 py-2 hover:bg-gray-800">Achievements</Link>
            <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-800">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};
```

---

### 2.2 Add Game Instructions Modal
**File**: Create `frontend/src/components/GameInstructions.jsx`

```javascript
import { motion } from 'framer-motion';

export const GameInstructions = ({ game, onClose, onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gray-900 rounded-lg p-8 max-w-md mx-4"
      >
        <h2 className="text-3xl font-bold mb-4">{game.name}</h2>
        <p className="text-gray-300 mb-6">{game.instructions}</p>
        
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 btn-ghost"
          >
            Close
          </button>
          <button
            onClick={onStart}
            className="flex-1 btn-primary"
          >
            Start Game
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
```

**Use in GamePlayer.jsx**:
```javascript
const [showInstructions, setShowInstructions] = useState(true);

return (
  <>
    {showInstructions && (
      <GameInstructions
        game={gameData}
        onClose={() => setShowInstructions(false)}
        onStart={() => setShowInstructions(false)}
      />
    )}
    {!showInstructions && playing && (
      <GameComponent onGameEnd={handleGameEnd} />
    )}
  </>
);
```

---

### 2.3 Add Search Functionality
**File**: Create `backend/src/routes/searchRoutes.js`

```javascript
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        message: 'Search query must be at least 2 characters'
      });
    }

    const games = await prisma.game.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } }
        ]
      },
      take: 20
    });

    res.status(200).json(games);
  } catch (error) {
    next(error);
  }
});

export default router;
```

---

## 3. OPTIONAL IMPROVEMENTS (Do Later)

- [ ] Implement pagination on leaderboards
- [ ] Add password reset flow
- [ ] Add email verification
- [ ] Implement CSRF protection
- [ ] Add request/response validation with Zod
- [ ] Add API versioning
- [ ] Add Swagger documentation
- [ ] Implement caching strategy
- [ ] Add error boundary component
- [ ] Implement achievement notifications

---

## DEPLOYMENT CHECKLIST

Before deploying to production:

- [ ] Set JWT_SECRET to strong random value
- [ ] Enable rate limiting
- [ ] Verify input sanitization
- [ ] Test all games on mobile
- [ ] Fix database indexes
- [ ] Monitor for memory leaks
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring (Sentry)
- [ ] Configure CDN
- [ ] Set up database backups
- [ ] Run security audit
- [ ] Load test the application
- [ ] Create disaster recovery plan
- [ ] Document deployment procedure
- [ ] Brief ops team on monitoring

---

## ESTIMATED TIME TO PRODUCTION

- **Critical Fixes**: 2-3 days
- **Feature Fixes**: 3-5 days
- **Missing Games**: 2-3 weeks
- **Performance Optimization**: 3-5 days
- **Testing & QA**: 1 week

**Total**: 3-4 weeks to production-ready

