# Quick Start Guide - Demo Credentials

## 🚀 Setup Demo Users

### Option 1: Run Seed Script (Easiest)

```bash
cd server
npm run seed:users
```

This creates all three demo users automatically.

### Option 2: Use API Endpoint

```bash
curl -X POST http://localhost:5001/api/auth/seed-demo-users \
  -H "Content-Type: application/json"
```

---

## 🔐 Demo Credentials

### 👑 Admin User
**Email**: `admin@nool.com`  
**Password**: `admin123`  
**Access**: Full system control

### 👔 Supervisor User
**Email**: `supervisor@nool.com`  
**Password**: `supervisor123`  
**Access**: Operational access (cannot delete)

### 🏭 Vendor User
**Email**: `vendor@nool.com`  
**Password**: `vendor123`  
**Access**: View own job orders only

---

## 🧪 Testing Each Role

### Test Admin:
1. Login: `admin@nool.com` / `admin123`
2. Try: Create vendor, Delete vendor, Create user
3. Should see: All menus, all buttons, Users page

### Test Supervisor:
1. Login: `supervisor@nool.com` / `supervisor123`
2. Try: Create vendor, Try to delete vendor
3. Should see: All menus except Users, No delete buttons

### Test Vendor:
1. Login: `vendor@nool.com` / `vendor123`
2. Try: View job orders, Access vendors page
3. Should see: Only Dashboard and Job Orders in sidebar

---

**Note**: All credentials are shown on the login page for easy access!

