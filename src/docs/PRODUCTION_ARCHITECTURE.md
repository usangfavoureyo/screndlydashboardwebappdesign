# Screndly Production Architecture (Option B)

**Last Updated**: December 14, 2024

This document describes the production architecture for Screndly using a reliable, always-on backend with minimal monthly cost.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND (Vercel Free)                          │
│  • React + TypeScript + Tailwind                            │
│  • PWA with Service Worker                                  │
│  • FFmpeg.wasm (client-side video processing)              │
│  • Static asset hosting                                     │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/WSS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         BACKEND API (Railway $5 or Render $7)               │
│  • Node.js + Express/Fastify                                │
│  • REST API endpoints                                       │
│  • WebSocket server (real-time updates)                    │
│  • Background job processing                                │
│  • Cron jobs for automation                                │
│  • 512MB RAM, always on (no sleep)                         │
└──────┬──────────┬──────────┬──────────┬───────────────────┘
       │          │          │          │
       ▼          ▼          ▼          ▼
   ┌────────┐ ┌──────┐ ┌──────────┐ ┌────────────┐
   │ Neon   │ │Upstash│ │Backblaze│ │External APIs│
   │Postgres│ │Redis  │ │   B2    │ │ (Optional) │
   │ (Free) │ │(Free) │ │(Storage)│ │            │
   └────────┘ └──────┘ └──────────┘ └────────────┘
