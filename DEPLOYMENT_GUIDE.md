# 🚀 Nool ERP - Production Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free tier works)
- MongoDB Atlas account (free tier works)

## Step 1: Prepare GitHub Repository

### 1.1 Initialize Git (if not already done)
```bash
cd /Users/sudarsanperumalv/nool-erp
git init
git add .
git commit -m "Initial commit - Production ready"
```

### 1.2 Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `nool-erp`
3. **DO NOT** initialize with README, .gitignore, or license
4. Copy the repository URL

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/nool-erp.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend (Server) to Vercel

### 2.1 Import Server Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your `nool-erp` repository
5. **Important**: Configure the project:
   - **Root Directory**: Select `server` folder
   - **Framework Preset**: Other
   - **Build Command**: Leave empty (Vercel will auto-detect)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

### 2.2 Configure Environment Variables
In Vercel project settings, add these environment variables:

```
PORT=5001
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRE=7d
NODE_ENV=production
TWILIO_ACCOUNT_SID=your-twilio-account-sid (optional)
TWILIO_AUTH_TOKEN=your-twilio-auth-token (optional)
TWILIO_PHONE_NUMBER=your-twilio-phone-number (optional)
```

**Important**: 
- Replace `your-mongodb-atlas-connection-string` with your actual MongoDB Atlas connection string
- Generate a strong JWT_SECRET (at least 32 characters)
- You can get MongoDB Atlas connection string from: https://cloud.mongodb.com

### 2.3 Deploy Server
1. Click **"Deploy"**
2. Wait for deployment to complete
3. **Copy the deployment URL** (e.g., `https://nool-erp-server-xyz.vercel.app`)
4. This is your **API URL**

## Step 3: Deploy Frontend (Client) to Vercel

### 3.1 Create New Vercel Project for Client
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select the **same** `nool-erp` repository
5. **Important**: Configure the project:
   - **Root Directory**: Select `client` folder
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3.2 Configure Environment Variables
Add this environment variable:

```
VITE_API_URL=https://your-server-url.vercel.app
```

Replace `https://your-server-url.vercel.app` with the **actual server URL** from Step 2.3

### 3.3 Update Vercel.json (if needed)
The `client/vercel.json` file should have the correct server URL. Update it:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-server-url.vercel.app/api/$1"
    }
  ]
}
```

### 3.4 Deploy Client
1. Click **"Deploy"**
2. Wait for deployment to complete
3. **Copy the deployment URL** (e.g., `https://nool-erp-client-xyz.vercel.app`)
4. This is your **Frontend URL**

## Step 4: Update Server CORS Settings

### 4.1 Update Server CORS
After deploying client, update server CORS to allow your client domain:

1. Go to Server project settings in Vercel
2. Add environment variable:
   ```
   CLIENT_URL=https://your-client-url.vercel.app
   ```

3. Update `server/src/server.js` to use this:
   ```javascript
   const allowedOrigins = [
     process.env.CLIENT_URL,
     'http://localhost:3000'
   ];
   ```

## Step 5: Seed Initial Data

### 5.1 Seed Demo Users
After deployment, you can seed demo users by calling:
```
POST https://your-server-url.vercel.app/api/auth/seed-demo-users
```

### 5.2 Seed Demo Vendors
```
POST https://your-server-url.vercel.app/api/vendors/seed-demo
```

### 5.3 Seed Demo Materials
```
POST https://your-server-url.vercel.app/api/materials/seed-demo
```

**Note**: These endpoints require authentication. You may need to temporarily make them public or use a script.

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain to Client
1. Go to Client project settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS instructions

### 6.2 Add Custom Domain to Server
1. Go to Server project settings → Domains
2. Add your API subdomain (e.g., `api.yourdomain.com`)
3. Update `VITE_API_URL` in client environment variables

## Troubleshooting

### Issue: CORS Errors
- Make sure `CLIENT_URL` is set correctly in server environment variables
- Check that server CORS middleware allows your client domain

### Issue: API Not Found
- Verify `VITE_API_URL` is set correctly in client environment variables
- Check that server is deployed and accessible

### Issue: MongoDB Connection Failed
- Verify MongoDB Atlas connection string is correct
- Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Vercel)
- Verify database user has correct permissions

### Issue: Build Fails
- Check Vercel build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

## Production Checklist

- [ ] MongoDB Atlas database created and accessible
- [ ] Environment variables configured in both projects
- [ ] Server deployed and accessible
- [ ] Client deployed and accessible
- [ ] CORS configured correctly
- [ ] Demo data seeded
- [ ] Custom domains configured (optional)
- [ ] SSL certificates active (automatic with Vercel)

## Support

For issues, check:
- Vercel deployment logs
- Server logs in Vercel dashboard
- MongoDB Atlas connection logs

## URLs After Deployment

- **Frontend**: `https://your-client-url.vercel.app`
- **Backend API**: `https://your-server-url.vercel.app`
- **API Documentation**: `https://your-server-url.vercel.app/api`

---

**🎉 Congratulations! Your Nool ERP is now live in production!**

