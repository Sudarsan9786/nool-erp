# Troubleshooting Guide

## 500 Internal Server Error on Login

### Issue
Getting `500 Internal Server Error` when trying to login at `http://localhost:3000/api/auth/login`

### Root Causes & Solutions

#### 1. Backend Server Not Running
**Symptom**: Frontend can't connect to backend API

**Solution**:
```bash
# Navigate to server directory
cd /Users/sudarsanperumalv/nool-erp/server

# Make sure .env file exists and has correct port
# PORT should be 5001 (to avoid macOS AirPlay conflict on port 5000)

# Start the server
npm run dev
```

You should see:
```
Server running in development mode on port 5001
MongoDB Connected: ...
```

#### 2. MongoDB Not Running
**Symptom**: Server starts but can't connect to database

**Solution**:
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# If not running, start MongoDB:
# macOS (Homebrew):
brew services start mongodb-community

# Or manually:
mongod --dbpath /path/to/your/data/directory
```

#### 3. User Doesn't Exist
**Symptom**: Login fails because user hasn't been created

**Solution**: Create a user first:
```bash
# Register a new admin user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@nool.com",
    "password": "password123",
    "role": "Admin"
  }'
```

#### 4. Port Conflicts
**Symptom**: Port 5000/5001 already in use

**Solution**:
```bash
# Find and kill process using the port
lsof -ti:5001 | xargs kill -9

# Or change port in .env file
# Edit server/.env and set PORT=5002
```

#### 5. macOS AirPlay Receiver on Port 5000
**Symptom**: Requests to port 5000 get intercepted by AirPlay

**Solution**: 
- Use port 5001 (already configured in .env)
- Or disable AirPlay Receiver:
  - System Settings → General → AirDrop & Handoff
  - Turn off "AirPlay Receiver"

### Quick Fix Checklist

1. ✅ **Backend Server Running?**
   ```bash
   curl http://localhost:5001/api/health
   # Should return: {"status":"OK","message":"Nool ERP Server is running"}
   ```

2. ✅ **MongoDB Running?**
   ```bash
   mongosh --eval "db.adminCommand('ping')"
   # Should return: { ok: 1 }
   ```

3. ✅ **User Created?**
   ```bash
   curl -X POST http://localhost:5001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Admin","email":"admin@nool.com","password":"password123","role":"Admin"}'
   ```

4. ✅ **Frontend Proxy Configured?**
   - Check `client/vite.config.js` - should proxy `/api` to `http://localhost:5001`

### Testing the API Directly

Test backend directly (bypassing frontend):
```bash
# Health check
curl http://localhost:5001/api/health

# Register user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@nool.com","password":"password123","role":"Admin"}'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@nool.com","password":"password123"}'
```

### Common Error Messages

- **"EADDRINUSE"**: Port already in use → Kill process or change port
- **"MongoServerError"**: MongoDB connection failed → Start MongoDB
- **"Invalid credentials"**: User doesn't exist or wrong password → Create user
- **"500 Internal Server Error"**: Check server logs for detailed error

### Server Logs

Check server terminal for detailed error messages. Common issues:
- MongoDB connection string incorrect
- Missing environment variables
- Database not accessible
- Model validation errors

