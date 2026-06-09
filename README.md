# Vidalis.AI - Web Platform

**AI-Powered Content Creation & Growth Platform for Creators**

Build, analyze, and grow your content empire with Vidalis.AI. Leverage AI to generate hooks, optimize posting times, and track viral metrics across all platforms.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ LTS
- npm or yarn
- Modern web browser

### 1. Setup Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend runs on `http://localhost:3000`

### 2. Setup Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### 3. Access the Application

Open `http://localhost:5173` in your browser.

**Demo Credentials:**
```
Email: demo@example.com
Password: demo123
```

---

## 📋 Features

### ✅ Implemented (Phase 1-4)

#### Authentication
- Email/password login and registration
- Google OAuth integration
- JWT with refresh tokens
- Session management
- Plan-based access control

#### Content Management
- Upload videos from URL
- Auto-compress before processing
- Metadata editing (title, caption, hashtags)
- Video gallery with filters and sorting
- Cloudinary integration for storage
- Status tracking (analyzing → ready → published)

#### Analytics Dashboard
- Real-time engagement metrics
- Growth trends over 30 days
- Platform breakdown (TikTok, Instagram, YouTube, Facebook)
- Video-level analytics
- Engagement rate calculations

#### Growth Pro Features
- **AI Insights:** Personalized recommendations
- **Best Time to Post:** Hourly/daily analysis
- **Content Strategy:** Trending content recommendations
- **Viral Score Tracking:** 30-day historical trends
- **A/B Testing:** Generate and compare variants
- **Ad Copy Generation:** Multiple styles with engagement estimates
- **Copy Refinement:** AI-powered text improvement

---

## 🏗️ Architecture

### Microservices

```
┌─────────────────────────────────────┐
│      Frontend (React + Vite)        │
│  http://localhost:5173              │
└────────────────┬────────────────────┘
                 │
        ┌────────▼────────┐
        │   API Gateway   │
        │ http://localhost:3000
        └────────┬────────┘
                 │
    ┌────────────┼────────────┬──────────────┬──────────┐
    │            │            │              │          │
┌───▼───┐  ┌────▼───┐  ┌────▼───┐  ┌──────▼──┐  ┌────▼────┐
│ Auth  │  │Content │  │Analytics│  │ Growth  │  │ Social  │
│ 3001  │  │ 3002   │  │  3003   │  │ 3004    │  │ 3005    │
└───────┘  └────────┘  └─────────┘  └─────────┘  └─────────┘
  Users    Videos      Stats         Insights    Publishing
 Sessions  Gallery     Metrics       Strategy    Platforms
 Plans     Metrics     Growth        AI Copy     Scheduling
```

### Tech Stack

**Backend:**
- Node.js 20 LTS
- Express.js
- TypeScript
- JWT Authentication
- In-Memory Storage (Maps)
- Cloudinary API

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- Zustand (State)
- React Query (Data)
- Recharts (Visualizations)
- React Router

---

## 📁 Project Structure

```
vidalis-web/
├── backend/
│   ├── src/
│   │   ├── api-gateway/        # Main router
│   │   ├── services/
│   │   │   ├── auth/           # Auth Service
│   │   │   ├── content/        # Content Service
│   │   │   ├── analytics/      # Analytics Service
│   │   │   ├── growth/         # Growth Service
│   │   │   └── social/         # Social Service [TODO]
│   │   └── shared/             # Middleware, types, utils
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/           # Login, Register
│   │   │   ├── dashboard/      # Home dashboard
│   │   │   ├── content/        # Upload, Gallery, Detail
│   │   │   ├── analytics/      # Stats dashboard
│   │   │   ├── growth/         # Growth Pro
│   │   │   └── social/         # Social [TODO]
│   │   ├── services/           # API clients
│   │   ├── store/              # Zustand stores
│   │   ├── components/         # Shared components
│   │   ├── App.tsx             # Router
│   │   └── main.tsx            # Entry
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
├── PROJECT_ANALYSIS.md         # Mobile analysis & architecture
├── GETTING_STARTED.md          # Initial setup guide
├── DEVELOPMENT_STATUS.md       # Current dev progress
└── README.md                   # This file
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/vidalis/login
POST   /api/vidalis/register
POST   /api/vidalis/google-login
GET    /api/vidalis/user/:userId              [Protected]
PATCH  /api/vidalis/user/:userId              [Protected]
POST   /api/vidalis/refresh-token
```

