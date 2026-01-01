# Role-Based Access Control (RBAC) - Nool ERP

## 👥 User Roles Overview

Nool ERP has **three user roles** with different levels of access:

1. **Admin** (Owner/Manager) - Full system access
2. **Supervisor** (Operations Manager) - Operational access
3. **Vendor** (External Partner) - Limited access to own data

---

## 🔐 Admin Role (Owner/Manager)

### Full System Access

**Who**: Company owner, senior management, system administrators

### Permissions:

#### ✅ User Management
- **Create Users**: Create Admin, Supervisor, or Vendor user accounts
- **View All Users**: See all users in the system
- **Edit Users**: Update any user's information
- **Delete Users**: Remove users from the system
- **Manage Roles**: Assign roles to users

#### ✅ Vendor Management
- **Create Vendors**: Add new vendor records
- **Edit Vendors**: Update vendor information
- **Delete Vendors**: Remove vendors from system
- **View All Vendors**: Access complete vendor list
- **Activate/Deactivate**: Control vendor status

#### ✅ Material Management
- **Create Materials**: Add materials to inventory
- **Edit Materials**: Update material details
- **Delete Materials**: Remove materials from system
- **View All Materials**: Access complete inventory
- **Inventory Summary**: View aggregated reports

#### ✅ Job Order Management
- **Create Job Orders**: Issue materials to vendors
- **View All Job Orders**: See all job orders across vendors
- **Edit Job Orders**: Update job order details
- **Update Status**: Change job order status
- **Receive Materials**: Mark materials as received
- **Download Challans**: Generate PDF challans
- **Delete Job Orders**: Remove job orders (if needed)

#### ✅ System Administration
- **System Settings**: Configure system parameters
- **Reports & Analytics**: Access all reports
- **Data Management**: Import/export data
- **Audit Logs**: View system activity logs

---

## 👔 Supervisor Role (Operations Manager)

### Operational Access

**Who**: Operations managers, production supervisors, floor managers

### Permissions:

#### ✅ Vendor Management
- **Create Vendors**: ✅ Can add new vendors
- **Edit Vendors**: ✅ Can update vendor information
- **Delete Vendors**: ❌ Cannot delete vendors (Admin only)
- **View All Vendors**: ✅ Can see all vendors
- **Activate/Deactivate**: ✅ Can change vendor status

#### ✅ Material Management
- **Create Materials**: ✅ Can add materials to inventory
- **Edit Materials**: ✅ Can update material details
- **Delete Materials**: ❌ Cannot delete materials (Admin only)
- **View All Materials**: ✅ Can see all materials
- **Inventory Summary**: ✅ Can view inventory reports

#### ✅ Job Order Management
- **Create Job Orders**: ✅ Can create and assign job orders
- **View All Job Orders**: ✅ Can see all job orders
- **Edit Job Orders**: ✅ Can update job order details
- **Update Status**: ✅ Can change job order status
- **Receive Materials**: ✅ Can mark materials as received
- **Download Challans**: ✅ Can generate PDF challans
- **Delete Job Orders**: ❌ Cannot delete job orders

#### ❌ Restricted Access
- **User Management**: ❌ Cannot create/edit/delete users
- **System Settings**: ❌ Cannot access system configuration
- **Delete Operations**: ❌ Cannot delete any records (safety measure)

---

## 🏭 Vendor Role (External Partner)

### Limited Access to Own Data

**Who**: External job-work vendors (Dyeing, Knitting, Printing, etc.)

### Permissions:

#### ✅ Job Order Management (Own Only)
- **View Own Job Orders**: ✅ Can see only job orders assigned to their vendor
- **Update Status**: ✅ Can update status of their job orders
- **Receive Materials**: ✅ Can mark materials as received
- **View Job Order Details**: ✅ Can see details of their job orders

#### ❌ Restricted Access
- **Create Job Orders**: ❌ Cannot create job orders
- **View Other Vendors' Orders**: ❌ Cannot see other vendors' data
- **Vendor Management**: ❌ Cannot create/edit vendors
- **Material Management**: ❌ Cannot access materials
- **User Management**: ❌ Cannot manage users
- **Inventory**: ❌ Cannot view inventory
- **Reports**: ❌ Cannot access reports

**Data Isolation**: Vendors can ONLY see data related to their vendor account.

---

## 📊 Access Control Matrix

