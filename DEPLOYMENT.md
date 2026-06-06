# Deployment Guide

Complete guide for deploying Game Arcade to production.

## Production Deployment Architecture

```
┌─────────────────────────────────────┐
│         Frontend (Vercel)           │
│    React + Vite + Tailwind CSS     │
│  Static Site + Serverless Functions │
└────────────┬────────────────────────┘
             │ API Calls
┌────────────▼────────────────────────┐
│      Backend (Render.com)           │
│    Express + Node.js                 │
│    Managed Container                 │
└────────────┬────────────────────────┘
             │ Database Queries
┌────────────▼────────────────────────┐
│   Database (Neon PostgreSQL)        │
│    Managed Cloud PostgreSQL          │
└─────────────────────────────────────┘
```

## Prerequisites

- GitHub account with repository
- Vercel account (vercel.com)
- Render account (render.com)
- Neon account (neon.tech)

## Step 1: Prepare Repository

### 1.1 Create GitHub Repository

1. Go to github.com and create new repository
2. Push Game Arcade code:

```bash
git init
git add .
git commit -m "Initial commit: Game Arcade"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/game-arcade.git
git push -u origin main
```

### 1.2 Prepare for Deployment

Create root-level `.gitignore`:
```
node_modules/
.env
.env.local
dist/
build/
.DS_Store
*.log
.vscode/
.idea/
```

Push changes:
```bash
git add .
git commit -m "Add gitignore"
git push
```

---

## Step 2: Setup Database (Neon)

### 2.1 Create Neon Database

1. Go to neon.tech and sign up
2. Create new project
3. Copy connection string:
   ```
   postgresql://user:password@host:5432/database?sslmode=require
   ```

### 2.2 Initialize Schema

Run in local backend directory:

```bash
cd backend

# Set DATABASE_URL to Neon connection string
export DATABASE_URL="your_neon_connection_string"

# Or on Windows:
$env:DATABASE_URL="your_neon_connection_string"

# Push schema
npm run db:push

# Seed database
npm run prisma:seed
```

### 2.3 Verify Database

Connect to Neon dashboard to verify tables were created.

---

## Step 3: Deploy Backend (Render)

### 3.1 Create Render Service

1. Go to render.com
2. Click "New +"
3. Select "Web Service"
4. Connect GitHub repository
5. Configure:

**Settings:**
- Name: `game-arcade-backend`
- Environment: `Node`
- Build Command: `npm install && npm run prisma:generate`
- Start Command: `npm run start`

### 3.2 Environment Variables

Add in Render dashboard:

```
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
JWT_SECRET=your_very_secure_random_string_here_make_it_long_and_random
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.com
```

### 3.3 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Get backend URL: `https://game-arcade-backend.onrender.com`

### 3.4 Create Cron Job for Backups (Optional)

In Render, add:
```
npm run db:backup
```

---

## Step 4: Deploy Frontend (Vercel)

### 4.1 Create Vercel Project

1. Go to vercel.com
2. Click "Add New..."
3. Select "Project"
4. Import GitHub repository
5. Configure:

**Framework:** React
**Build Command:** `cd frontend && npm run build`
**Output Directory:** `frontend/dist`

### 4.2 Environment Variables

Add in Vercel dashboard:

```
VITE_API_URL=https://game-arcade-backend.onrender.com/api
```

### 4.3 Deploy

1. Click "Deploy"
2. Wait for build
3. Get frontend URL (e.g., `https://game-arcade.vercel.app`)

---

## Step 5: Update Backend CORS

Go back to Render dashboard and update:

```
CORS_ORIGIN=https://game-arcade.vercel.app
```

Redeploy backend.

---

## Step 6: Custom Domain (Optional)

### 6.1 Frontend Domain

In Vercel:
1. Project Settings
2. Domains
3. Add custom domain
4. Update DNS records with Vercel's nameservers

### 6.2 Backend Domain

In Render:
1. Settings
2. Add custom domain
3. Update DNS records

---

## Post-Deployment Checklist

