# Role-Based UI & Access Control

## Overview

The Nool ERP system now implements **role-based UI** where different user roles see different screens, CTAs (Call-to-Actions), and navigation items based on their permissions.

---

## 🔐 Role Permissions

### 👑 **Admin**
- **Full System Access**
- Can create job orders
- Can manage vendors (create, edit, **delete**)
- Can manage materials (create, edit, **delete**)
- Can view all materials and inventory
- Can access all reports and analytics
- Can manage users (future feature)
- Can configure system settings (future feature)

### 👔 **Supervisor**
- **Operational Management**
- Can create job orders
- Can manage vendors (create, edit, **cannot delete**)
- Can manage materials (create, edit, **cannot delete**)
- Can view materials and inventory
- Can track all job orders
- Cannot delete vendors or materials
- Cannot manage users or system settings

### 🏭 **Vendor**
- **Job Order Tracking Only**
- Can only view **their own** job orders
- Can update job order status (receive goods, mark complete)
- Cannot create job orders
- Cannot access vendors, materials, or inventory pages
- Limited to dashboard and "My Orders" view

---

## 📱 UI Differences by Role

### **Dashboard**

#### Admin & Supervisor
- **Title**: "Dashboard"
- **Subtitle**: "Full system access - Manage everything" (Admin) / "Manage job orders and track materials" (Supervisor)
- **CTA Button**: "Create Job Order" (top right)
- **Stats Cards**:
  - Material at Vendor
  - Total Job Orders
  - Active Vendors
  - Process Loss %

#### Vendor
- **Title**: "My Dashboard"
- **Subtitle**: "Track your job orders and update status"
- **CTA Button**: "View My Orders" (top right)
- **Stats Cards**:
  - Total Job Orders (My Orders)
  - Pending Receipt
  - In Process
  - Completed

---

### **Navigation Sidebar**

#### Admin & Supervisor
```
- Dashboard
- Job Orders
- Materials
- Vendors
- Inventory
```

#### Vendor
```
- Dashboard
- My Orders
```

---

### **Job Orders Page**

#### Admin & Supervisor
- **Title**: "Job Orders"
- **Subtitle**: "Manage and track all your job orders"
- **CTA**: "Create Job Order" button visible
- **Data**: Shows ALL job orders from all vendors
- **Filters**: Full filtering options

#### Vendor
- **Title**: "My Job Orders"
- **Subtitle**: "Track your assigned job orders and update status"
- **CTA**: No "Create Job Order" button
- **Data**: Shows ONLY job orders assigned to their vendor
- **Filters**: Limited filtering (status, search)

---

### **Route Protection**

Protected routes that require Admin or Supervisor role:
- `/job-orders/create` - Create Job Order
- `/materials` - Materials Management
- `/vendors` - Vendor Management
- `/vendors/create` - Create Vendor
- `/inventory` - Inventory View

**Vendor users** attempting to access these routes will be redirected to `/dashboard`.

---

## 🎯 Key Features

### 1. **Dynamic Navigation**
- Navigation items are filtered based on user role
- Vendors see only relevant menu items

### 2. **Role-Based Data Filtering**
- Vendors automatically see only their own job orders
- API calls include `vendorId` filter for vendor users

### 3. **Conditional CTAs**
- "Create Job Order" button only visible to Admin/Supervisor
- Vendor sees "View My Orders" instead

### 4. **Route Protection**
- `RoleBasedRoute` component protects routes
- Unauthorized access redirects to dashboard

---

## 🧪 Testing Different Roles

### Login Credentials

**Admin**
- Email: `admin@nool.com`
- Password: `admin123`
- **Access**: Full system

**Supervisor**
- Email: `supervisor@nool.com`
- Password: `supervisor123`
- **Access**: Operational management

**Vendor**
- Email: `vendor@nool.com`
- Password: `vendor123`
- **Access**: Own job orders only

---

## 📋 Implementation Details

### Components Updated
1. **Dashboard.jsx** - Role-based stats and CTAs
2. **Layout.jsx** - Role-based navigation menu
3. **JobOrders.jsx** - Role-based filtering and CTAs
4. **App.jsx** - Route protection with `RoleBasedRoute`
5. **RoleBasedRoute.jsx** - New component for route protection

### Key Functions
- `authService.getStoredUser()` - Gets current user from localStorage
- `RoleBasedRoute` - Protects routes based on `allowedRoles` prop
- Dynamic API filtering based on `userRole` and `vendorId`

---

## 🚀 Future Enhancements

- [ ] Vendor can update job order status via UI
- [ ] Vendor can upload completion photos
- [ ] Role-based notifications
- [ ] Customizable dashboard widgets per role
- [ ] Role-based report generation

