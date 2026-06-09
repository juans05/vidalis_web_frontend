# Vidalis.AI - Quick Start Guide

**Estimated time: 5-10 minutes to have everything running locally**

## ⚡ Ultra-Fast Setup

### 1️⃣ Start Backend (Terminal 1)

```bash
cd backend

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev

# ✅ You should see:
# [Backend] API Gateway running on port 3000
# ✓ All services ready
```

### 2️⃣ Start Frontend (Terminal 2)

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev

# ✅ You should see:
# VITE v5.0.0 ready in 233 ms
# Local: http://localhost:5173/
```

### 3️⃣ Open in Browser

```
http://localhost:5173
```

---

## 🔐 Login Credentials

The backend comes with demo data. Use any email/password for testing:

```
Email: demo@example.com
Password: demo123
```

Or create a new account with Register button.

---

## 📱 What You Can Do Now

### ✅ Authentication
- [x] Login with email/password
- [x] Register new account
- [x] Google OAuth (demo mode)
- [x] Logout

### ✅ Content Management
- [x] Upload videos (from URL)
- [x] Browse video gallery
- [x] Edit video metadata
- [x] View video details & status
- [x] Delete videos
- [x] Retry failed uploads

### ✅ Analytics
- [x] View engagement stats
- [x] See growth trends (30-day chart)
- [x] Platform breakdown visualization
- [x] Key metrics (views, likes, shares, saves)

### ✅ Growth Pro
- [x] Read AI insights & recommendations
- [x] See best posting times
- [x] View content strategy suggestions
- [x] Track viral score history
- [x] View engagement patterns

---

## 🗺️ Page Navigation

```
Dashboard (Home)
├── Upload Video → Upload Page
├── Gallery → Gallery Page
│   └── Click video → Detail Page
├── Analytics → Analytics Dashboard
└── Growth Pro → Growth Pro Page
```

---

## 🧪 Testing API Endpoints

### Option 1: VS Code REST Client

Install "REST Client" extension, then create `api.rest`:

```rest
### Login
POST http://localhost:3000/api/vidalis/login
Content-Type: application/json

{
  "email": "demo@example.com",
  "password": "demo123"
}

### Get User (Replace TOKEN with token from login)
GET http://localhost:3000/api/vidalis/user/user-123
Authorization: Bearer TOKEN

### Get Gallery
GET http://localhost:3000/api/vidalis/gallery/artist-123
Authorization: Bearer TOKEN
```

### Option 2: Postman

1. Create new collection
2. Add requests with endpoints from `README.md`
3. Set Authorization header: `Bearer <token_from_login>`

### Option 3: curl

```bash
# Login
curl -X POST http://localhost:3000/api/vidalis/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}'

# Gallery (replace TOKEN)
curl http://localhost:3000/api/vidalis/gallery/artist-123 \
  -H "Authorization: Bearer TOKEN"
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is in use
lsof -i :3000

# If in use, kill it
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Frontend won't start
```bash
# Check if port 5173 is in use
lsof -i :5173

# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### CORS errors
```
Check that both backend and frontend are running
Backend: http://localhost:3000
Frontend: http://localhost:5173
```

### Login fails
```
Ensure backend is running
Backend should show: "API Gateway running on port 3000"
```

---

## 📝 Sample Workflows

### Workflow 1: Upload & Analyze Video

1. Login → Dashboard
2. Click "Upload Video"
3. Enter: `https://example.com/video.mp4`
4. Select platforms (TikTok, Instagram)
5. Click "Upload & Process"
6. Status shows "analyzing"
7. Go to Gallery to see video
8. Click video to view details

### Workflow 2: Check Analytics

1. Login → Dashboard
2. Click "Analytics"
3. View your stats (followers, views, engagement)
4. Scroll down for charts
5. See growth trends and platform breakdown

### Workflow 3: Get Growth Recommendations

