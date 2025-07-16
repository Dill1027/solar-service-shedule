# Vercel Deployment Guide

## 🚀 Manual Deployment to Vercel

### Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Have a Vercel account
3. MongoDB Atlas database setup

### Step-by-Step Deployment

#### 1. **Prepare Environment Variables**
Create these environment variables in your Vercel dashboard:

**For Production:**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/solar-tracker
CORS_ORIGIN=https://your-app.vercel.app
REACT_APP_API_URL=https://your-app.vercel.app/api
```

#### 2. **Deploy Using Vercel CLI**

```bash
# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name: solar-service-schedule
# - Directory: ./
# - Override settings? No

# For subsequent deployments
vercel --prod
```

#### 3. **Alternative: Deploy via GitHub Integration**

1. Push your code to GitHub
2. Go to Vercel Dashboard
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** ./
   - **Build Command:** `npm run vercel-build`
   - **Output Directory:** `client/build`
6. Add environment variables in Vercel dashboard
7. Deploy

#### 4. **Verify Deployment**

- Frontend: `https://your-app.vercel.app`
- API Health Check: `https://your-app.vercel.app/api/health`
- Database Test: `https://your-app.vercel.app/api/installations`

### 🔧 Configuration Files Created

- `vercel.json` - Main Vercel configuration
- `server/api/index.js` - Serverless function entry point
- Updated `package.json` scripts for Vercel builds
- Modified `server.js` to work with serverless environment

### 📝 Notes

- The client will be served as static files
- The server runs as Vercel serverless functions
- MongoDB connection will be established per request
- CORS is configured to work with your Vercel domain

### 🐛 Troubleshooting

If deployment fails:
1. Check build logs in Vercel dashboard
2. Verify environment variables are set
3. Ensure MongoDB URI is accessible
4. Check function logs for runtime errors
