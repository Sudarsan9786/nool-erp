# Vendor Management Flow - Nool ERP

## 📋 Overview

This document explains the complete flow of vendor management in the Nool ERP system, including who creates vendors, how they're created, and the complete lifecycle.

---

## 👥 Who Creates Vendors?

### Primary Users: **Admin** and **Supervisor**

**Current Implementation:**
- ✅ **Admin**: Full access to create, edit, and delete vendors
- ✅ **Supervisor**: Can create and edit vendors (but not delete)
- ❌ **Vendor Users**: Cannot create vendors (they can only view their assigned job orders)

**Rationale:**
- Vendors are external business partners
- Company (Admin/Supervisor) maintains the vendor master data
- Vendors don't self-register to maintain data quality and control

---

## 🔄 Complete Vendor Management Flow

### Step 1: Vendor Onboarding (Admin/Supervisor)

**Who**: Admin or Supervisor  
**When**: When a new vendor partnership is established  
**How**: 

#### Option A: Via UI (Recommended for regular use)
1. Navigate to **Vendors** page
2. Click **"Add Vendor"** button (to be implemented in UI)
3. Fill in vendor details form
4. Submit

#### Option B: Via API (For bulk imports or integrations)
```bash
POST /api/vendors
Authorization: Bearer <Admin/Supervisor Token>
{
  "name": "ABC Dyeing Works",
  "contactPerson": "Raj Kumar",
  "phone": "+919876543210",
  "email": "contact@abcdyeing.com",
  "whatsappNumber": "+919876543210",
  "jobWorkType": ["Dyeing"],
  "address": {
    "city": "Tirupur",
    "state": "Tamil Nadu",
    "pincode": "641601"
  },
  "gstin": "33AAAAA0000A1Z5",
  "isActive": true
}
```

### Step 2: Create Vendor User Account (Optional)

**Who**: Admin  
**When**: If vendor needs to access the system to view their job orders  
**Purpose**: Allows vendor to login and see only their assigned job orders

**How**:
```bash
POST /api/auth/register
{
  "name": "Raj Kumar",
  "email": "raj@abcdyeing.com",
  "password": "securepassword",
  "role": "Vendor",
  "vendorId": "<vendor_id_from_step_1>",
  "phone": "+919876543210"
}
```

**Important**: 
- Link the user account to vendor using `vendorId`
- Vendor users can only see job orders assigned to their vendor
- They cannot create vendors or access other vendors' data

### Step 3: Vendor Verification & Activation

**Who**: Admin/Supervisor  
**Actions**:
- Verify vendor details (GSTIN, bank details, etc.)
- Set `isActive: true` when vendor is ready to receive job orders
- Update rating based on performance

### Step 4: Assign Job Orders

**Who**: Admin/Supervisor  
**Process**:
1. Create job order
2. Select vendor from dropdown
3. System validates vendor supports the job work type
4. Job order assigned to vendor
5. Vendor receives WhatsApp notification (if configured)

### Step 5: Vendor Access (If User Account Created)

**Who**: Vendor User  
**What They Can Do**:
- ✅ View their assigned job orders
- ✅ Update job order status
- ✅ Receive materials (mark as received)
- ❌ Cannot create vendors
- ❌ Cannot see other vendors' job orders
- ❌ Cannot access materials or inventory

---

## 🎯 Recommended User Roles & Permissions

### Admin
- ✅ Create/Edit/Delete Vendors
- ✅ Create/Edit/Delete Materials
- ✅ Create/Manage Job Orders
- ✅ Create Vendor User Accounts
- ✅ View all reports and analytics
- ✅ Manage all users

### Supervisor
- ✅ Create/Edit Vendors (cannot delete)
- ✅ Create/Edit Materials
- ✅ Create/Manage Job Orders
- ✅ View reports
- ❌ Cannot delete vendors or manage users

### Vendor User
- ✅ View their own job orders
- ✅ Update job order status
- ✅ Receive materials
- ❌ Cannot create vendors
- ❌ Cannot create job orders
- ❌ Cannot access other vendors' data

---

## 📝 Vendor Creation Form Fields

### Required Fields
- **Name**: Vendor company name
- **Contact Person**: Primary contact name
- **Phone**: Contact phone number
- **Job Work Type**: At least one type (Knitting, Dyeing, Printing, Stitching, Finishing)
- **Address**: City, State, Pincode (for GST calculation)

### Optional Fields
- **Email**: For communication
- **WhatsApp Number**: For notifications (recommended)
- **GSTIN**: For GST compliance
- **PAN**: Tax identification
- **Bank Details**: For payments
- **Rating**: Performance rating (0-5)

---

## 🔐 Access Control Summary

| Action | Admin | Supervisor | Vendor User |
|--------|-------|------------|-------------|
| Create Vendor | ✅ | ✅ | ❌ |
| Edit Vendor | ✅ | ✅ | ❌ |
| Delete Vendor | ✅ | ❌ | ❌ |
| View All Vendors | ✅ | ✅ | ❌ |
| View Own Vendor | ✅ | ✅ | ✅ (if linked) |
| Create Job Order | ✅ | ✅ | ❌ |
| View Own Job Orders | ✅ | ✅ | ✅ |
| View All Job Orders | ✅ | ✅ | ❌ |

---

## 💡 Best Practices

### Vendor Onboarding
1. **Collect Complete Information**: Get all details upfront (GSTIN, bank details, etc.)
2. **Verify Credentials**: Validate GSTIN, bank account before activation
3. **Set Expectations**: Communicate job work types and capabilities clearly
4. **Create User Account**: If vendor needs system access, create user account linked to vendor

### Vendor Management
1. **Keep Data Updated**: Regularly update contact information
2. **Track Performance**: Use rating system to track vendor performance
3. **Monitor Activity**: Check vendor activity through job orders
4. **Deactivate When Needed**: Set `isActive: false` for inactive vendors

### Security
1. **Vendor Isolation**: Vendor users can only see their own data
2. **Role-Based Access**: Strict RBAC ensures data security
3. **Audit Trail**: All vendor changes are timestamped

---

## 🚀 Future Enhancements

### Potential Features:
1. **Vendor Self-Registration**: Allow vendors to request registration (pending approval)
2. **Vendor Portal**: Dedicated portal for vendors to manage their profile
3. **Vendor Performance Dashboard**: Analytics for vendor performance
4. **Bulk Import**: CSV/Excel import for multiple vendors
5. **Vendor Categories**: Categorize vendors (Premium, Standard, etc.)
6. **Contract Management**: Link contracts and agreements to vendors

---

## 📞 Support

For questions about vendor management:
- Check API documentation: `/api/vendors`
- Review user guide: `USER_GUIDE.md`
- Contact system administrator

---

**Last Updated**: January 2024  
**Version**: 1.0.0