### Content
```
POST   /api/vidalis/upload                    [Protected]
POST   /api/vidalis/videos/from-url           [Protected]
GET    /api/vidalis/gallery/:artistId         [Protected]
GET    /api/vidalis/video/:videoId            [Protected]
PATCH  /api/vidalis/video/:videoId            [Protected]
DELETE /api/vidalis/video/:videoId            [Protected]
GET    /api/vidalis/video/:videoId/publish-status  [Protected]
POST   /api/vidalis/video/:videoId/retry      [Protected]
```

### Analytics
```
GET    /api/vidalis/stats/:agencyId           [Protected]
GET    /api/vidalis/analytics/:videoId        [Protected]
```

### Growth Pro
```
GET    /api/vidalis/artists/:artistId/growth/insights      [Protected]
GET    /api/vidalis/artists/:artistId/growth/best-time     [Protected]
GET    /api/vidalis/artists/:artistId/growth/strategy      [Protected]
GET    /api/vidalis/artists/:artistId/growth/viral-history [Protected]
POST   /api/vidalis/videos/:videoId/ab-variants            [Protected]
GET    /api/vidalis/videos/:videoId/ab-result              [Protected]
POST   /api/vidalis/videos/:videoId/ad-copy                [Protected]
POST   /api/vidalis/refine-copy                            [Protected]
```

---

## 🛠️ Development Guide

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests (coming soon)
npm run test:e2e
```

### Building for Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

### Code Quality

```bash
# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Formatting
npm run format
```

---

## 📊 Current Status

| Feature | Status | Progress |
|---------|--------|----------|
| Auth Service | ✅ Complete | 100% |
| Content Service | ✅ Complete | 100% |
| Analytics Service | ✅ Complete | 100% |
| Growth Service | ✅ Complete | 100% |
| Social Service | ⏳ In Progress | 0% |
| Database (Prisma) | ⏳ Pending | 0% |
| Testing Suite | ⏳ Pending | 0% |
| Deployment | ⏳ Pending | 0% |

**See [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md) for detailed progress report.**

---

## 🔐 Security

- JWT authentication with secure tokens
- Password hashing with bcrypt
- CORS protection
- Environment variables for secrets
- Request validation
- Error handling without leaking info

**Security Checklist:**
- [ ] Enable HTTPS in production
- [ ] Configure database encryption
- [ ] Setup rate limiting
- [ ] Implement audit logging
- [ ] Regular security audits
- [ ] Dependency scanning

---

## 🚀 Deployment

### Local with Docker

```bash
# Build images
docker build -t vidalis-backend ./backend
docker build -t vidalis-frontend ./frontend

# Run with docker-compose
docker-compose up
```

### Cloud Deployment Options

- **Backend:** Railway, Render, AWS ECS, Google Cloud Run
- **Frontend:** Vercel, Netlify, AWS Amplify
- **Database:** PostgreSQL on RDS, Heroku, Railway

**See deployment guides in service READMEs.**

---

## 📚 Documentation

- **[PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md)** - Deep dive on architecture
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Initial setup guide
- **[DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)** - Development progress & next steps
- **[backend/README.md](./backend/README.md)** - Backend setup & services
- **[frontend/README.md](./frontend/README.md)** - Frontend setup & components
- **[backend/src/services/auth/README.md](./backend/src/services/auth/README.md)** - Auth API docs
- **[backend/src/services/content/README.md](./backend/src/services/content/README.md)** - Content API docs

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Submit pull request

### Code Standards
- Use TypeScript strict mode
- Follow ESLint rules
- Format with Prettier
- Write meaningful commit messages
- Add tests for new features

---

## 📞 Support & Issues

- Check documentation first
- Review existing issues
- Create detailed bug reports
- Include error logs and reproduction steps

---

## 📄 License

Proprietary - All rights reserved

---

## 🎯 Roadmap

### Q3 2026
- [x] Phase 1: Project setup
- [x] Phase 2: Content management
- [x] Phase 3: Analytics
- [x] Phase 4: Growth Pro features
- [ ] Phase 5: Social integration

### Q4 2026
- [ ] Database migration (PostgreSQL)
- [ ] Testing suite (>80% coverage)
- [ ] Production deployment
- [ ] Performance optimization
- [ ] Advanced AI features

### Q1 2027
- [ ] Mobile app sync
- [ ] Team collaboration
- [ ] Advanced scheduling
- [ ] Custom branding
- [ ] API for third-party integration

---

## 👨‍💻 Created by

**Juan** - Full-stack development  
Email: juans0520@gmail.com  
Date: June 2026

---

**Ready to grow your content? Start uploading now! 🚀**

Visit `http://localhost:5173` and login with the demo credentials to explore all features.