```

---

## Service Breakdown

### 1. **Frontend: Vercel Free** ✅

**Purpose**: Host React PWA, serve static assets

**Features**:
- Automatic HTTPS
- Global CDN
- Zero config deployment
- Automatic preview deployments
- Custom domain support

**Limits** (Free Tier):
- ✅ Unlimited bandwidth
- ✅ 100 deployments/day
- ✅ Automatic SSL
- ✅ Edge network

**Cost**: **$0/month**

---

### 2. **Backend: Railway Hobby ($5) vs Render Starter ($7)**

#### **Option 2A: Railway Hobby - $5/month** ⭐ **RECOMMENDED**

**Why Railway:**
- ✅ **$5/month flat rate** (most cost-effective)
- ✅ 512MB RAM, 1 vCPU, 1GB disk
- ✅ **Always on** - NO SLEEP
- ✅ Automatic deployments from GitHub
- ✅ Built-in PostgreSQL (if you want, but Neon is better)
- ✅ Environment variable management
- ✅ Logs and monitoring
- ✅ **WebSocket support**
- ✅ **Custom domains**
- ✅ **Very fast deployments** (~30-60 seconds)

**Specs**:
```
RAM:        512MB
vCPU:       1 shared core
Storage:    1GB
Bandwidth:  100GB/month (plenty for single user)
Uptime:     99.9% (always on, no sleep)
```

**Best For**: Budget-conscious, simple setup, fast deployments

---

#### **Option 2B: Render Starter - $7/month**

**Why Render:**
- ✅ 512MB RAM, 0.5 vCPU, always on
- ✅ Automatic deployments from GitHub
- ✅ Free SSL certificates
- ✅ Environment variables
- ✅ Zero-downtime deploys
- ✅ Health checks
- ✅ **Slightly more mature platform**

**Specs**:
```
RAM:        512MB
vCPU:       0.5 shared core
Storage:    Free
Bandwidth:  100GB/month
Uptime:     99.9%
```

**Best For**: Prefer Render's UI/UX, willing to pay $2 more

---

### 3. **Database: Neon Postgres Free** ✅

**Purpose**: Store persistent data (videos, posts, settings, activity logs)

**Features**:
- ✅ Serverless Postgres (auto-scaling)
- ✅ Branching for development
- ✅ Point-in-time recovery
- ✅ Connection pooling built-in
- ✅ PostgreSQL 15+

**Limits** (Free Tier):
```
Storage:           0.5GB (plenty for single user)
Compute:           191.9 hours/month active time
Branches:          10 (dev/staging/prod)
Projects:          1
Connections:       Unlimited with pooling
```

**Storage Estimate for Screndly**:
```
Videos metadata:    ~10KB per video × 1000 = 10MB
Activity logs:      ~5KB per entry × 5000 = 25MB
Settings:           ~100KB
RSS feeds:          ~50KB per feed × 20 = 1MB
TMDb posts:         ~20KB per post × 500 = 10MB
Total:             ~50MB (well within 0.5GB limit)
```

**Cost**: **$0/month**

---

### 4. **Cache/Queue: Upstash Redis Free** (Optional)

**Purpose**: Caching, job queues, rate limiting, session storage

**Features**:
- ✅ Serverless Redis
- ✅ Global edge caching
- ✅ REST API (no connection management)
- ✅ Redis commands via HTTP

**Limits** (Free Tier):
```
Commands:       10,000/day (plenty for single user)
Max DB size:    256MB
Max record:     1MB
Bandwidth:      Unlimited
Regions:        1 region
```

**Usage Estimate for Screndly**:
```
Daily commands:
- Cache reads:          ~500 commands
- Cache writes:         ~200 commands
- Job queue:            ~100 commands
- Rate limiting:        ~50 commands
- Session checks:       ~50 commands
Total daily:           ~900 commands (well within 10K limit)
```

**Cost**: **$0/month**

**Note**: For single user, you can **skip Redis** and use Neon Postgres for everything. Redis is nice-to-have but not essential.

---

### 5. **Storage: Backblaze B2** ✅ **Already in Use**

**Purpose**: Video file storage, thumbnails, generated trailers

**Pricing**:
```
Storage:        $6/TB/month (vs AWS S3 $23/TB)
Downloads:      $0.01/GB (first 1GB free/day)
Upload:         FREE
API calls:      FREE (Class B), $0.004/10K (Class A)
```

**Usage Estimate** (Single User):
```
Storage:        50GB average = $0.30/month
Downloads:      10GB/month = $0.09/month
Total:         ~$0.40/month
```

**Cost**: **~$0.40/month** (minimal)

---

## Total Monthly Cost

| Service | Cost | Notes |
|---------|------|-------|
| **Vercel (Frontend)** | $0 | Free tier |
| **Railway (Backend)** | $5 | Hobby plan |
| **Neon Postgres** | $0 | Free tier (0.5GB) |
| **Upstash Redis** | $0 | Optional (can skip) |
| **Backblaze B2** | ~$0.40 | Pay-as-you-go |
| **TOTAL** | **$5.40/mo** | 💰 Very affordable |

**Alternative with Render**: $7.40/month

---

## Tech Stack Details

### Backend Stack

```javascript
// Recommended: Express + TypeScript
{
  "framework": "Express.js",
  "language": "TypeScript",
  "orm": "Prisma",
  "validation": "Zod",
  "websocket": "ws",
  "queue": "BullMQ" (with Upstash Redis) or "pg-boss" (with Postgres),
  "cron": "node-cron",
  "logging": "winston"
}
```

### API Structure

```
backend/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── videos.ts
│   │   │   ├── rss.ts
│   │   │   ├── tmdb.ts
│   │   │   ├── platforms.ts
│   │   │   └── upload.ts
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── websocket.ts
│   ├── services/
│   │   ├── youtube.service.ts
│   │   ├── tmdb.service.ts
│   │   ├── rss.service.ts
│   │   └── backblaze.service.ts
│   ├── jobs/
│   │   ├── rss-automation.ts
│   │   ├── tmdb-automation.ts
│   │   └── comment-automation.ts
│   ├── cron/
│   │   └── scheduler.ts
│   ├── database/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── migrations/
│   └── index.ts
├── package.json
├── tsconfig.json
└── Dockerfile (optional)
```

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Video {
  id              String   @id @default(cuid())
  title           String
  description     String?
  thumbnailUrl    String?
  videoUrl        String
  platform        String
  status          String   @default("pending")
  metadata        Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([platform])
  @@index([status])
  @@index([createdAt])
}

model RSSFeed {
  id              String   @id @default(cuid())
  name            String
  url             String   @unique
  enabled         Boolean  @default(true)
  lastFetchedAt   DateTime?
  fetchInterval   Int      @default(30) // minutes
  metadata        Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  posts           RSSPost[]
}

model RSSPost {
  id              String   @id @default(cuid())
  feedId          String
  title           String
  content         String?
  link            String   @unique
  publishedAt     DateTime
  processed       Boolean  @default(false)
  imageUrl        String?
  metadata        Json?
  createdAt       DateTime @default(now())
  
  feed            RSSFeed  @relation(fields: [feedId], references: [id], onDelete: Cascade)
  
  @@index([feedId])
  @@index([processed])
  @@index([publishedAt])
}

model TMDbPost {
  id              String   @id @default(cuid())
  tmdbId          Int      @unique
  title           String
  type            String   // movie, tv
  releaseDate     DateTime
  anniversary     Int?
  posted          Boolean  @default(false)
  scheduledAt     DateTime?
  metadata        Json?
  createdAt       DateTime @default(now())
  
  @@index([posted])
  @@index([scheduledAt])
}

model ActivityLog {
  id              String   @id @default(cuid())
  type            String   // upload, rss, tmdb, videostudio
  action          String
  status          String   // success, error, pending
  message         String?
  metadata        Json?
  createdAt       DateTime @default(now())
  
  @@index([type])
  @@index([createdAt])
}

model Settings {
  id              String   @id @default(cuid())
  key             String   @unique
  value           Json
  updatedAt       DateTime @updatedAt
}
```

