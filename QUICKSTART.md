# Game Arcade - Quick Start Guide

Get the Game Arcade application running in minutes.

## Prerequisites
- Node.js 16+ (https://nodejs.org/)
- PostgreSQL 12+ (https://www.postgresql.org/)
- Git

## Installation

### Step 1: Clone/Extract Project
```bash
cd Game Arcade
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database URL
# DATABASE_URL="postgresql://user:password@localhost:5432/game_arcade"

# Setup database
npm run db:push
npm run prisma:seed

# Start backend
npm run dev
```

Backend runs on: **http://localhost:5000**

### Step 3: Frontend Setup

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file (optional, defaults work)
cp .env.example .env

# Start frontend
npm run dev
```

Frontend runs on: **http://localhost:5173**

## Usage

### Access the Application
Open http://localhost:5173 in your browser

### Login
Use the demo account:
- Email: `demo@gamearcade.com`
- Password: `Demo@1234`

Or register a new account

### Play Games
1. Click "Games" in the navigation
2. Click "Play Game" on any game
3. Play and submit your score
4. Check leaderboards and achievements

## Database Setup (First Time Only)

### Create PostgreSQL Database

**Windows (PowerShell):**
```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE game_arcade;

# Exit
\q
```

**Mac/Linux:**
```bash
# Create database
createdb game_arcade
```

## Common Issues & Solutions

### "Database connection refused"
```bash
# Start PostgreSQL service
# Windows: Start PostgreSQL from Services
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### "Port 5000 already in use"
```bash
# Change PORT in backend/.env to another port (e.g., 5001)
PORT=5001
```

### "Port 5173 already in use"
```bash
# In frontend directory
npm run dev -- --port 5174
```

### "CORS Error"
Make sure backend and frontend are both running:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## API Endpoints (Reference)

```
POST   /api/auth/register          - Create account
POST   /api/auth/login             - Login
GET    /api/auth/profile           - Get profile (Protected)
PUT    /api/auth/profile           - Update profile (Protected)

GET    /api/games                  - All games
GET    /api/games/:id              - Game details
GET    /api/games/by-slug/:slug    - Game by slug

POST   /api/scores                 - Submit score (Protected)
GET    /api/scores/user            - My scores (Protected)
GET    /api/scores/highest         - Top scores

GET    /api/leaderboards/global    - Global leaderboard
GET    /api/leaderboards/game/:slug - Game leaderboard
GET    /api/leaderboards/my-rank   - My rank (Protected)

GET    /api/achievements           - All achievements
GET    /api/achievements/user      - My achievements (Protected)
```

## Features

✅ User Authentication (JWT)
✅ Multiple Games (Flappy Bird, Snake, Memory Match, Brick Breaker)
✅ Global & Per-Game Leaderboards
✅ Achievement System
✅ User Profiles & Stats
✅ Responsive Design
✅ Smooth Animations

## Project Structure

```
Game Arcade/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── .env.example
```

## Development Commands

### Backend
```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run prisma:migrate # Create migration
npm run db:reset      # Reset database
npm run prisma:seed   # Seed database
```

### Frontend
```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Lint code
```

## Production Deployment

### Frontend - Vercel
1. Push to GitHub
2. Import project to Vercel
3. Set environment variables
4. Deploy

### Backend - Render
1. Push to GitHub
2. Create Web Service on Render
3. Set environment variables
4. Deploy

### Database - Neon
1. Create account on Neon
2. Create database
3. Use connection string in backend

## Next Steps

- Customize games
- Add more achievements
- Create game categories
- Implement social features
- Add multiplayer support
- Deploy to production

## Support

Refer to the main README.md for detailed documentation.

---

🎮 **Happy Gaming!**
