# Quick Setup Guide

## Step-by-Step Installation

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your MongoDB URI and other settings
# For local MongoDB: mongodb://localhost:27017/nool-erp
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/nool-erp

# Start development server
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to client directory (in a new terminal)
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## Creating Your First User

### Option 1: Via API (Recommended)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@nool.com",
    "password": "password123",
    "role": "Admin"
  }'
```

### Option 2: Via Frontend

1. Navigate to http://localhost:3000/login
2. Use the demo credentials shown on the login page
3. Or register a new account (if registration endpoint is exposed)

## Initial Data Setup

### Create a Vendor

```bash
curl -X POST http://localhost:5000/api/vendors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "ABC Dyeing Works",
    "contactPerson": "Raj Kumar",
    "phone": "+919876543210",
    "whatsappNumber": "+919876543210",
    "email": "contact@abcdyeing.com",
    "jobWorkType": ["Dyeing"],
    "address": {
      "street": "123 Textile Street",
      "city": "Tirupur",
      "state": "Tamil Nadu",
      "pincode": "641601"
    },
    "gstin": "33AAAAA0000A1Z5"
  }'
```

### Create a Material

```bash
curl -X POST http://localhost:5000/api/materials \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "materialType": "Yarn",
    "name": "Cotton Yarn 40s",
    "quantity": 1000,
    "unit": "kg",
    "currentLocation": "Internal Warehouse",
    "batchNumber": "BATCH-001",
    "quality": "Premium"
  }'
```

## Troubleshooting

### MongoDB Connection Issues

1. Ensure MongoDB is running:
   ```bash
   # Check MongoDB status
   mongosh --eval "db.adminCommand('ping')"
   ```

2. Verify connection string in `.env` file

3. For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use

If port 5000 or 3000 is already in use:

1. Backend: Change `PORT` in `.env` file
2. Frontend: Update `vite.config.js` server port

### CORS Issues

CORS is configured in `server/src/server.js`. If you encounter CORS errors:

1. Verify the frontend URL is allowed
2. Check `cors()` middleware configuration

### WhatsApp Notifications Not Working

WhatsApp notifications use Twilio. If not configured:

1. The system will log notifications instead of sending (mock mode)
2. To enable real notifications, configure Twilio credentials in `.env`
3. Get Twilio credentials from: https://www.twilio.com/

## Next Steps

1. Create vendors for each job work type
2. Add materials to inventory
3. Create your first job order
4. Test the complete workflow:
   - Issue materials to vendor
   - Receive materials back
   - Check process loss calculation
   - Download challan PDF

## Production Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas or production MongoDB instance
- [ ] Configure Twilio for WhatsApp notifications
- [ ] Set up SSL/HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up error logging and monitoring
- [ ] Build frontend: `cd client && npm run build`
- [ ] Serve frontend build with nginx or similar

