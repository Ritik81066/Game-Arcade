# Game Arcade - Production Ready Full Stack Application

A complete, production-ready arcade gaming platform with authentication, leaderboards, achievements, and multiple classic games.

## 🚀 Features

- **Authentication System**: JWT-based user authentication with bcrypt password hashing
- **Multiple Games**: Flappy Bird, Snake, Memory Match, Brick Breaker (with Canvas API)
- **Leaderboards**: Global and per-game leaderboards with top 10 rankings
- **Achievement System**: 8 different achievements to unlock
- **User Profiles**: Track total score, games played, and achievements
- **Real-time Score Tracking**: Instant score submission and leaderboard updates
- **Responsive Design**: Mobile-optimized UI with Tailwind CSS
- **Smooth Animations**: Framer Motion for polished user experience
- **Database Persistence**: PostgreSQL with Prisma ORM

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Canvas API** - Game rendering

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security
- **CORS** - Cross-origin requests

## 📁 Project Structure

```
game-arcade/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── gameController.js
│   │   │   ├── scoreController.js
│   │   │   ├── leaderboardController.js
│   │   │   └── achievementController.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── gameService.js
│   │   │   ├── scoreService.js
│   │   │   ├── leaderboardService.js
│   │   │   └── achievementService.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── gameRoutes.js
│   │   │   ├── scoreRoutes.js
│   │   │   ├── leaderboardRoutes.js
│   │   │   └── achievementRoutes.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── passwordHash.js
│   │   └── index.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── .env.example
│   ├── package.json
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Common.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── GamesPage.jsx
│   │   │   ├── GameDetailPage.jsx
│   │   │   ├── GamePlayer.jsx
│   │   │   ├── LeaderboardPage.jsx
│   │   │   └── AchievementsPage.jsx
│   │   ├── games/
│   │   │   ├── FlappyBirdGame.jsx
│   │   │   ├── SnakeGame.jsx
│   │   │   ├── MemoryMatchGame.jsx
│   │   │   └── BrickBreakerGame.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── gameArcadeAPI.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .gitignore
└── README.md
```

## 🗄️ Database Schema

### Users
- id (Primary Key)
- email (Unique)
- username (Unique)
- password (Hashed)
- avatar (Optional)
- bio (Optional)
- totalScore
- gamesPlayed
- createdAt
- updatedAt

### Games
- id (Primary Key)
- name (Unique)
- slug (Unique)
- description
- difficulty
- category
- icon (Optional)
- instructions (Optional)
- createdAt

### Scores
- id (Primary Key)
- userId (Foreign Key)
- gameId (Foreign Key)
- points
- duration (in seconds)
- timestamp
- createdAt
- Indexes on userId, gameId, points, timestamp

### Achievements
- id (Primary Key)
- name (Unique)
- slug (Unique)
- description
- icon (Optional)
- criteria
- reward
- createdAt

### UserAchievements
- id (Primary Key)
- userId (Foreign Key)
- achievementId (Foreign Key)
- unlockedAt
- Unique constraint on userId + achievementId

## 🎮 Available Games

1. **Flappy Bird Clone** - Navigate through pipes
   - Difficulty: Easy
   - Category: Arcade

2. **Snake Master** - Classic snake game
   - Difficulty: Medium
   - Category: Classic

3. **Memory Match** - Match pairs of cards
   - Difficulty: Easy
   - Category: Puzzle

4. **Brick Breaker** - Break bricks with a bouncing ball
   - Difficulty: Medium
   - Category: Arcade

5. **Tetris Clone** - Stack falling blocks
   - Difficulty: Hard
   - Category: Puzzle

6. **Pacman Arena** - Collect pellets, avoid ghosts
   - Difficulty: Hard
   - Category: Classic

## 🏆 Achievements