1. Login → Dashboard
2. Click "Growth Pro"
3. Read AI insights on "Insights" tab
4. Check "Best Time" for posting schedule
5. View "Strategy" for content ideas
6. See "Viral Trends" for historical data

---

## 🎯 Key Features Explained

### 📊 Video Status States

```
analyzing → processing → ready → published
                    ↓
                   error (can retry)
```

- **analyzing**: AI is analyzing the video
- **processing**: Being prepared for publishing
- **ready**: Analyzed, ready to publish
- **published**: Live on social platforms
- **error**: Failed processing (can retry)

### 💡 AI Features

- **Insights:** Personalized recommendations based on your analytics
- **Best Time:** When to post for maximum engagement
- **Strategy:** What types of content to create
- **Viral Trends:** Your viral score over time
- **Ad Copy:** Multiple copy variations for testing

### 📈 Analytics Metrics

- **Views:** Total video views
- **Engagement Rate:** (Likes + Comments + Shares) / Views
- **Growth:** Month-over-month change
- **Platform Breakdown:** How many views from each platform

---

## 🔧 Advanced Options

### Change Backend Port

```bash
cd backend
PORT=3001 npm run dev
```

### Change Frontend Port

```bash
cd frontend
# Edit vite.config.ts, change port in server config
npm run dev
```

### Disable CORS for Testing

Edit `backend/src/index.ts`:
```typescript
app.use(cors({
  origin: '*'  // Allow all origins (dev only!)
}));
```

---

## 📚 Next Steps

1. **Explore the codebase**
   - Read `PROJECT_ANALYSIS.md` for architecture
   - Check `DEVELOPMENT_STATUS.md` for detailed progress

2. **Understand the stack**
   - Backend: `backend/README.md`
   - Frontend: `frontend/README.md`

3. **Modify and extend**
   - Add new fields to models
   - Create new API endpoints
   - Build new UI pages

4. **Setup database** (for production)
   - Install PostgreSQL
   - Setup Prisma
   - Run migrations
   - Replace in-memory storage

---

## 🎓 Learning Resources

### Backend Architecture
- Express.js pattern: `backend/src/services/auth/router.ts`
- Error handling: `backend/src/shared/errors.ts`
- Middleware: `backend/src/shared/auth-middleware.ts`

### Frontend Architecture
- State management: `frontend/src/store/auth.ts`
- API client: `frontend/src/services/api.ts`
- Routing: `frontend/src/App.tsx`

### Component Examples
- Form handling: `frontend/src/features/auth/pages/LoginPage.tsx`
- Data fetching: `frontend/src/features/analytics/pages/AnalyticsDashboard.tsx`
- Charts: Uses Recharts (see Analytics page)

---

## 📞 Common Questions

**Q: How do I change the API URL?**
A: Edit `frontend/.env` and change `VITE_API_URL`

**Q: Can I use a real database?**
A: Yes! Follow the setup in `DEVELOPMENT_STATUS.md` → Phases 5-6

**Q: How do I add new endpoints?**
A: 
1. Create service in `backend/src/services/[name]/`
2. Add router endpoint
3. Import router in `api-gateway/router.ts`

**Q: How do I test API endpoints?**
A: Use REST Client extension or Postman with Bearer token auth

**Q: What's included in the project?**
A: 4 complete microservices (Auth, Content, Analytics, Growth) + React frontend

---

## 🚀 You're Ready!

```
✅ Backend running at http://localhost:3000
✅ Frontend running at http://localhost:5173
✅ Login working
✅ All 4 core services functional
✅ Analytics and dashboards working

🎉 Everything is ready to explore!
```

**Next: Open http://localhost:5173 and start exploring Vidalis.AI!**

---

## 📖 Full Documentation

- **[README.md](./README.md)** - Full project overview
- **[PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md)** - Architecture & design
- **[DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)** - Development progress
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Detailed setup guide
- **[backend/README.md](./backend/README.md)** - Backend guide
- **[frontend/README.md](./frontend/README.md)** - Frontend guide

---

**Happy coding! 🚀**
