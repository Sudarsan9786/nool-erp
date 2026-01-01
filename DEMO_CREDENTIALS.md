# Demo Credentials - Nool ERP

## 🔐 All Demo User Accounts

Use these credentials to test different user roles and their access levels.

---

## 👑 Admin User (Owner/Manager)

**Email**: `admin@nool.com`  
**Password**: `admin123`  
**Role**: Admin

### What Admin Can Do:
- ✅ **Full System Access**
- ✅ Create/Edit/Delete Users
- ✅ Create/Edit/Delete Vendors
- ✅ Create/Edit/Delete Materials
- ✅ Create/Edit/Delete Job Orders
- ✅ Access all reports and analytics
- ✅ System configuration

### Test Scenarios:
1. Login as Admin
2. Go to Vendors → Create a new vendor
3. Go to Materials → Add materials
4. Go to Job Orders → Create job order
5. Try deleting a vendor (only Admin can do this)
6. Check Users page (only Admin can access)

---

## 👔 Supervisor User (Operations Manager)

**Email**: `supervisor@nool.com`  
**Password**: `supervisor123`  
**Role**: Supervisor

### What Supervisor Can Do:
- ✅ **Operational Access**
- ✅ Create/Edit Vendors (cannot delete)
- ✅ Create/Edit Materials (cannot delete)
- ✅ Create/Edit Job Orders (cannot delete)
- ✅ View all vendors, materials, job orders
- ✅ Receive materials
- ✅ Download challans
- ❌ Cannot delete anything
- ❌ Cannot manage users
- ❌ Cannot access system settings

### Test Scenarios:
1. Login as Supervisor
2. Go to Vendors → Create a new vendor ✅
3. Try to delete a vendor ❌ (should fail)
4. Go to Materials → Add materials ✅
5. Go to Job Orders → Create job order ✅
6. Try to access Users page ❌ (should not be visible)
7. Notice "Delete" buttons are hidden

---

## 🏭 Vendor User (External Partner)

**Email**: `vendor@nool.com`  
**Password**: `vendor123`  
**Role**: Vendor  
**Linked Vendor**: ABC Dyeing Works

### What Vendor Can Do:
- ✅ **Limited Access - Own Data Only**
- ✅ View own job orders (assigned to ABC Dyeing Works)
- ✅ Update job order status
- ✅ Receive materials (mark as received)
- ✅ Download challans for own job orders
- ❌ Cannot create job orders
- ❌ Cannot see other vendors' job orders
- ❌ Cannot access vendors page
- ❌ Cannot access materials page
- ❌ Cannot access inventory

### Test Scenarios:
1. Login as Vendor
2. Go to Dashboard → See only own job orders
3. Go to Job Orders → See only job orders for ABC Dyeing Works
4. Try to access Vendors page ❌ (should not be visible)
5. Try to access Materials page ❌ (should not be visible)
6. Try to create a job order ❌ (button should not appear)
7. Notice sidebar only shows: Dashboard, Job Orders

---

## 🚀 Quick Setup

### Option 1: Run Seed Script (Recommended)

```bash
cd server
npm run seed:users
```

This will create all three demo users automatically.

### Option 2: Create via API

**Create Admin:**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@nool.com",
    "password": "admin123",
    "role": "Admin"
  }'
```

**Create Supervisor:**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Supervisor User",
    "email": "supervisor@nool.com",
    "password": "supervisor123",
    "role": "Supervisor"
  }'
```

**Create Vendor (requires vendor ID):**
```bash
# First, get vendor ID from vendors list
# Then create vendor user:
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vendor User",
    "email": "vendor@nool.com",
    "password": "vendor123",
    "role": "Vendor",
    "vendorId": "<vendor_id_here>"
  }'
```

---

## 📋 Testing Checklist

### Admin Testing:
- [ ] Login with admin@nool.com / admin123
- [ ] Create a new vendor
- [ ] Delete a vendor (should work)
- [ ] Create a new user
- [ ] Access Users page
- [ ] Create materials
- [ ] Delete materials (should work)
- [ ] Create job orders
- [ ] Delete job orders (should work)

### Supervisor Testing:
- [ ] Login with supervisor@nool.com / supervisor123
- [ ] Create a new vendor (should work)
- [ ] Try to delete a vendor (should fail or button hidden)
- [ ] Create materials (should work)
- [ ] Try to delete materials (should fail or button hidden)
- [ ] Create job orders (should work)
- [ ] Try to access Users page (should not be visible)
- [ ] Notice "Delete" buttons are not available

### Vendor Testing:
- [ ] Login with vendor@nool.com / vendor123
- [ ] View Dashboard (should show only own job orders)
- [ ] View Job Orders (should show only ABC Dyeing Works orders)
- [ ] Try to access Vendors page (should not be visible)
- [ ] Try to access Materials page (should not be visible)
- [ ] Try to create job order (button should not appear)
- [ ] Update job order status (should work for own orders)
- [ ] Receive materials (should work for own orders)

---

## 🔍 What to Observe

### Admin Experience:
- Full navigation menu
- All buttons visible (Create, Edit, Delete)
- Can access Users page
- Can delete any record

### Supervisor Experience:
- Full navigation menu (except Users)
- Create/Edit buttons visible
- Delete buttons hidden or disabled
- Cannot access Users page
- Cannot delete records

### Vendor Experience:
- Limited navigation (Dashboard, Job Orders only)
- No Create buttons
- Can only see own job orders
- Cannot access Vendors, Materials, Inventory pages
- Data isolation enforced

---

## 🎯 Key Differences Summary

| Feature | Admin | Supervisor | Vendor |
|---------|-------|------------|--------|
| **Navigation Items** | All | All (except Users) | Dashboard, Job Orders only |
| **Create Vendors** | ✅ | ✅ | ❌ |
| **Delete Vendors** | ✅ | ❌ | ❌ |
| **Create Materials** | ✅ | ✅ | ❌ |
| **Delete Materials** | ✅ | ❌ | ❌ |
| **Create Job Orders** | ✅ | ✅ | ❌ |
| **View All Job Orders** | ✅ | ✅ | ❌ (Own only) |
| **Delete Job Orders** | ✅ | ❌ | ❌ |
| **User Management** | ✅ | ❌ | ❌ |
| **System Settings** | ✅ | ❌ | ❌ |

---

## 💡 Tips for Testing

1. **Use Incognito/Private Windows**: Test each role in separate browser windows
2. **Clear Cache**: If switching roles, clear localStorage or use different browsers
3. **Check Console**: Look for 403 errors when trying unauthorized actions
4. **Observe UI**: Notice which buttons/menus appear/disappear for each role
5. **Test Edge Cases**: Try accessing URLs directly (e.g., `/users`) as Supervisor/Vendor

---

**Last Updated**: January 2024  
**Version**: 1.0.0

