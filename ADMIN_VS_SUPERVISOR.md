# Admin vs Supervisor - Access Differences

## Overview

While Admin and Supervisor share many capabilities, there are **key differences** in their access levels and permissions.

---

## ✅ Shared Capabilities (Admin & Supervisor)

Both Admin and Supervisor can:
- ✅ Create Job Orders
- ✅ View all Job Orders
- ✅ Create Vendors
- ✅ Edit/Update Vendors
- ✅ View Materials
- ✅ Create/Update Materials
- ✅ View Inventory
- ✅ Track Process Loss
- ✅ Generate Reports

---

## 🔐 Admin-Only Capabilities

Only **Admin** can:
- ❌ **Delete Vendors** - Permanent removal from system
- ❌ **Delete Materials** - Permanent removal from system
- ❌ **Manage Users** - Create, edit, delete users (future feature)
- ❌ **System Settings** - Configure system-wide settings (future feature)
- ❌ **Seed Demo Data** - Create demo vendors/users (currently both can seed vendors)

---

## 📊 Visual Differences

### Dashboard
- **Admin**: "Full system access - Manage everything including users and system settings"
- **Supervisor**: "Operational management - Create job orders, manage vendors (no delete), track materials"

### Vendors Page
- **Admin**: "Full vendor management - Create, edit, and delete vendors"
- **Supervisor**: "Vendor management - Create and edit vendors (Admin can delete)"

---

## 🔒 Backend Route Protection

### Vendor Routes
```javascript
// Both can create/update
router.post('/', authorize('Admin', 'Supervisor'), createVendor);
router.put('/:id', authorize('Admin', 'Supervisor'), updateVendor);

// Only Admin can delete
router.delete('/:id', authorize('Admin'), deleteVendor);
```

### Material Routes
```javascript
// Both can create/update
router.post('/', authorize('Admin', 'Supervisor'), createMaterial);
router.put('/:id', authorize('Admin', 'Supervisor'), updateMaterial);

// Only Admin can delete
router.delete('/:id', authorize('Admin'), deleteMaterial);
```

### User Routes (Future)
```javascript
// Only Admin can manage users
router.use(authorize('Admin'));
```

---

## 🎯 Use Cases

### Admin Role
- **System Administrator**
- Full control over all data
- Can permanently delete records
- Manages user accounts
- Configures system settings

### Supervisor Role
- **Operations Manager**
- Day-to-day operational management
- Creates and manages job orders
- Can create/edit vendors but not delete
- Tracks materials and inventory
- Cannot manage users or system settings

---

## 🚀 Future Enhancements

Planned differences:
- [ ] User Management UI (Admin only)
- [ ] System Settings Page (Admin only)
- [ ] Audit Log Access (Admin only)
- [ ] Advanced Reports (Admin only)
- [ ] Bulk Operations (Admin only)

---

## 📝 Summary

| Feature | Admin | Supervisor |
|---------|-------|------------|
| Create Job Orders | ✅ | ✅ |
| Create Vendors | ✅ | ✅ |
| Edit Vendors | ✅ | ✅ |
| **Delete Vendors** | ✅ | ❌ |
| Create Materials | ✅ | ✅ |
| Edit Materials | ✅ | ✅ |
| **Delete Materials** | ✅ | ❌ |
| Manage Users | ✅ (Future) | ❌ |
| System Settings | ✅ (Future) | ❌ |

**Key Difference**: Admin has **destructive permissions** (delete) while Supervisor has **operational permissions** (create/edit only).

