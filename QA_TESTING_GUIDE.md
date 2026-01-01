# 🧵 Nool ERP: QA Testing & Onboarding Guide

**Product Goal**: To eliminate "WIP Blindness" in textile manufacturing by tracking fabric movement through multi-stage job-work vendors with high precision.

---

## 📋 Table of Contents

1. [Getting Started (Setup)](#1-getting-started-setup)
2. [Core Modules to Test](#2-core-modules-to-test-high-priority)
3. [Negative Testing](#3-negative-testing-breaking-the-app)
4. [Localized Industry Checks](#4-localized-industry-checks-south-india-context)
5. [Bug Reporting Format](#5-how-to-report-bugs)
6. [Test Data Setup](#6-test-data-setup)

---

## 1. Getting Started (Setup)

### Access URL
- **Local Development**: `http://localhost:3000` (or `http://localhost:5173` if using Vite default port)
- **Production**: [Your Hosted Link]

### Database State Requirements

Before testing, ensure the database has at least:

✅ **3 Vendors** (minimum):
- 1 Knitter (e.g., "Lakshmi Knitting")
- 1 Dyer (e.g., "ABC Dyeing Works")
- 1 Stitching Unit (e.g., "Master Stitching Unit")

✅ **1 Admin User** (Master Control):
- Email: `admin@nool.com`
- Password: `admin123`

✅ **Initial Raw Material**:
- 500kg Cotton Yarn (or more for testing)

### Quick Setup Commands

```bash
# Backend Setup
cd server
npm install
npm run seed:vendors    # Create demo vendors
npm run seed:users      # Create demo users (Admin, Supervisor, Vendor)
npm run dev             # Start server on port 5001

# Frontend Setup
cd client
npm install
npm run dev             # Start frontend on port 3000
```

### Demo Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | `admin@nool.com` | `admin123` | Full system access |
| **Supervisor** | `supervisor@nool.com` | `supervisor123` | Operational management |
| **Vendor** | `vendor@nool.com` | `vendor123` | Own orders only |

---

## 2. Core Modules to Test (High Priority)

### A. Material Inward (The Source)

**Goal**: Add raw materials into the warehouse.

#### Test Scenario
1. Login as **Admin** or **Supervisor**
2. Navigate to **Materials** → **Create Material** (or use API)
3. Add the following material:
   - **Name**: Cotton Yarn - Premium Quality
   - **Material Type**: Yarn
   - **Quantity**: 1000
   - **Unit**: kg
   - **Current Location**: Internal Warehouse
   - **HSN Code**: 5205 (if field exists)

#### Checkpoints ✅

- [ ] **Stock Update**: Does the stock update immediately in the "Inventory" tab?
  - **Expected**: Yes, material appears in inventory with quantity 1000kg
  - **Location**: Dashboard → Inventory tab

- [ ] **HSN Code**: Is the HSN code correctly saved for GST compliance?
  - **Expected**: HSN code is stored and visible in material details
  - **Note**: Check if HSN field exists in Material model

- [ ] **Material Type**: Is the material type correctly categorized?
  - **Expected**: Material shows as "Yarn" type

- [ ] **Location Tracking**: Is the current location set to "Internal Warehouse"?
  - **Expected**: Yes, location is "Internal Warehouse"

#### API Test (Optional)
```bash
POST http://localhost:5001/api/materials
Headers: Authorization: Bearer <admin_token>
Body: {
  "name": "Cotton Yarn - Premium Quality",
  "materialType": "Yarn",
  "quantity": 1000,
  "unit": "kg",
  "currentLocation": "Internal Warehouse"
}
```

---

### B. Job-Work Issue (Sending to Vendor)

**Goal**: Move material from "Internal Warehouse" to "Vendor Location."

#### Test Scenario
1. Login as **Admin** or **Supervisor**
2. Navigate to **Job Orders** → **Create Job Order**
3. Select Vendor: "Lakshmi Knitting" (or any Knitting vendor)
4. Job Work Type: **Knitting**
5. Select Material: Choose 200kg of Yarn from available materials
6. Issue Date: Today's date
7. Expected Completion: 7 days from today
8. Click **"Create Job Order"**

#### Checkpoints ✅

- [ ] **Warehouse Stock Decrease**: Does the Warehouse stock decrease?
  - **Expected**: Material quantity in "Internal Warehouse" decreases by 200kg
  - **Location**: Materials page → Filter by "Internal Warehouse"
  - **Before**: 1000kg → **After**: 800kg

- [ ] **Vendor Dashboard Update**: Does the Vendor's "Pending Work" dashboard reflect the 200kg?
  - **Expected**: Vendor sees job order in their dashboard
  - **Location**: Login as Vendor → Dashboard → "My Orders"
  - **Status**: Should show "Sent" or "In-Process"

- [ ] **Material Location Change**: Does the material location change to "Vendor"?
  - **Expected**: Material's `currentLocation` changes to "Vendor"
  - **Location**: Materials page → Check material details

- [ ] **Job Order Status**: Is the job order status set to "Sent"?
  - **Expected**: Status is "Sent"
  - **Location**: Job Orders page → View job order details

#### 🎯 The "Boom" Test: PDF Challan Generation

- [ ] **Generate Challan**: Can you generate a PDF "Delivery Challan" (ITC-04)?
  - **Steps**: 
    1. Open the created Job Order
    2. Click **"Generate Challan"** or **"Download Challan"** button
    3. PDF should download automatically

- [ ] **PDF Content Verification**: Open the PDF and verify:
  - [ ] **GSTIN of Company**: Your company GSTIN is visible
  - [ ] **GSTIN of Vendor**: Vendor's GSTIN is visible
  - [ ] **Challan Number**: Unique challan number (format: CH-JO-XXXXX)
  - [ ] **Material Details**: 200kg Yarn listed correctly
  - [ ] **Date**: Challan date matches issue date
  - [ ] **Vendor Address**: Complete vendor address visible
  - [ ] **Job Order Number**: Job order number referenced

- [ ] **ITC-04 Compliance**: Does the PDF follow ITC-04 format?
  - **Expected**: Contains all required fields per GST ITC-04 form

#### API Test (Optional)
```bash
POST http://localhost:5001/api/job-orders
Headers: Authorization: Bearer <admin_token>
Body: {
  "vendorId": "<vendor_id>",
  "jobWorkType": "Knitting",
  "materialsIssued": [{
    "materialId": "<material_id>",
    "materialType": "Yarn",
    "quantity": 200,
    "unit": "kg"
  }],
  "expectedCompletionDate": "2024-01-15",
  "serviceValue": 5000,
  "taxRate": 5
}

# Generate Challan
GET http://localhost:5001/api/job-orders/<job_order_id>/challan
Headers: Authorization: Bearer <admin_token>
```

---

### C. Job-Work Receive & Process Loss (The Critical Logic)

**Goal**: Recording what comes back and tracking wastage.

#### Test Scenario
1. Login as **Admin** or **Supervisor**
2. Navigate to **Job Orders** → Find the job order created above
3. Click **"Receive Materials"** or **"Update Status"**
4. Enter Received Quantity: **190kg** (of Grey Fabric)
5. Material Type Received: **Grey Fabric**
6. Click **"Receive"** or **"Update"**

#### Checkpoints ✅

- [ ] **Process Loss Calculation**: Does the system calculate a 5% Process Loss automatically?
  - **Expected**: 
    - Issued: 200kg Yarn
    - Received: 190kg Grey Fabric
    - Process Loss: **5%** (10kg loss)
    - Formula: `((200 - 190) / 200) * 100 = 5%`
  - **Location**: Job Order Details → Process Loss section

- [ ] **Status Update**: Is the status of the original Job Order updated?
  - **Expected**: Status changes to **"Completed"** (if fully received) or **"Partially Returned"**
  - **Location**: Job Orders page → Status column

- [ ] **Inventory Update**: Does the 190kg now appear in the inventory as a new category?
  - **Expected**: 
    - New material entry: "Grey Fabric" - 190kg
    - Location: "Internal Warehouse"
    - Original Yarn: Still shows 800kg in warehouse (or adjusted)
  - **Location**: Materials page → Filter by "Grey Fabric"

- [ ] **Material Transformation**: Is the material type correctly transformed?
  - **Expected**: 
    - Input: Yarn (200kg)
    - Output: Grey Fabric (190kg)
    - System tracks this transformation

- [ ] **Process Loss Display**: Is process loss visible in dashboard/reports?
  - **Expected**: Process loss percentage shown in:
    - Job Order details
    - Dashboard stats (if implemented)
    - Reports

#### Edge Cases to Test

- [ ] **Partial Receipt**: Receive 100kg first, then 90kg later
  - **Expected**: Status = "Partially Returned" after first receipt
  - **Expected**: Status = "Completed" after full receipt

- [ ] **Zero Loss**: Receive exactly 200kg (no loss)
  - **Expected**: Process Loss = 0%

- [ ] **High Loss**: Receive 150kg (25% loss)
  - **Expected**: Process Loss = 25% (system should allow but may flag)

#### API Test (Optional)
```bash
PUT http://localhost:5001/api/job-orders/<job_order_id>/receive
Headers: Authorization: Bearer <admin_token>
Body: {
  "materialsReceived": [{
    "materialId": "<new_material_id>",
    "materialType": "Grey Fabric",
    "quantity": 190,
    "unit": "kg"
  }]
}
```

---

### D. Multi-Lingual & UI Mobile-First

**Goal**: Ensure factory workers can actually use the tool.

#### Language Testing (Tamil)

- [ ] **Language Switch**: Can you switch language to Tamil?
  - **Steps**: 
    1. Click language switcher in header (EN/தமிழ்)
    2. Select "தமிழ்"
  - **Expected**: All UI text changes to Tamil

- [ ] **Button Translation**: Are all buttons translated correctly?
  - **Check**: 
    - "Create Job Order" → "வேலை ஆணை உருவாக்க"
    - "Receive" → "பெறு"
    - "Dashboard" → "டாஷ்போர்டு"
    - "Materials" → "பொருட்கள்"
    - "Vendors" → "விற்பனையாளர்கள்"

- [ ] **Form Labels**: Are form labels translated?
  - **Check**: Material name, quantity, unit, etc.

- [ ] **Error Messages**: Are error messages translated?
  - **Check**: Validation errors, API errors

- [ ] **Data Persistence**: Does language preference persist after refresh?
  - **Expected**: Selected language remains after page reload

#### Mobile-First UI Testing

- [ ] **Mobile View**: Open the app in Chrome DevTools (Mobile View - iPhone 14)
  - **Steps**: 
    1. Open Chrome DevTools (F12)
    2. Click device toolbar icon (Ctrl+Shift+M)
    3. Select "iPhone 14" or similar
    4. Refresh page

- [ ] **QR Scan Buttons**: Are QR scan buttons readable without horizontal scrolling?
  - **Expected**: 
    - Buttons are full-width or appropriately sized
    - No horizontal scrolling required
    - Touch targets are at least 44x44px

- [ ] **Tables**: Are tables readable without horizontal scrolling?
  - **Expected**: 
    - Tables are responsive (scroll horizontally if needed)
    - Or tables stack vertically on mobile
    - Text is readable (minimum 14px font size)

- [ ] **Forms**: Are forms usable on mobile?
  - **Expected**: 
    - Input fields are full-width
    - Dropdowns are touch-friendly
    - Submit buttons are easily accessible

- [ ] **Navigation**: Is sidebar navigation mobile-friendly?
  - **Expected**: 
    - Sidebar collapses/hides on mobile
    - Hamburger menu works
    - Menu items are touch-friendly

- [ ] **Dashboard Cards**: Are dashboard stat cards responsive?
  - **Expected**: Cards stack vertically on mobile

#### Responsive Breakpoints to Test

- [ ] **Mobile**: 375px - 767px (iPhone, Android)
- [ ] **Tablet**: 768px - 1023px (iPad)
- [ ] **Desktop**: 1024px+ (Laptop, Desktop)

---

## 3. Negative Testing (Breaking the App)

### A. Over-Receiving Test

**Scenario**: Try to "Receive" 210kg of fabric when you only issued 200kg of yarn.

#### Steps
1. Create a job order with 200kg Yarn
2. Try to receive 210kg Grey Fabric
3. Submit the form

#### Expected Result ✅
- [ ] **Alert/Error**: System should throw an alert or validation error
- [ ] **Message**: "Cannot receive more than issued quantity (200kg)"
- [ ] **Prevention**: Form should not submit
- [ ] **Data Integrity**: No data should be saved

#### Actual Result
- [ ] Document what actually happens

---

### B. Incomplete Data Test

**Scenario**: Try to create a Vendor without a GST number.

#### Steps
1. Navigate to **Vendors** → **Add Vendor**
2. Fill all fields EXCEPT GSTIN
3. Try to submit

#### Expected Result ✅
- [ ] **Validation Error**: System should prevent submission
- [ ] **Message**: "GSTIN is required" or similar
- [ ] **Field Highlight**: GSTIN field should be highlighted in red
- [ ] **Form State**: Form should not submit

#### Actual Result
- [ ] Document what actually happens

#### Additional Incomplete Data Tests

- [ ] **Create Job Order without Vendor**: Should fail
- [ ] **Create Material without Quantity**: Should fail
- [ ] **Create Job Order with Negative Quantity**: Should fail
- [ ] **Create Vendor with Invalid Phone**: Should fail (if validation exists)

---

### C. Permission Check (RBAC)

**Scenario**: Log in as a "Vendor" and check access.

#### Steps
1. Logout from Admin/Supervisor account
2. Login as Vendor (`vendor@nool.com` / `vendor123`)
3. Try to access various pages

#### Expected Results ✅

- [ ] **Dashboard**: Vendor can see dashboard
  - **Expected**: Shows "My Dashboard" with vendor-specific stats
  - **Should NOT show**: Total profit, all vendors, system-wide stats

- [ ] **Job Orders**: Vendor can see job orders
  - **Expected**: Only sees THEIR OWN job orders
  - **Should NOT see**: Other vendors' job orders

- [ ] **Create Job Order**: Vendor tries to create job order
  - **Expected**: 
    - Button is hidden OR
    - Access denied error if URL is accessed directly
    - Redirect to dashboard

- [ ] **Vendors Page**: Vendor tries to access vendors page
  - **Expected**: 
    - Menu item hidden OR
    - Access denied error
    - Redirect to dashboard

- [ ] **Materials Page**: Vendor tries to access materials page
  - **Expected**: 
    - Menu item hidden OR
    - Access denied error
    - Redirect to dashboard

- [ ] **Inventory Page**: Vendor tries to access inventory page
  - **Expected**: 
    - Menu item hidden OR
    - Access denied error
    - Redirect to dashboard

- [ ] **Admin Functions**: Vendor tries to delete vendor (via API)
  - **Expected**: 403 Forbidden error
  - **Message**: "User role 'Vendor' is not authorized"

#### API Permission Tests

```bash
# Vendor trying to create job order (should fail)
POST http://localhost:5001/api/job-orders
Headers: Authorization: Bearer <vendor_token>
Body: { ... }
# Expected: 403 Forbidden

# Vendor trying to delete vendor (should fail)
DELETE http://localhost:5001/api/vendors/<vendor_id>
Headers: Authorization: Bearer <vendor_token>
# Expected: 403 Forbidden
```

---

### D. Data Validation Tests

- [ ] **Negative Quantities**: Try to enter -100kg
  - **Expected**: Validation error, form doesn't submit

- [ ] **Invalid Email**: Try to create user with "invalid-email"
  - **Expected**: Email validation error

- [ ] **Invalid Phone**: Try to enter phone without country code
  - **Expected**: Phone validation error (if validation exists)

- [ ] **Future Dates**: Try to set expected completion date in the past
  - **Expected**: Date validation error (if validation exists)

- [ ] **Duplicate Job Order Number**: Try to create job order with existing number
  - **Expected**: "Job order number already exists" error

---

## 4. Localized Industry Checks (South India Context)

### A. GST Check

**Scenario**: Verify correct GST calculation on Job-Work Service Charge.

#### Steps
1. Create a job order with:
   - Service Value: ₹10,000
   - Tax Rate: 5%
2. Check GST calculation

#### Expected Results ✅

- [ ] **GST Calculation**: System applies 5% GST on Job-Work Service Charge
  - **Expected**: 
    - Service Value: ₹10,000
    - GST (5%): ₹500
    - **Total**: ₹10,500
  - **Note**: GST should be on SERVICE CHARGE, not on fabric value

- [ ] **CGST/SGST Split**: For same-state vendors, GST is split as CGST + SGST
  - **Expected**: 
    - CGST: 2.5% = ₹250
    - SGST: 2.5% = ₹250
    - Total GST: ₹500
  - **Location**: Job Order details → GST section

- [ ] **IGST**: For inter-state vendors, IGST is applied
  - **Expected**: 
    - IGST: 5% = ₹500
    - No CGST/SGST split
  - **Location**: Job Order details → GST section

- [ ] **GST in Challan**: GST details visible in PDF challan
  - **Expected**: GSTIN, tax amount, CGST/SGST/IGST breakdown

#### API Test
```bash
# Check GST calculation in job order response
GET http://localhost:5001/api/job-orders/<job_order_id>
# Expected: gst field with CGST, SGST, IGST breakdown
```

---

### B. Date Aging Report

**Scenario**: Check if fabric with vendor for >30 days is highlighted.

#### Steps
1. Create a job order with issue date 35 days ago
2. Status should still be "Sent" or "In-Process"
3. Check aging report or dashboard

#### Expected Results ✅

- [ ] **Aging Highlight**: Fabric with vendor for >30 days is highlighted
  - **Expected**: 
    - Job order status shows warning/red indicator
    - Dashboard shows "Overdue" or "Aging" section
    - Color coding: Red for >30 days, Yellow for 15-30 days

- [ ] **Aging Calculation**: Aging is calculated correctly
  - **Expected**: 
    - Issue Date: 35 days ago
    - Aging: 35 days
    - Status: Highlighted in red

- [ ] **Aging Report**: Dedicated aging report exists (if implemented)
  - **Expected**: Report shows all overdue materials

#### Implementation Check
- [ ] Is aging report implemented?
- [ ] Is color coding implemented?
- [ ] Is notification system for overdue items implemented?

---

### C. Multi-Stage Job Work Flow

**Scenario**: Test complete textile manufacturing flow.

#### Steps
1. **Stage 1 - Knitting**:
   - Issue 200kg Yarn → Receive 190kg Grey Fabric
2. **Stage 2 - Dyeing**:
   - Issue 190kg Grey Fabric → Receive 180kg Dyed Fabric
3. **Stage 3 - Stitching**:
   - Issue 180kg Dyed Fabric → Receive 170kg Finished Fabric

#### Expected Results ✅

- [ ] **Material Tracking**: Each stage tracks material transformation
  - **Expected**: 
    - Yarn → Grey Fabric → Dyed Fabric → Finished Fabric
    - Each transformation is tracked

- [ ] **Process Loss Accumulation**: Process loss accumulates across stages
  - **Expected**: 
    - Stage 1 Loss: 5% (10kg)
    - Stage 2 Loss: 5.26% (10kg)
    - Stage 3 Loss: 5.56% (10kg)
    - Total Loss: ~15% (30kg from 200kg)

- [ ] **Vendor Assignment**: Different vendors for different stages
  - **Expected**: 
    - Knitter assigned for knitting
    - Dyer assigned for dyeing
    - Stitcher assigned for stitching

- [ ] **Status Flow**: Status updates correctly through stages
  - **Expected**: 
    - Stage 1: Completed
    - Stage 2: In-Process
    - Stage 3: Sent

---

## 5. How to Report Bugs

Please use the following format in our tracker (or Excel/Google Sheets):

### Bug Report Template

```
ID: BUG_001
Module: Job Work Issue
Severity: Critical / High / Medium / Low
Priority: P0 / P1 / P2 / P3

Steps to Reproduce:
1. Login as Admin
2. Navigate to Job Orders → Create Job Order
3. Select vendor "Lakshmi Knitting"
4. Enter quantity: 200kg
5. Click "Create"
6. Check Materials page

Expected Result:
- Material quantity in warehouse should decrease by 200kg
- Material location should change to "Vendor"

Actual Result:
- Material quantity remained unchanged
- Material location still shows "Internal Warehouse"

Environment:
- Browser: Chrome 120.0
- OS: Windows 11
- User Role: Admin
- API Response: [If applicable]

Screenshots:
[Attach screenshots if available]

Additional Notes:
- This happens only when creating job order via UI
- API call works correctly
```

### Severity Levels

- **Critical**: System crash, data loss, security breach
- **High**: Major functionality broken, cannot complete core workflow
- **Medium**: Feature partially works, workaround available
- **Low**: Minor UI issue, cosmetic problem

### Priority Levels

- **P0**: Fix immediately (blocks production)
- **P1**: Fix in current sprint
- **P2**: Fix in next sprint
- **P3**: Fix when time permits

---

## 6. Test Data Setup

### Quick Seed Scripts

```bash
# Seed Vendors
cd server
npm run seed:vendors

# Seed Users
npm run seed:users

# Seed Demo Materials (if script exists)
# npm run seed:materials
```

### Manual Test Data

#### Vendors
1. **Lakshmi Knitting**
   - Job Work Type: Knitting
   - GSTIN: 33AAAAA0000A1Z5
   - Phone: +919876543210

2. **ABC Dyeing Works**
   - Job Work Type: Dyeing
   - GSTIN: 33BBBBB0000B1Z6
   - Phone: +919876543211

3. **Master Stitching Unit**
   - Job Work Type: Stitching
   - GSTIN: 33CCCCC0000C1Z7
   - Phone: +919876543212

#### Materials
1. **Cotton Yarn - Premium**
   - Type: Yarn
   - Quantity: 1000kg
   - Location: Internal Warehouse

2. **Grey Fabric - Sample**
   - Type: Grey Fabric
   - Quantity: 500 meters
   - Location: Internal Warehouse

---

## 7. Test Checklist Summary

### Critical Path Testing

- [ ] **Material Inward**: Can add materials to warehouse
- [ ] **Job Order Creation**: Can create job order and issue materials
- [ ] **Material Location Update**: Material location changes to "Vendor"
- [ ] **Challan Generation**: Can generate PDF challan with correct GSTIN
- [ ] **Material Receipt**: Can receive materials back
- [ ] **Process Loss Calculation**: Process loss calculated correctly
- [ ] **Status Updates**: Job order status updates correctly
- [ ] **Inventory Update**: Inventory updates after receipt

### Security & Permissions

- [ ] **Vendor Access**: Vendor can only see own orders
- [ ] **Admin Access**: Admin has full access
- [ ] **Supervisor Access**: Supervisor cannot delete vendors/materials
- [ ] **API Security**: Unauthorized API calls are blocked

### UI/UX Testing

- [ ] **Mobile Responsive**: Works on mobile devices
- [ ] **Tamil Translation**: All text translated correctly
- [ ] **Form Validation**: Forms validate input correctly
- [ ] **Error Messages**: Error messages are clear and helpful

### Industry-Specific

- [ ] **GST Calculation**: GST calculated correctly (5% on service)
- [ ] **CGST/SGST Split**: Same-state GST split correctly
- [ ] **IGST**: Inter-state IGST applied correctly
- [ ] **Aging Report**: Overdue items highlighted (>30 days)

---

## 8. Known Limitations & Future Enhancements

### Current Limitations
- [ ] User management UI not yet implemented (Admin only via API)
- [ ] Aging report may not be fully implemented
- [ ] WhatsApp notifications may be mock (not real Twilio)
- [ ] QR code scanning may not be fully functional

### Future Enhancements
- [ ] Real-time notifications
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)
- [ ] Barcode/QR code scanning for materials
- [ ] Integration with accounting software

---

## 📞 Support & Questions

For questions or issues during testing:
- **Email**: [Your Support Email]
- **Slack**: [Your Slack Channel]
- **Documentation**: Check `/FUNCTIONAL_DOCUMENTATION.md`

---

**Last Updated**: [Current Date]
**Version**: 1.0.0

