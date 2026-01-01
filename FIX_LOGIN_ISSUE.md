# Fix Login Issue - Password Hashing

## 🔧 Problem

Users created via `insertMany()` have unhashed passwords because `insertMany()` bypasses Mongoose pre-save hooks.

## ✅ Solution

Run the password fix script:

```bash
cd server
npm run fix:passwords
```

This will hash all demo user passwords properly.

## 🔄 Alternative: Delete and Recreate

If you prefer to start fresh:

1. **Delete existing users** (via MongoDB or API)
2. **Run seed script again** (now with password hashing):
   ```bash
   npm run seed:users
   ```

## 🧪 Test Login

After fixing passwords, test login:

```bash
# Admin
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nool.com","password":"admin123"}'

# Supervisor
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"supervisor@nool.com","password":"supervisor123"}'

# Vendor
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor@nool.com","password":"vendor123"}'
```

All should return success with JWT token.

