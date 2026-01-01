# Vendor Creation Flow - Business Logic

## 👥 Who Creates Vendors?

### Current Implementation:

**✅ Can Create Vendors:**
- **Admin** - Full access (create, edit, delete)
- **Supervisor** - Can create and edit (cannot delete)

**❌ Cannot Create Vendors:**
- **Vendor Users** - External parties, can only view their own job orders

### Business Rationale:

1. **Vendors are External Business Partners**
   - They are job-work service providers (Dyeing, Knitting, Printing, etc.)
   - Company maintains vendor master data for quality control
   - Vendors don't self-register to ensure data accuracy

2. **Data Quality & Control**
   - Admin/Supervisor verifies vendor credentials (GSTIN, bank details)
   - Ensures vendor information is accurate before activation
   - Maintains centralized vendor database

---

## 🔄 Complete Vendor Creation Flow

### Step 1: Vendor Onboarding (Admin/Supervisor)

**Scenario**: New vendor partnership established

**Process**:
1. Admin/Supervisor collects vendor information:
   - Company name, contact person
   - Phone, email, WhatsApp
   - Address (for GST calculation)
   - Job work types they support
   - GSTIN, PAN, bank details

2. Admin/Supervisor creates vendor record:
   - Via UI form (to be implemented)
   - Or via API call
   - Sets `isActive: true` when ready

3. System validates:
   - Required fields present
   - Job work types are valid
   - No duplicate vendor (by name/phone)

### Step 2: Vendor User Account (Optional)

**Who**: Admin only  
**When**: If vendor needs system access

**Process**:
1. Admin creates user account with role "Vendor"
2. Links user to vendor using `vendorId`
3. Vendor can now login and see their job orders
4. Vendor can update job order status and receive materials

**Important**: Vendor users can ONLY see job orders assigned to their vendor.

---

## 📋 Current Implementation Status

### ✅ Implemented:
- API endpoint: `POST /api/vendors` (Admin/Supervisor only)
- API endpoint: `POST /api/vendors/seed-demo` (for demo data)
- Role-based access control
- Vendor listing and filtering

### 🚧 To Be Implemented:
- **UI Form for Creating Vendors** (Admin/Supervisor)
- **Vendor Edit Form** (Admin/Supervisor)
- **Vendor Detail View**
- **Bulk Import** (CSV/Excel)

---

## 🎯 Recommended Workflow

### For Admin/Supervisor:

1. **Navigate to Vendors Page**
   - Click "Vendors" in sidebar
   - Click "Add Vendor" button

2. **Fill Vendor Form**
   - Basic Info: Name, Contact Person, Phone
   - Communication: Email, WhatsApp
   - Address: Street, City, State, Pincode
   - Job Work Types: Select one or more
   - Tax Info: GSTIN, PAN (optional)
   - Bank Details: Account, IFSC, Bank Name (optional)
   - Status: Active/Inactive

3. **Submit & Verify**
   - System validates data
   - Vendor created
   - Can now be selected in job orders

### For Demo/Testing:

- Use "Create Demo Vendors" button (creates 6 sample vendors)
- Or use seed script: `npm run seed:vendors`

---

## 🔐 Access Control Matrix

| Action | Admin | Supervisor | Vendor User |
|--------|-------|------------|-------------|
| **Create Vendor** | ✅ | ✅ | ❌ |
| **Edit Vendor** | ✅ | ✅ | ❌ |
| **Delete Vendor** | ✅ | ❌ | ❌ |
| **View Vendors** | ✅ | ✅ | ❌ |
| **View Own Vendor** | ✅ | ✅ | ✅ (if linked) |
| **Create Job Order** | ✅ | ✅ | ❌ |
| **View Own Job Orders** | ✅ | ✅ | ✅ |
| **View All Job Orders** | ✅ | ✅ | ❌ |

---

## 💡 Best Practices

1. **Complete Information**: Collect all vendor details upfront
2. **Verification**: Verify GSTIN and bank details before activation
3. **Job Work Types**: Accurately set vendor capabilities
4. **WhatsApp Number**: Add for automatic notifications
5. **User Account**: Create vendor user account if they need system access
6. **Rating**: Track vendor performance using rating field

---

## 🚀 Future Enhancements

1. **Vendor Self-Registration Request**: Vendors can request registration (pending approval)
2. **Vendor Portal**: Dedicated portal for vendors
3. **Bulk Import**: CSV/Excel import for multiple vendors
4. **Vendor Categories**: Premium, Standard, New, etc.
5. **Contract Management**: Link agreements to vendors
6. **Performance Analytics**: Track vendor performance metrics

---

**Summary**: Only Admin and Supervisor can create vendors. This ensures data quality and maintains control over vendor master data. Vendors are external parties who receive job orders but don't manage their own vendor records.

