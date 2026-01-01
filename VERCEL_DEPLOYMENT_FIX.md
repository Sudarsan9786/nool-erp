# 🔧 Vercel Deployment Fix Guide

## Problem
Error: `Cannot read properties of undefined (reading 'fsPath')`  
Status: `404: NOT_FOUND` / `DEPLOYMENT_NOT_FOUND`

## Root Cause
This error occurs when Vercel tries to build from the **root directory** instead of the **server directory**. The `vercel.json` file expects paths relative to the `server/` folder, but Vercel is resolving them from the repository root.

## Solution

### Step 1: Verify Vercel Project Settings

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your **server project** (the one showing the error)
3. Go to **Settings** → **General**
4. Scroll down to **Root Directory**
5. **CRITICAL**: Ensure it's set to `server` (not empty, not `/`, not `./server`)
6. If it's not set correctly:
   - Click **Edit**
   - Type: `server`
   - Click **Save**

### Step 2: Verify Build Settings

In the same **Settings** → **General** page, verify:
- **Framework Preset**: `Other` (or leave empty)
- **Build Command**: Leave **empty** (Vercel will auto-detect)
- **Output Directory**: Leave **empty**
- **Install Command**: `npm install` (or leave empty)

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click the **three dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger a new deployment

### Step 4: Verify File Structure

Ensure your repository structure matches:
```
nool-erp/
├── server/
│   ├── api/
│   │   └── index.js          ← Entry point
│   ├── src/
│   │   └── server.js         ← Express app
│   ├── package.json
│   └── vercel.json           ← Vercel config
└── client/
    └── ...
```

### Step 5: Check Environment Variables

Ensure all required environment variables are set in Vercel:
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `NODE_ENV=production`
- `CLIENT_URL` (after client is deployed)

## Alternative: Create New Project

If the above doesn't work, create a fresh project:

1. **Delete** the current server project in Vercel (or rename it)
2. Create a **new project**:
   - Import from GitHub
   - Select your `nool-erp` repository
   - **Root Directory**: `server` ← **CRITICAL**
   - Framework: `Other`
   - Deploy

## Verification

After deployment, check:
1. Build logs show no errors
2. Visit: `https://your-server-url.vercel.app/api/health`
3. Should return: `{"status":"OK","message":"Nool ERP Server is running",...}`

## Common Mistakes

❌ **Wrong**: Root Directory = `/` or empty  
✅ **Correct**: Root Directory = `server`

❌ **Wrong**: Root Directory = `./server`  
✅ **Correct**: Root Directory = `server`

❌ **Wrong**: Building from root with `server/vercel.json`  
✅ **Correct**: Building from `server/` directory

## Still Having Issues?

1. Check Vercel build logs for specific errors
2. Verify `server/api/index.js` exists and exports correctly
3. Ensure `server/package.json` has correct `type: "module"`
4. Check that all dependencies are in `package.json`