---

## Environment Variables

### Frontend (.env.production)

```env
# API Configuration
VITE_API_URL=https://screndly-api.railway.app
VITE_WS_URL=wss://screndly-api.railway.app

# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_PWA=true
```

### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=3000
API_KEY=your_secure_api_key_here

# Database (Neon Postgres)
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/screndly?sslmode=require

# Redis (Upstash) - Optional
REDIS_URL=https://your-region.upstash.io
REDIS_TOKEN=your_token_here

# Backblaze B2
B2_KEY_ID=your_b2_key_id
B2_APPLICATION_KEY=your_b2_app_key
B2_BUCKET_NAME=screndly-trailers
B2_VIDEOS_BUCKET_NAME=screndly-videos

# External APIs
TMDB_API_KEY=your_tmdb_api_key
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
OPENAI_API_KEY=your_openai_api_key
SERPER_API_KEY=your_serper_api_key

# Social Platforms
X_CLIENT_ID=your_x_client_id
X_CLIENT_SECRET=your_x_client_secret
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
META_CLIENT_ID=your_meta_client_id
META_CLIENT_SECRET=your_meta_client_secret

# Cron Jobs
RSS_FETCH_INTERVAL=30 # minutes
TMDB_CHECK_INTERVAL=60 # minutes
COMMENT_CHECK_INTERVAL=120 # minutes
```

---

## Deployment Strategy

### 1. **Frontend (Vercel)**

```bash
# Automatic deployment on git push
git push origin main

# Or manual deployment
vercel --prod
```

### 2. **Backend (Railway)**

```bash
# Automatic deployment on git push to main
git push origin main

# Railway automatically:
# 1. Detects changes
# 2. Builds Docker image (or uses Nixpacks)
# 3. Deploys with zero downtime
# 4. Runs migrations (if configured)
```

### 3. **Database Migrations (Neon)**

```bash
# Run migrations before deployment
npx prisma migrate deploy

# Or configure Railway to run automatically:
# Settings → Deploy → Build Command
npm run build && npx prisma migrate deploy
```

---

## Monitoring & Health Checks

### Railway Health Check

```javascript
// src/api/routes/health.ts
import { Router } from 'express';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis (if using)
    if (redis) {
      await redis.ping();
    }
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      redis: redis ? 'connected' : 'not configured'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

