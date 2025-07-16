# Separate Vercel Deployment Guide

## 🚀 Deploy Client and Server Separately

### **PART 1: Deploy Server (API)**

#### 1.1 Server Deployment Steps:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New" → "Project"**
3. **Import GitHub Repository**: Select your `solar-service-shedule` repo
4. **Configure Server Deployment**:
   - **Framework Preset**: `Other`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

#### 1.2 Server Environment Variables:
Add these in Vercel dashboard for the server project:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://prabhathdilshan2001:BqtL0zkQKOIVYgrU@solarservice.n0jim72.mongodb.net/solar-tracker?retryWrites=true&w=majority&appName=solarservice
CORS_ORIGIN=https://your-client-domain.vercel.app
```

#### 1.3 Server URL:
After deployment, your API will be available at:
```
https://your-server-name.vercel.app
```

**Important API Endpoints:**
- Health Check: `https://your-server-name.vercel.app/api/health`
- Installations: `https://your-server-name.vercel.app/api/installations`

---

### **PART 2: Deploy Client (Frontend)**

#### 2.1 Client Deployment Steps:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New" → "Project"** (Second project)
3. **Import Same GitHub Repository**: Select your `solar-service-shedule` repo again
4. **Configure Client Deployment**:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

#### 2.2 Client Environment Variables:
Add this in Vercel dashboard for the client project:

```
REACT_APP_API_URL=https://your-server-name.vercel.app/api
GENERATE_SOURCEMAP=false
```

#### 2.3 Client URL:
After deployment, your frontend will be available at:
```
https://your-client-name.vercel.app
```

---

## 📝 **Step-by-Step Deployment Process**

### **Phase 1: Deploy Server First**

1. **Create Server Project in Vercel**:
   - Project Name: `solar-service-api`
   - Root Directory: `server`
   - Add MongoDB URI and environment variables

2. **Note down your server URL** (e.g., `https://solar-service-api.vercel.app`)

### **Phase 2: Deploy Client Second**

1. **Create Client Project in Vercel**:
   - Project Name: `solar-service-client`
   - Root Directory: `client`
   - Set `REACT_APP_API_URL` to your server URL from Phase 1

2. **Update Server CORS**:
   - Go back to server project settings
   - Update `CORS_ORIGIN` to your client URL

---

## 🔧 **Environment Variables Summary**

### **Server Project Variables:**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://prabhathdilshan2001:BqtL0zkQKOIVYgrU@solarservice.n0jim72.mongodb.net/solar-tracker?retryWrites=true&w=majority&appName=solarservice
CORS_ORIGIN=https://your-client-domain.vercel.app
```

### **Client Project Variables:**
```
REACT_APP_API_URL=https://your-server-domain.vercel.app/api
GENERATE_SOURCEMAP=false
```

---

## ✅ **Verification Checklist**

After both deployments:

### **Server Verification:**
- [ ] `https://your-server.vercel.app/api/health` returns OK
- [ ] `https://your-server.vercel.app/api/installations` works
- [ ] MongoDB connection successful

### **Client Verification:**
- [ ] Frontend loads at `https://your-client.vercel.app`
- [ ] Dashboard shows data from API
- [ ] CRUD operations work
- [ ] No CORS errors in browser console

### **Integration Verification:**
- [ ] Client can fetch data from server
- [ ] Add new installation works
- [ ] Edit/Delete operations work
- [ ] Search and filters work

---

## 🚨 **Important Notes**

1. **Deploy SERVER first**, then CLIENT
2. **Update CORS_ORIGIN** after client deployment
3. **Test API endpoints** before deploying client
4. **Both projects** use the same GitHub repository but different root directories
5. **Environment variables** are set separately for each project

---

## 🔄 **Future Updates**

For updates:
1. **Push changes to GitHub**
2. **Vercel auto-deploys** both projects
3. **Check both deployments** work together
4. **Update environment variables** if needed