1. **First Victory** - Win your first game (10 pts)
2. **Score 1000+** - Achieve 1000+ points (50 pts)
3. **Play 10 Games** - Play 10 games total (25 pts)
4. **Speed Runner** - Complete game in under 30 seconds (30 pts)
5. **Perfect Game** - Get 10,000+ points (75 pts)
6. **Play 50 Games** - Play 50 games total (100 pts)
7. **Arcade Champion** - Get top score in a game (100 pts)
8. **Master of All** - Top score in all games (500 pts)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Games
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get game by ID
- `GET /api/games/by-slug/:slug` - Get game by slug
- `GET /api/games/by-category/:category` - Get games by category

### Scores
- `POST /api/scores` - Submit score (Protected)
- `GET /api/scores/user` - Get user's scores (Protected)
- `GET /api/scores/highest` - Get highest scores
- `GET /api/scores/game/:gameId` - Get game scores

### Leaderboards
- `GET /api/leaderboards/global` - Get global leaderboard
- `GET /api/leaderboards/game/:gameSlug` - Get game leaderboard
- `GET /api/leaderboards/my-rank` - Get user's rank (Protected)

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/user` - Get user achievements (Protected)
- `GET /api/achievements/stats` - Get achievement statistics
- `GET /api/achievements/:id` - Get achievement by ID
- `GET /api/achievements/by-slug/:slug` - Get achievement by slug

## 🚀 Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` and set:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/game_arcade"
   JWT_SECRET="your_super_secret_jwt_key_change_this_in_production"
   JWT_EXPIRES_IN="7d"
   NODE_ENV="development"
   PORT=5000
   CORS_ORIGIN="http://localhost:5173"
   ```

5. **Setup database**
   ```bash
   npm run db:push
   npm run prisma:seed
   ```

6. **Start backend**
   ```bash
   npm run dev
   ```

Backend will run on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (usually defaults are fine for local development)
   ```
   VITE_API_URL="http://localhost:5000/api"
   ```

5. **Start frontend**
   ```bash
   npm run dev
   ```

Frontend will run on http://localhost:5173

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/game_arcade
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing the Application

### Demo Account
- Email: `demo@gamearcade.com`
- Password: `Demo@1234`

Use this account to test the application without creating a new one.

## 📦 Production Deployment

### Frontend - Vercel
1. Push code to GitHub
2. Connect GitHub repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend - Render
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Database - Neon PostgreSQL
1. Create account on Neon
2. Create new database
3. Copy connection string
4. Set DATABASE_URL in backend environment

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs (10 rounds)
- CORS protection
- Helmet security headers
- Input validation with express-validator
- Protected routes
- Secure token storage in localStorage
- HTTPS ready

## 📊 Performance Optimizations

- Code splitting with React Router
- Lazy loading of game components
- Optimized Canvas rendering
- Request debouncing
- Responsive images
- Minified production build
- Database query optimization with Prisma indexes

## 🎯 Achievement Criteria Logic

```javascript
First Victory: win_game (user has at least 1 score)
Score 1000+: score_1000 (user has score >= 1000)
Play 10 Games: play_10_games (user has 10+ scores)
Play 50 Games: play_50_games (user has 50+ scores)
Speed Runner: speed_run (user has score with duration < 30 seconds)
Perfect Game: perfect_score (user has score >= 10000)
Arcade Champion: top_score (user is top scorer in any game)
Master of All: master_all_games (user is top scorer in all games)
```

## 🤝 Contributing

This is a complete, production-ready application. For modifications:

1. Follow the existing code structure
2. Maintain consistency with current patterns
3. Add proper error handling
4. Update database migrations if schema changes
5. Test thoroughly before deployment

## 📄 License

This project is production-ready and fully open for use.

## 🆘 Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Verify DATABASE_URL is correct
- Check database credentials

### CORS Error
- Ensure backend CORS_ORIGIN matches frontend URL
- Check backend is running on correct port

### 404 on API Calls
- Verify backend is running on http://localhost:5000
- Check VITE_API_URL in frontend .env

### Games Not Loading
- Ensure all game components are imported correctly
- Check browser console for errors
- Verify game slugs match routes

## 📞 Support

For issues or questions, refer to the code comments and documentation above.

---

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Last Updated**: 2024
