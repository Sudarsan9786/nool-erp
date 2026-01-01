# 🔧 Fix Database Connection Error

## Current Issue
```
{"success":false,"error":"Database connection failed. Please try again later."}
```

## What I've Done

✅ **Improved error handling** - More specific error messages  
✅ **Added diagnostic endpoint** - `/api/health/db` to test database connection  
✅ **Enhanced logging** - Better error details in logs  
✅ **Fixed middleware** - Health endpoints now skip database connection  

## Step 1: Wait for Deployment

The changes have been pushed to GitHub. Vercel should auto-deploy in 1-2 minutes.

**Check deployment status:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `nool-erp-test`
3. Check the latest deployment status
4. Wait for it to show "Ready" ✅

## Step 2: Verify MONGODB_URI is Set

**CRITICAL**: The database connection error usually means `MONGODB_URI` is not set in Vercel.

### Check Environment Variables:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select project: `nool-erp-test`
3. Go to **Settings** → **Environment Variables**
4. Look for `MONGODB_URI`

### If MONGODB_URI is Missing:

1. Click **Add New**
2. **Key**: `MONGODB_URI`
3. **Value**: Your MongoDB connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/nool-erp?retryWrites=true&w=majority
   ```
4. **Environment**: Select **Production** ✅ (and Preview/Development if needed)
5. Click **Save**
6. **Redeploy** the project (or wait for auto-redeploy)

## Step 3: Get Your MongoDB Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Connect** on your cluster
3. Select **"Connect your application"**
4. Copy the connection string
5. Replace:
   - `<username>` → Your MongoDB username
   - `<password>` → Your MongoDB password
   - Add database name: `...mongodb.net/nool-erp?...`

**Final format:**
```
mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/nool-erp?retryWrites=true&w=majority
```

## Step 4: Check MongoDB Atlas IP Whitelist

1. Go to MongoDB Atlas → **Network Access**
2. Click **Add IP Address**
3. Add: `0.0.0.0/0` (allows all IPs - required for Vercel)
4. Click **Confirm**
5. Wait 1-2 minutes for changes to propagate

## Step 5: Test Database Connection

After deployment completes and MONGODB_URI is set:

```bash
# Test database connection
curl https://nool-erp-test.vercel.app/api/health/db
```

**Expected response (success):**
```json
{
  "status": "OK",
  "database": {
    "state": "connected",
    "readyState": 1,
    "connected": true
  }
}
```

**If MONGODB_URI is not set:**
```json
{
  "status": "ERROR",
  "error": "MONGODB_URI environment variable is not set",
  "solution": "Please set MONGODB_URI in Vercel environment variables"
}
```

## Step 6: Test Login

Once database is connected:

```bash
curl -X POST https://nool-erp-test.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nool.com","password":"admin123"}'
```

## Common Error Messages & Solutions

### Error: "MONGODB_URI is not set"
**Solution**: Add `MONGODB_URI` in Vercel environment variables

### Error: "Cannot reach MongoDB servers"
**Solution**: Add `0.0.0.0/0` to MongoDB Atlas IP whitelist

### Error: "MongoDB authentication failed"
**Solution**: Check username and password in connection string

### Error: "Connection timeout"
**Solution**: 
- Check MongoDB cluster is running (not paused)
- Verify IP whitelist includes `0.0.0.0/0`

### Error: "Invalid connection string"
**Solution**: 
- Use format: `mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority`
- Make sure database name is included

## Quick Checklist

- [ ] Vercel deployment is complete (check dashboard)
- [ ] `MONGODB_URI` is set in Vercel environment variables
- [ ] Connection string includes database name (`/nool-erp`)
- [ ] MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- [ ] MongoDB cluster is running (not paused)
- [ ] Tested `/api/health/db` endpoint
- [ ] Database connection shows "connected"

## Still Having Issues?

1. **Check Vercel Logs**:
   - Vercel Dashboard → Your Project → Deployments
   - Click latest deployment → Functions tab
   - Look for MongoDB connection errors

2. **Verify Environment Variables**:
   - Make sure `MONGODB_URI` is set for **Production** environment
   - Check for typos (should be exactly `MONGODB_URI`)
   - No extra spaces or quotes in the value

3. **Test Connection String Locally**:
   - Try connecting with MongoDB Compass
   - If it works locally but not on Vercel → IP whitelist issue

## Next Steps

Once database is connected:
1. Seed demo users: `POST /api/auth/seed-demo-users`
2. Seed demo vendors: `POST /api/vendors/seed-demo`
3. Seed demo materials: `POST /api/materials/seed-demo`

See `DEMO_CREDENTIALS.md` for login credentials after seeding.

