# 🔧 Database Connection Fix Guide

## Problem
Error: `{"success":false,"error":"Database connection failed. Please try again later."}`

This error occurs when the server cannot connect to MongoDB Atlas.

## Step 1: Check Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **server project** (`nool-erp-test`)
3. Go to **Settings** → **Environment Variables**
4. Verify the following variables are set:

### Required Variables:
- ✅ `MONGODB_URI` - Your MongoDB Atlas connection string
- ✅ `JWT_SECRET` - Secret key for JWT tokens (min 32 characters)
- ✅ `JWT_EXPIRE` - Token expiration (e.g., `7d`)
- ✅ `NODE_ENV` - Set to `production`
- ⏳ `CLIENT_URL` - Your frontend URL (after client deployment)

### Check MONGODB_URI Format:
Your `MONGODB_URI` should look like:
```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

**Important**: 
- Replace `username` and `password` with your MongoDB Atlas credentials
- Replace `cluster-name` with your actual cluster name
- Replace `database-name` with your database name (e.g., `nool-erp`)

## Step 2: Verify MongoDB Atlas Configuration

### 2.1 Check IP Whitelist
1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Click **Network Access** in the left sidebar
3. Click **Add IP Address**
4. **CRITICAL**: Add `0.0.0.0/0` to allow all IPs (required for Vercel)
   - Or add Vercel's IP ranges (less secure but more restrictive)
5. Click **Confirm**

**Note**: For production, you can restrict to Vercel IPs, but `0.0.0.0/0` works for testing.

### 2.2 Verify Database User
1. Go to **Database Access** in MongoDB Atlas
2. Ensure your database user exists and has proper permissions
3. Verify the username and password match your `MONGODB_URI`

### 2.3 Check Cluster Status
1. Go to **Clusters** in MongoDB Atlas
2. Ensure your cluster is **running** (not paused)
3. If paused, click **Resume** and wait for it to start

## Step 3: Test Database Connection

### 3.1 Use the Health Check Endpoint
After deploying, test the database connection:

```bash
# Basic health check (no DB)
curl https://nool-erp-test.vercel.app/api/health

# Database health check (tests DB connection)
curl https://nool-erp-test.vercel.app/api/health/db
```

The `/api/health/db` endpoint will show:
- Database connection state
- Connection error details (if any)
- Diagnostic information

### 3.2 Check Vercel Logs
1. Go to your Vercel project → **Deployments**
2. Click on the latest deployment
3. Click **Functions** tab
4. Click on a function invocation to see logs
5. Look for MongoDB connection errors

## Step 4: Common Issues & Solutions

### Issue 1: MONGODB_URI Not Set
**Symptoms**: Error shows `hasMongoUri: false` in diagnostic info

**Solution**:
1. Go to Vercel project settings → Environment Variables
2. Add `MONGODB_URI` with your connection string
3. **Important**: Make sure to set it for **Production** environment
4. Redeploy the project

### Issue 2: IP Whitelist Blocking
**Symptoms**: Connection timeout or "IP not whitelisted" error

**Solution**:
1. Go to MongoDB Atlas → Network Access
2. Add `0.0.0.0/0` to allow all IPs
3. Wait 1-2 minutes for changes to propagate
4. Try connecting again

### Issue 3: Wrong Connection String Format
**Symptoms**: Authentication failed or invalid URI

**Solution**:
1. In MongoDB Atlas, click **Connect** on your cluster
2. Select **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Replace `<dbname>` with your database name
6. Update `MONGODB_URI` in Vercel with the complete string

### Issue 4: Cluster Paused
**Symptoms**: Connection timeout or "cluster not found"

**Solution**:
1. Go to MongoDB Atlas → Clusters
2. If cluster shows "Paused", click **Resume**
3. Wait for cluster to start (2-5 minutes)
4. Try connecting again

### Issue 5: Database User Permissions
**Symptoms**: Authentication failed

**Solution**:
1. Go to MongoDB Atlas → Database Access
2. Verify user has "Atlas Admin" or appropriate permissions
3. Reset password if needed
4. Update `MONGODB_URI` with new credentials

## Step 5: Verify Fix

After making changes:

1. **Redeploy** your Vercel project (or wait for auto-redeploy)
2. Test the health endpoint:
   ```bash
   curl https://nool-erp-test.vercel.app/api/health/db
   ```
3. You should see:
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
4. Try logging in again at: `https://nool-erp-test.vercel.app/api/auth/login`

## Quick Checklist

- [ ] `MONGODB_URI` is set in Vercel environment variables
- [ ] MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- [ ] MongoDB cluster is running (not paused)
- [ ] Database user exists and has correct permissions
- [ ] Connection string format is correct
- [ ] Environment variables are set for **Production** environment
- [ ] Project has been redeployed after setting environment variables

## Still Having Issues?

1. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click latest deployment → Functions tab
   - Check logs for detailed error messages

2. **Test Connection String Locally**:
   ```bash
   # Install MongoDB shell or use MongoDB Compass
   # Test connection with your MONGODB_URI
   ```

3. **Verify Environment Variables**:
   - Make sure variables are set for the correct environment (Production)
   - Check for typos in variable names
   - Ensure no extra spaces or quotes in values

4. **Contact Support**:
   - MongoDB Atlas Support: https://www.mongodb.com/support
   - Vercel Support: https://vercel.com/support

## Diagnostic Endpoints

After deploying, use these endpoints to diagnose:

- `/api/health` - Basic server health (no DB)
- `/api/health/db` - Database connection test with diagnostics

These endpoints will help identify the exact issue with your database connection.