export default router;
```

Configure in Railway:
- Health Check Path: `/health`
- Health Check Interval: 60 seconds

---

## Cron Jobs Configuration

```javascript
// src/cron/scheduler.ts
import cron from 'node-cron';
import { fetchRSSFeeds } from '../jobs/rss-automation';
import { checkTMDbPosts } from '../jobs/tmdb-automation';
import { processComments } from '../jobs/comment-automation';

export function initCronJobs() {
  // RSS Feeds - Every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log('[CRON] Running RSS feed automation...');
    await fetchRSSFeeds();
  });

  // TMDb Posts - Every hour
  cron.schedule('0 * * * *', async () => {
    console.log('[CRON] Checking TMDb posts...');
    await checkTMDbPosts();
  });

  // Comment Automation - Every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    console.log('[CRON] Processing comments...');
    await processComments();
  });

  // Daily cleanup - 3 AM every day
  cron.schedule('0 3 * * *', async () => {
    console.log('[CRON] Running daily cleanup...');
    await cleanupOldLogs();
  });

  console.log('[CRON] All cron jobs initialized');
}
```

---

## Advantages of This Architecture

### ✅ **Reliability**
- Backend always on (no cold starts)
- 99.9% uptime guarantee
- Predictable performance

### ✅ **Performance**
- Low latency API responses (<100ms)
- WebSocket support for real-time updates
- Global CDN for frontend (Vercel)

### ✅ **Cost-Effective**
- $5.40/month total cost
- Only pay for what you use (Backblaze)
- All free tiers utilized

### ✅ **Scalability**
- Easy to upgrade when needed
- Railway: $5 → $20/month (4× resources)
- Neon: Free → $19/month (3GB storage)

### ✅ **Developer Experience**
- Simple deployment workflow
- Automatic deployments from Git
- Environment variable management
- Built-in logging and monitoring
- Database branching for dev/staging

### ✅ **Maintenance**
- Automatic security updates
- Managed database (Neon)
- Zero server management
- Built-in backups

---

## Migration Checklist

### Phase 1: Setup Services

- [ ] Sign up for Railway/Render
- [ ] Create Neon Postgres database
- [ ] Sign up for Upstash Redis (optional)
- [ ] Configure Vercel project
- [ ] Set up environment variables

### Phase 2: Backend Development

- [ ] Initialize Node.js + TypeScript project
- [ ] Set up Prisma with Neon
- [ ] Create database schema
- [ ] Implement API routes
- [ ] Add WebSocket server
- [ ] Configure cron jobs
- [ ] Add health checks
- [ ] Write tests

### Phase 3: Deploy Backend

- [ ] Connect Railway to GitHub repo
- [ ] Configure build settings
- [ ] Set environment variables
- [ ] Deploy backend
- [ ] Run database migrations
- [ ] Test API endpoints
- [ ] Verify cron jobs running

### Phase 4: Update Frontend

- [ ] Update API URLs to Railway
- [ ] Update WebSocket URL
- [ ] Test all integrations
- [ ] Deploy to Vercel

### Phase 5: Testing & Monitoring

- [ ] Test all features end-to-end
- [ ] Monitor Railway logs
- [ ] Check database usage
- [ ] Verify cron jobs executing
- [ ] Test WebSocket connections
- [ ] Monitor Backblaze usage

---

## Next Steps

1. **[Setup Railway Backend](./RAILWAY_SETUP.md)** - Step-by-step Railway configuration
2. **[Setup Neon Database](./NEON_SETUP.md)** - Database configuration guide
3. **[API Implementation](./API_IMPLEMENTATION.md)** - Build the backend API
4. **[Frontend Migration](./FRONTEND_MIGRATION.md)** - Update frontend to use backend

---

**Ready to deploy a reliable, always-on Screndly backend!** 🚀