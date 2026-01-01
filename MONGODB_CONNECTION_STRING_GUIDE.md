# 🔗 MongoDB Atlas Connection String Guide

## Which Connection String to Use?

When MongoDB Atlas shows **3 nodes**, you have a **replica set** cluster. You should use the **standard connection string** provided by MongoDB Atlas - it automatically handles all nodes.

## Step-by-Step: Get Your Connection String

### Step 1: Go to MongoDB Atlas Dashboard
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your project
3. Click on your cluster (the one showing 3 nodes)

### Step 2: Get the Connection String
1. Click the **"Connect"** button on your cluster
2. Select **"Connect your application"** (or "Drivers")
3. Choose **"Node.js"** as the driver
4. Select version **"5.5 or later"** (or latest)

### Step 3: Copy the Connection String
You'll see a connection string that looks like:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Important**: This is the connection string you need to use!

## Step 4: Customize the Connection String

### Replace Placeholders:
1. Replace `<username>` with your MongoDB Atlas database username
2. Replace `<password>` with your MongoDB Atlas database password
3. **Add your database name** after the cluster URL:

**Format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database-name?retryWrites=true&w=majority
```

**Example:**
```
mongodb+srv://admin:MyPassword123@cluster0.abc123.mongodb.net/nool-erp?retryWrites=true&w=majority
```

### Where to add database name:
- Add it **after** `.mongodb.net/` and **before** the `?`
- Example: `...mongodb.net/nool-erp?retryWrites=true...`

## Step 5: Set in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **server project** (`nool-erp-test`)
3. Go to **Settings** → **Environment Variables**
4. Add or update `MONGODB_URI`:
   - **Key**: `MONGODB_URI`
   - **Value**: Your complete connection string (with database name)
   - **Environment**: Select **Production** (and Preview/Development if needed)
5. Click **Save**

## Why Use This Connection String?

✅ **Automatic Failover**: If one node fails, it automatically connects to another  
✅ **Load Balancing**: Distributes connections across all 3 nodes  
✅ **High Availability**: Ensures your app stays connected  
✅ **Simple**: You don't need to manage individual node URLs

## Connection String Format Explained

```
mongodb+srv://[username]:[password]@[cluster]/[database]?[options]
```

- `mongodb+srv://` - Uses DNS SRV records (handles replica sets automatically)
- `username:password` - Your MongoDB Atlas credentials
- `cluster` - Your cluster address (e.g., `cluster0.xxxxx.mongodb.net`)
- `database` - Your database name (e.g., `nool-erp`)
- `options` - Connection options like `retryWrites=true&w=majority`

## Common Mistakes to Avoid

❌ **Don't use**: Individual node URLs like `cluster0-shard-00-00.xxxxx.mongodb.net`  
✅ **Do use**: The cluster URL from "Connect your application"

❌ **Don't use**: Connection string without database name  
✅ **Do use**: Connection string with database name added

❌ **Don't use**: Old format `mongodb://` (unless you have specific requirements)  
✅ **Do use**: `mongodb+srv://` format (recommended for Atlas)

## Verify Your Connection String

After setting it in Vercel, test it:

```bash
# Test database connection
curl https://nool-erp-test.vercel.app/api/health/db
```

You should see:
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

## Troubleshooting

### Issue: "Authentication failed"
- Check username and password are correct
- Ensure no extra spaces or special characters
- Verify database user exists in MongoDB Atlas → Database Access

### Issue: "Database not found"
- Make sure you added the database name to the connection string
- The database will be created automatically on first use if it doesn't exist

### Issue: "Connection timeout"
- Check IP whitelist in MongoDB Atlas → Network Access
- Add `0.0.0.0/0` to allow all IPs (required for Vercel)

## Quick Checklist

- [ ] Got connection string from MongoDB Atlas "Connect" button
- [ ] Replaced `<username>` and `<password>` with actual credentials
- [ ] Added database name after `.mongodb.net/` (e.g., `/nool-erp`)
- [ ] Set `MONGODB_URI` in Vercel environment variables
- [ ] Selected **Production** environment in Vercel
- [ ] Redeployed Vercel project
- [ ] Tested with `/api/health/db` endpoint

---

**Remember**: The connection string from MongoDB Atlas "Connect your application" is the correct one to use - it automatically handles all 3 nodes in your replica set!

