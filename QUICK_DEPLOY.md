# ⚡ Quick Deployment Checklist

## Pre-Deployment

- [ ] MongoDB Atlas database created
- [ ] MongoDB connection string ready
- [ ] GitHub repository created
- [ ] Code pushed to GitHub

## Step 1: Deploy Server (Backend)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"** → **"Import Git Repository"**
3. Select your repository
4. **Configure:**
   - **Root Directory**: `server`
   - **Framework**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

5. **Add Environment Variables:**
   ```
   PORT=5001
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-32-character-secret-key
   JWT_EXPIRE=7d
   NODE_ENV=production
   CLIENT_URL=https://your-client-url.vercel.app (add after client deploy)
   ```

6. Click **"Deploy"**
7. **Copy Server URL**: `https://nool-erp-server-xxx.vercel.app`

## Step 2: Deploy Client (Frontend)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"** → **"Import Git Repository"**
3. Select the **same** repository
4. **Configure:**
   - **Root Directory**: `client`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variable:**
   ```
   VITE_API_URL=https://your-server-url.vercel.app
   ```
   (Use the server URL from Step 1)

6. Click **"Deploy"**
7. **Copy Client URL**: `https://nool-erp-client-xxx.vercel.app`

## Step 3: Update Server CORS

1. Go back to **Server** project settings
2. Update `CLIENT_URL` environment variable:
   ```
   CLIENT_URL=https://your-client-url.vercel.app
   ```
3. Redeploy server (or it will auto-redeploy)

## Step 4: Test Deployment

1. Visit your client URL
2. Login with demo credentials:
   - Email: `admin@nool.com`
   - Password: `admin123`

## Your Live URLs

- **Frontend**: `https://your-client-url.vercel.app`
- **Backend API**: `https://your-server-url.vercel.app`
- **Health Check**: `https://your-server-url.vercel.app/api/health`

## Next Steps

- Seed demo data (see DEPLOYMENT_GUIDE.md)
- Configure custom domain (optional)
- Set up monitoring

---

**🎉 Your Nool ERP is now live!**