| Feature | Admin | Supervisor | Vendor |
|---------|-------|------------|--------|
| **USER MANAGEMENT** |
| Create Users | ✅ | ❌ | ❌ |
| View All Users | ✅ | ❌ | ❌ |
| Edit Users | ✅ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ |
| **VENDOR MANAGEMENT** |
| Create Vendors | ✅ | ✅ | ❌ |
| Edit Vendors | ✅ | ✅ | ❌ |
| Delete Vendors | ✅ | ❌ | ❌ |
| View All Vendors | ✅ | ✅ | ❌ |
| **MATERIAL MANAGEMENT** |
| Create Materials | ✅ | ✅ | ❌ |
| Edit Materials | ✅ | ✅ | ❌ |
| Delete Materials | ✅ | ❌ | ❌ |
| View All Materials | ✅ | ✅ | ❌ |
| Inventory Summary | ✅ | ✅ | ❌ |
| **JOB ORDER MANAGEMENT** |
| Create Job Orders | ✅ | ✅ | ❌ |
| View All Job Orders | ✅ | ✅ | ❌ (Own only) |
| Edit Job Orders | ✅ | ✅ | ❌ |
| Update Status | ✅ | ✅ | ✅ (Own only) |
| Receive Materials | ✅ | ✅ | ✅ (Own only) |
| Download Challans | ✅ | ✅ | ✅ (Own only) |
| Delete Job Orders | ✅ | ❌ | ❌ |
| **SYSTEM ADMIN** |
| System Settings | ✅ | ❌ | ❌ |
| Reports & Analytics | ✅ | ✅ | ❌ |
| Data Import/Export | ✅ | ❌ | ❌ |
| Audit Logs | ✅ | ❌ | ❌ |

---

## 🎯 Typical Workflows

### Admin Workflow
```
1. Create Users (Admin, Supervisor, Vendor)
   ↓
2. Create Vendors
   ↓
3. Create Materials
   ↓
4. Create Job Orders
   ↓
5. Monitor All Operations
   ↓
6. Generate Reports
   ↓
7. Manage System Settings
```

### Supervisor Workflow
```
1. Create Vendors (if new vendor)
   ↓
2. Add Materials to Inventory
   ↓
3. Create Job Orders
   ↓
4. Assign to Vendors
   ↓
5. Track Job Order Status
   ↓
6. Receive Materials Back
   ↓
7. Monitor Process Loss
```

### Vendor Workflow
```
1. Login to System
   ↓
2. View Assigned Job Orders
   ↓
3. Update Job Order Status
   ↓
4. Mark Materials as Received
   ↓
5. View Process Loss Calculations
```

---

## 🔒 Security Implementation

### Backend Protection

**Middleware Used:**
- `protect`: Verifies JWT token (all authenticated routes)
- `authorize(...roles)`: Checks user role
- `vendorAccess`: Filters data for vendor users

**Example:**
```javascript
// Admin only
router.delete('/vendors/:id', authorize('Admin'), deleteVendor);

// Admin or Supervisor
router.post('/vendors', authorize('Admin', 'Supervisor'), createVendor);

// All authenticated users
router.get('/vendors', protect, getVendors);
```

### Frontend Protection

**UI Elements:**
- Buttons/forms shown based on user role
- Routes protected by role checks
- Data filtered by role on client side

**Example:**
```javascript
{(user?.role === 'Admin' || user?.role === 'Supervisor') && (
  <Link to="/vendors/create">Add Vendor</Link>
)}
```

---

## 💡 Key Differences: Admin vs Supervisor

### Admin Can:
1. ✅ **Delete Records**: Can delete vendors, materials, users
2. ✅ **User Management**: Create and manage all user accounts
3. ✅ **System Configuration**: Access system settings
4. ✅ **Full Control**: Complete system access

### Supervisor Can:
1. ✅ **Operational Tasks**: Create vendors, materials, job orders
2. ✅ **Daily Operations**: Manage day-to-day operations
3. ❌ **Cannot Delete**: Cannot delete any records (safety)
4. ❌ **No User Management**: Cannot create/manage users
5. ❌ **No System Config**: Cannot change system settings

### Why This Design?

**Supervisor Role Purpose:**
- Handles daily operations without risk of accidental deletions
- Can create and manage business data (vendors, materials, job orders)
- Cannot accidentally delete critical data
- Focused on operational tasks, not administration

**Admin Role Purpose:**
- Full system control for owners/managers
- Can manage users and system configuration
- Can delete records when needed
- Complete oversight and control

---

## 📝 Role Assignment

### Creating Users with Roles

**Admin creates users:**
```bash
POST /api/auth/register
{
  "name": "Operations Manager",
  "email": "supervisor@company.com",
  "password": "password123",
  "role": "Supervisor"  // or "Admin" or "Vendor"
}
```

**For Vendor Users:**
```bash
POST /api/auth/register
{
  "name": "Raj Kumar",
  "email": "raj@vendor.com",
  "password": "password123",
  "role": "Vendor",
  "vendorId": "<vendor_id>"  // Link to vendor account
}
```

---

## 🚨 Important Notes

1. **Supervisor Cannot Delete**: This is intentional for data safety
2. **Vendor Isolation**: Vendors can only see their own data
3. **Role Changes**: Only Admin can change user roles
4. **Default Role**: New users default to "Supervisor" if not specified
5. **Vendor Linking**: Vendor users must be linked to a vendor account

---

## 🔄 Role Upgrade Path

**Typical Progression:**
```
Vendor User → Supervisor → Admin
```

**Upgrade Process:**
1. Admin logs in
2. Navigate to Users page
3. Edit user
4. Change role
5. Save

---

**Last Updated**: January 2024  
**Version**: 1.0.0