- [ ] Verify database connection
- [ ] Test user registration
- [ ] Test user login
- [ ] Test game play
- [ ] Test score submission
- [ ] Check leaderboards
- [ ] Verify achievements
- [ ] Test on mobile
- [ ] Check loading times
- [ ] Enable HTTPS (automatic)
- [ ] Set up error logging
- [ ] Monitor application

---

## Production Secrets Management

### Environment Variables

**Backend (.env production):**
```
DATABASE_URL="postgresql://...@neon.tech/...?sslmode=require"
JWT_SECRET="generate_using: openssl rand -hex 32"
JWT_EXPIRES_IN="7d"
NODE_ENV="production"
PORT=5000
CORS_ORIGIN="https://yourdomain.com"
```

**Generate secure JWT secret:**
```bash
openssl rand -hex 32
```

### Database Backups

Create backup schedule in Neon:
1. Go to database settings
2. Enable automated backups
3. Set retention to 7-30 days

---

## Performance Optimization

### Frontend Optimization

1. **Build Analysis:**
```bash
cd frontend
npm run build -- --analyze
```

2. **Enable Compression** in Vercel (automatic)

3. **Cache Headers** (Vercel automatic):
   - Static assets: 1 year
   - HTML: no-cache

### Backend Optimization

1. **Database Connection Pooling:**
   - Render handles automatically
   - Prisma uses connection pool

2. **API Response Caching:**
   - Static game data cached 1 hour
   - Leaderboards cached 5 minutes

3. **Image Optimization:**
   - Use CDN for avatars
   - Lazy load on frontend

---

## Monitoring & Logging

### Render Logging

```bash
# View logs
tail -f /var/log/app.log

# Or via Render dashboard: Logs tab
```

### Error Tracking (Optional)

Add Sentry:

```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your_sentry_dsn",
  environment: "production"
});
```

### Database Monitoring

In Neon dashboard:
- Query metrics
- Connection pool status
- Backup status

---

## Scaling Considerations

### For 10K+ Users:

1. **Database:**
   - Enable read replicas
   - Add connection pooling
   - Archive old scores

2. **Backend:**
   - Use multiple instances
   - Enable auto-scaling
   - Add caching layer (Redis)

3. **Frontend:**
   - Use edge caching
   - Enable service workers
   - Optimize bundle size

### Commands for Scaling:

```bash
# Archive old scores
npm run archive:scores

# Rebuild indexes
npm run db:reindex

# Update statistics
npm run db:vacuum
```

---

## Disaster Recovery

### Database Backup Strategy

1. **Automated backups** (Neon):
   - Daily backups retained 7 days
   - Manual backup before updates

2. **Recovery procedure:**
```bash
# Restore from backup
npm run db:restore -- --backup-id <id>
```

### Code Rollback

1. **In Vercel:** Deployments tab → Previous deploy
2. **In Render:** Deployments tab → Redeploy previous

---

## Troubleshooting

### Deployment Issues

**Backend won't start:**
```bash
# Check environment variables
# Check database connection
# Review build logs in Render
```

**Frontend not loading:**
```bash
# Check VITE_API_URL
# Verify CORS settings
# Check browser console
```

**Database connection timeout:**
```bash
# Check DATABASE_URL
# Verify IP allowlist
# Check Neon connection limits
```

---

## Cost Estimation (Monthly)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Pro | $20 |
| Render | Standard | $7 |
| Neon | Launch | $9 |
| **Total** | | **$36** |

Adjust based on usage.

---

## Security Checklist

- [ ] All secrets in environment variables
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] JWT secret strong (32+ chars)
- [ ] Database backups enabled
- [ ] Error messages don't leak info
- [ ] Rate limiting configured
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection (React)
- [ ] CSRF tokens (if needed)

---

## Maintenance Tasks

### Weekly
- Monitor error logs
- Check database size
- Verify backups completed

### Monthly
- Review performance metrics
- Update dependencies
- Check security advisories

### Quarterly
- Archive old scores
- Optimize database
- Capacity planning

---

## Support URLs

- **Vercel:** https://vercel.com/support
- **Render:** https://render.com/docs
- **Neon:** https://neon.tech/docs
- **Prisma:** https://www.prisma.io/docs

---

**Deployment Status**: ✅ Production Ready
**Last Updated**: 2024
