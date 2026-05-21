# Frontend-Backend Connection Guide

## ✅ What's Been Configured

### 1. **Frontend Environment (.env.local)**
- Created `.env.local` with `VITE_API_URL=http://localhost:5001`
- This tells the frontend where to find the backend API

### 2. **Frontend API Configuration**
- The frontend already has axios interceptors set up
- JWT tokens are automatically added from localStorage
- 401 errors redirect to login page

### 3. **Docker Compose Updated**
- Added frontend service that builds and runs on port 5173
- Backend on port 5001
- Database on default PostgreSQL port
- Frontend automatically proxies API calls to backend

### 4. **Frontend Dockerfile Created**
- Multi-stage build (builder + nginx)
- Optimized for production deployment

### 5. **Nginx Configuration Created**
- SPA routing enabled (all requests go to index.html except /api)
- API proxy to backend
- Static file caching

---

## 🚀 How to Run (Development)

### Option 1: Local Development (Separate Terminals)

**Terminal 1 - Start Backend** (Already running at localhost:5001)
```bash
cd backend
npm start
```

**Terminal 2 - Start Frontend**
```bash
cd frontend
npm install
npm run dev
```

Frontend will be at: `http://localhost:5173`

---

### Option 2: Docker Compose (All Services Together)

```bash
# From project root
docker-compose up --build
```

Access:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5001
- **Backend Health**: http://localhost:5001/api/health

---

## 🔌 API Endpoints to Test

Once frontend is running, it should connect to backend at:
- **Base URL**: http://localhost:5001
- **Health Check**: http://localhost:5001/api/health
- **Login**: POST http://localhost:5001/auth/login
- **Register**: POST http://localhost:5001/auth/register

---

## 📝 Frontend API Service Files

The frontend has pre-configured API services:
- `src/services/api.js` - Base axios instance with interceptors
- `src/services/auth.api.js` - Login/Register endpoints
- `src/services/admin.api.js` - Admin endpoints
- `src/services/employee.api.js` - Employee endpoints
- `src/services/permission.api.js` - Permission endpoints

All use the `VITE_API_URL` environment variable automatically.

---

## 🌍 Production Deployment

For production, update the environment:

### In docker-compose.yml or .env.production:
```bash
VITE_API_URL=https://your-api-domain.com
```

### Or in frontend/.env.production:
```bash
VITE_API_URL=https://your-api-domain.com
```

Then rebuild:
```bash
docker-compose up --build
```

---

## ✨ Features Already Set Up

✅ JWT authentication with localStorage  
✅ Automatic token inclusion in request headers  
✅ 401 error handling (redirects to login)  
✅ CORS support in backend  
✅ API base URL configurable via environment  
✅ React Query for data fetching  
✅ Axios for HTTP requests  
✅ Socket.io for real-time features  

---

## 🐛 Troubleshooting

**Frontend can't connect to backend?**
- Check if backend is running on port 5001
- Verify `VITE_API_URL` in `.env.local`
- Check browser console for CORS errors
- Make sure firewall allows port 5001

**Docker containers not communicating?**
- Ensure all services are in same docker-compose
- Use service names (not localhost) for inter-service communication
- Check docker network: `docker network ls`

**Port already in use?**
- Change ports in docker-compose.yml
- Update `VITE_API_URL` accordingly

---

## 📦 Next Steps

1. ✅ Run `npm install` in frontend directory
2. ✅ Start backend (already running)
3. ✅ Run `npm run dev` in frontend
4. ✅ Open browser to http://localhost:5173
5. ✅ Test login with your credentials
6. ✅ Verify API calls in Network tab
