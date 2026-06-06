# Development Setup Guide

Guide for local development of Game Arcade.

## Prerequisites

- **Node.js**: v16.0.0 or higher
  - Download: https://nodejs.org/
  - Verify: `node --version` and `npm --version`

- **PostgreSQL**: v12.0 or higher
  - Download: https://www.postgresql.org/download/
  - Verify: `psql --version`

- **Git**: Latest version
  - Download: https://git-scm.com/
  - Verify: `git --version`

- **Code Editor**: VS Code recommended
  - Download: https://code.visualstudio.com/

## Initial Setup

### 1. Create PostgreSQL Database

**Windows (PowerShell):**
```powershell
# Start PostgreSQL service if not running
# Then open PostgreSQL CLI:
psql -U postgres

# Create database:
CREATE DATABASE game_arcade;

# Create user (optional):
CREATE USER game_user WITH PASSWORD 'password123';
ALTER ROLE game_user CREATEDB;

# Exit:
\q
```

**macOS/Linux:**
```bash
# Create database:
createdb game_arcade

# Create user (optional):
createuser game_user
psql -U postgres -c "ALTER USER game_user WITH PASSWORD 'password123';"
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with database URL
# Windows: notepad .env
# Mac/Linux: nano .env

# DATABASE_URL should be one of:
# postgresql://postgres:password@localhost:5432/game_arcade
# postgresql://game_user:password123@localhost:5432/game_arcade
# postgresql://localhost/game_arcade (if using default postgres user)
```

**Initialize database:**
```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run db:push

# Seed sample data
npm run prisma:seed

# Verify tables created:
npm run prisma:generate
```

**Start backend:**
```bash
npm run dev
```

Output should show:
```
🎮 Game Arcade Backend running on http://localhost:5000
📝 Environment: development
```

### 3. Frontend Setup

```bash
# In new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file (optional, uses defaults)
cp .env.example .env

# Start frontend dev server
npm run dev
```

Output should show:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

## Development Workflow

### Terminal Setup

Keep 3 terminals open:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

**Terminal 3 - Git/npm commands:**
```bash
# Use for git, package commands, etc.
```

### Accessing Application

Open browser: http://localhost:5173

Demo login:
- Email: `demo@gamearcade.com`
- Password: `Demo@1234`

### File Structure for Development

```
game-arcade/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── index.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── .env
│   ├── package.json
│   └── node_modules/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── games/
    │   ├── services/
    │   ├── context/
    │   ├── hooks/
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    ├── .env
    ├── index.html
    ├── package.json
    └── node_modules/
```

## Debugging

### VS Code Extensions (Recommended)

1. **ES7+ React/Redux/React-Native snippets**
   - Publisher: dsznajder

2. **Prisma**
   - Publisher: Prisma

3. **Thunder Client** or **REST Client**
   - For API testing

4. **PostgreSQL**
   - For database browsing

### Backend Debugging

**In VS Code launch.json:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/index.js",
      "cwd": "${workspaceFolder}/backend",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

### Frontend Debugging

Use Chrome DevTools:
1. Open DevTools: F12
2. React DevTools Extension: https://chrome.google.com/webstore
3. Redux DevTools (if used)

### Testing API Endpoints

**Using curl:**
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"test","password":"Test@123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123456"}'

# Get games
curl http://localhost:5000/api/games
```

**Using VS Code REST Client:**
Create `requests.http` file:
```http
### Get All Games
GET http://localhost:5000/api/games

### Register User
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@test.com",
  "username": "test",
  "password": "Test@123456"
}
```

## Common Development Tasks

### Reset Database

```bash
cd backend

# Remove all data and recreate schema
npm run db:reset

# Re-seed with sample data
npm run prisma:seed
```

### Run Database Migrations

```bash
cd backend

# If you modify schema.prisma:
npm run prisma:migrate -- --name description_of_change

# View migration history
npm run prisma:generate
```

### Add New Package

**Backend:**
```bash
cd backend
npm install package-name
# For dev dependency:
npm install --save-dev package-name
```

**Frontend:**
```bash
cd frontend
npm install package-name
```

### Code Formatting

**Backend:**
```bash
cd backend
npm run lint
```

**Frontend:**
```bash
cd frontend
npm run lint
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes
git add .
git commit -m "Descriptive commit message"

# Push to GitHub
git push origin feature/feature-name

# Create Pull Request on GitHub
```

## Environment Setup for Different Scenarios

### Local Development (Default)
```
.env:
NODE_ENV=development
DATABASE_URL=postgresql://localhost/game_arcade
JWT_SECRET=dev_secret_change_in_production
CORS_ORIGIN=http://localhost:5173
```

### Testing with Different Database
```bash
# Create test database
createdb game_arcade_test

# Set in .env
DATABASE_URL=postgresql://localhost/game_arcade_test

# Run tests
npm run test
```

### Production-like Local
```
.env:
NODE_ENV=production
DATABASE_URL=postgresql://...production url...
JWT_SECRET=...very_secure_secret...
```

## Performance Testing

### Load Testing

```bash
# Install artillery
npm install -g artillery

# Create load-test.yml
# Run load test
artillery run load-test.yml
```

### Profiling

```bash
# Start backend with profiling
node --prof src/index.js

# Process results
node --prof-process isolate-*.log > profile-results.txt
```

## IDE Configuration

### VS Code settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "**/node_modules": true,
    ".git": true
  }
}
```

## Troubleshooting Common Issues

### "Port 5000 already in use"
```bash
# Windows: Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux: Find and kill process
lsof -i :5000
kill -9 <PID>
```

### "Database connection refused"
```bash
# Check PostgreSQL is running
# Windows: Check Services
# Mac/Linux: brew services list

# Verify connection string in .env
```

### "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "CORS errors"
```bash
# Ensure CORS_ORIGIN in backend matches frontend URL
# Default: http://localhost:5173
```

## Code Organization Tips

- **One component per file**
- **Keep components focused**
- **Use meaningful file names**
- **Comment complex logic**
- **Follow existing patterns**
- **Test before committing**

## Performance Tips

- **Use React DevTools** to check re-renders
- **Use Lighthouse** for frontend audits
- **Monitor API response times**
- **Check database query performance**
- **Profile with Chrome DevTools**

## Resources

- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- Express Docs: https://expressjs.com
- Prisma Docs: https://www.prisma.io/docs
- Tailwind Docs: https://tailwindcss.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs

---

**Happy Coding!** 🎉
