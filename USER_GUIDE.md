# Nool ERP - User Guide

## 📖 Table of Contents
1. [Getting Started](#getting-started)
2. [Login & Authentication](#login--authentication)
3. [Dashboard Overview](#dashboard-overview)
4. [Managing Vendors](#managing-vendors)
5. [Managing Materials](#managing-materials)
6. [Creating Job Orders](#creating-job-orders)
7. [Tracking Job Orders](#tracking-job-orders)
8. [Receiving Materials](#receiving-materials)
9. [Inventory Management](#inventory-management)
10. [Tips & Best Practices](#tips--best-practices)

---

## 🚀 Getting Started

### First Time Setup

1. **Login**
   - Open the application at `http://localhost:3000`
   - Use default credentials:
     - Email: `admin@nool.com`
     - Password: `password123`

2. **Initial Setup Flow**
   ```
   Step 1: Create Vendors → Step 2: Add Materials → Step 3: Create Job Orders
   ```

---

## 🔐 Login & Authentication

### Login Process
1. Navigate to the login page
2. Enter your email and password
3. Click "Login" button
4. You'll be redirected to the Dashboard

### User Roles
- **Admin**: Full access to all features
- **Supervisor**: Can create job orders, manage materials and vendors
- **Vendor**: Can only view and update their assigned job orders

### Language Selection
- Click **EN** or **தமிழ்** in the top header to switch between English and Tamil

---

## 📊 Dashboard Overview

The Dashboard provides a real-time overview of your operations:

### Key Metrics Cards
- **Material at Vendor**: Total quantity of materials currently with vendors
- **Total Job Orders**: Number of active job orders
- **Active Vendors**: Count of active vendor accounts
- **Process Loss**: Average process loss percentage

### Recent Job Orders
- View the 5 most recent job orders
- Quick access to view details
- Status indicators (Sent, In-Process, Completed)

### Navigation
- **Sidebar**: Hover over collapsed sidebar to expand
- **Double-click menu icon**: Toggle sidebar collapse/expand permanently

---

## 👥 Managing Vendors

### Creating a Vendor

**Prerequisites**: Admin or Supervisor role required

1. Navigate to **Vendors** from the sidebar
2. Click **"Add Vendor"** button (if available) or use API:
   ```bash
   POST /api/vendors
   {
     "name": "ABC Dyeing Works",
     "contactPerson": "Raj Kumar",
     "phone": "+919876543210",
     "email": "contact@abcdyeing.com",
     "jobWorkType": ["Dyeing"],
     "address": {
       "city": "Tirupur",
       "state": "Tamil Nadu",
       "pincode": "641601"
     }
   }
   ```

### Vendor Information Required
- Vendor Name
- Contact Person
- Phone Number
- Email (optional)
- WhatsApp Number (for notifications)
- Job Work Types: Knitting, Dyeing, Printing, Stitching, Finishing
- Address Details
- GSTIN (optional)
- Bank Details (optional)

### Viewing Vendors
- Filter by Job Work Type
- Search by name, contact person, or phone
- View vendor details and status

---

## 📦 Managing Materials

### Adding Materials

**Prerequisites**: Admin or Supervisor role required

1. Navigate to **Materials** from the sidebar
2. Use API to add materials:
   ```bash
   POST /api/materials
   {
     "materialType": "Yarn",
     "name": "Cotton Yarn 40s",
     "quantity": 1000,
     "unit": "kg",
     "currentLocation": "Internal Warehouse",
     "batchNumber": "BATCH-001",
     "quality": "Premium"
   }
   ```

### Material Types
- **Yarn**: Measured in kg
- **Grey Fabric**: Measured in meters
- **Finished Fabric**: Measured in meters or pieces

### Material Locations
- **Internal Warehouse**: Materials in your facility
- **Vendor**: Materials sent to vendors for job work

### Viewing Materials
- Filter by Material Type
- Filter by Current Location
- Search by name, description, or batch number

---

## 📋 Creating Job Orders

### Step-by-Step Process

1. **Navigate to Job Orders**
   - Click **"Job Orders"** in the sidebar
   - Click **"Create Job Order"** button

2. **Select Vendor**
   - Choose a vendor from the dropdown
   - **Note**: If no vendors appear, create one first from the Vendors page

3. **Select Job Work Type**
   - Choose: Knitting, Dyeing, Printing, Stitching, or Finishing
   - Must match vendor's job work capabilities

4. **Add Materials**
   - Click **"Add Material"** button
   - Select material from dropdown
   - Choose material type (Yarn, Grey Fabric, Finished Fabric)
   - Enter quantity
   - Select unit (kg, meters, pieces)
   - Repeat for all materials to be issued

5. **Set Expected Completion Date** (Optional)
   - Select target completion date

6. **Enter Service Value** (Optional)
   - Enter the service charge amount
   - GST will be calculated automatically

7. **Add Notes** (Optional)
   - Add any special instructions

8. **Submit**
   - Click **"Create"** button
   - Job order will be created
   - Delivery Challan will be generated automatically
   - WhatsApp notification sent to vendor (if configured)

### What Happens After Creation?
- Job Order Number is auto-generated (e.g., `JO-202401-0001`)
- Challan Number is assigned (e.g., `CH-JO-202401-0001`)
- QR Code is generated for tracking
- Materials are marked as "At Vendor"
- Vendor receives WhatsApp notification

---

## 🔍 Tracking Job Orders

### Viewing Job Orders

1. Navigate to **Job Orders** page
2. Use filters:
   - **Search**: By job order number or vendor name
   - **Status**: Sent, In-Process, Partially Returned, Completed
   - **Job Work Type**: Filter by type

### Job Order Statuses

- **Sent**: Materials issued, waiting for vendor acknowledgment
- **In-Process**: Vendor is working on the job
- **Partially Returned**: Some materials received back
- **Completed**: All materials received, job order closed
- **Cancelled**: Job order cancelled

### Viewing Job Order Details

1. Click **"View"** on any job order
2. See complete information:
   - Vendor details
   - Materials issued
   - Materials received (if any)
   - Process loss calculation
   - GST details
   - Timeline

### Downloading Challan

1. Open job order details
2. Click **"Download Challan"** button
3. PDF will be generated with:
   - Company and vendor details
   - Material list
   - QR code for tracking
   - Form ITC-04 format

---

## 📥 Receiving Materials

### For Vendors

1. Login with vendor account
2. Navigate to **Job Orders**
3. Find your assigned job order
4. Click **"Receive Materials"** button
5. Enter received quantities for each material
6. Submit

### For Admin/Supervisor

1. Open job order details
2. Click **"Receive Materials"** button
3. Enter received quantities
4. System automatically calculates:
   - Process loss percentage
   - Material-wise loss
   - Overall loss

### Process Loss Calculation

**Example**:
- Issued: 100 kg Yarn
- Received: 92 kg Fabric
- Process Loss: 8%
- System flags if loss > 10%

### After Receiving Materials

- Materials are marked as "Internal Warehouse"
- Job order status updates automatically
- Process loss is calculated and displayed
- If all materials received → Status changes to "Completed"

---

## 📈 Inventory Management

### Viewing Inventory Summary

1. Navigate to **Inventory** page
2. View summary by:
   - Material Type (Yarn, Grey Fabric, Finished Fabric)
   - Location (Internal Warehouse, Vendor)
   - Total quantities

### Inventory Tracking

- Real-time location tracking
- Material movement history
- Stock levels at each location
- Vendor-wise material tracking

---

## 💡 Tips & Best Practices

### Best Practices

1. **Vendor Setup**
   - Create all vendors before creating job orders
   - Ensure vendor job work types are accurate
   - Add WhatsApp numbers for notifications

2. **Material Management**
   - Always add batch numbers for traceability
   - Keep materials organized by type
   - Update locations when materials move

3. **Job Order Creation**
   - Double-check quantities before submitting
   - Set realistic expected completion dates
   - Add notes for special instructions

4. **Process Loss Monitoring**
   - Review process loss regularly
   - Investigate high loss percentages (>10%)
   - Compare loss rates across vendors

5. **Regular Updates**
   - Update job order status regularly
   - Receive materials promptly when returned
   - Keep inventory updated

### Keyboard Shortcuts

- **Sidebar Toggle**: Double-click menu icon
- **Quick Search**: Use search filters on list pages
- **Navigation**: Use sidebar hover to expand quickly

### Troubleshooting

**No Vendors in Dropdown?**
- Create vendors first from Vendors page
- Ensure vendors are marked as "Active"

**Materials Not Showing?**
- Check material location filter
- Ensure materials exist in "Internal Warehouse"

**Process Loss Not Calculating?**
- Ensure materials are received
- Check that quantities are entered correctly

**WhatsApp Notifications Not Working?**
- Check Twilio configuration in backend
- Verify vendor WhatsApp numbers
- Check server logs for errors

---

## 🆘 Support

For issues or questions:
1. Check the browser console for errors
2. Review server logs
3. Contact system administrator
4. Refer to Functional Documentation for technical details

---

**Last Updated**: January 2024
**Version**: 1.0.0

