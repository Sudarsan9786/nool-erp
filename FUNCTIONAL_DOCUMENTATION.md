# Nool ERP - Functional Documentation

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Business Logic](#business-logic)
6. [Workflows](#workflows)
7. [Calculations & Formulas](#calculations--formulas)
8. [Integration Points](#integration-points)
9. [Error Handling](#error-handling)
10. [Security & Access Control](#security--access-control)

---

## 🎯 System Overview

### Purpose
Nool ERP is a Micro-ERP system designed for textile manufacturing companies in South India (Tirupur/Erode clusters) to track Work-in-Progress (WIP) fabric as it moves between internal storage and external Job-Work vendors.

### Key Features
- Material tracking (Yarn, Grey Fabric, Finished Fabric)
- Job order management
- Vendor management
- Process loss calculation
- GST calculation (CGST/SGST/IGST)
- Delivery Challan generation (Form ITC-04)
- WhatsApp notifications
- QR code tracking
- Real-time inventory management

---

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- PDFKit for PDF generation
- Twilio for WhatsApp

**Frontend:**
- React 18 with Vite
- Tailwind CSS
- Framer Motion for animations
- React Router for navigation
- i18next for localization

### Project Structure
```
nool-erp/
├── server/          # Backend API
│   ├── src/
│   │   ├── models/      # Mongoose schemas
│   │   ├── controllers/ # Route handlers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth & validation
│   │   └── utils/       # Business logic utilities
│   └── package.json
└── client/          # Frontend React app
    ├── src/
    │   ├── pages/       # Page components
    │   ├── components/  # Reusable components
    │   ├── services/    # API services
    │   └── locales/     # Translations
    └── package.json
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required)
  email: String (required, unique, lowercase)
  password: String (required, hashed)
  role: Enum ['Admin', 'Supervisor', 'Vendor']
  phone: String
  vendorId: ObjectId (ref: Vendor) // For vendor users
  isActive: Boolean (default: true)
  timestamps: true
}
```

### Material Model
```javascript
{
  materialType: Enum ['Yarn', 'Grey Fabric', 'Finished Fabric']
  name: String (required)
  description: String
  unit: Enum ['kg', 'meters', 'pieces']
  currentLocation: Enum ['Internal Warehouse', 'Vendor']
  vendorId: ObjectId (ref: Vendor) // When at vendor
  jobOrderId: ObjectId (ref: JobOrder) // Linked job order
  quantity: Number (required, min: 0)
  batchNumber: String
  color: String
  gsm: Number
  quality: String
  timestamps: true
}
```

### Vendor Model
```javascript
{
  name: String (required)
  contactPerson: String (required)
  email: String
  phone: String (required)
  whatsappNumber: String
  address: {
    street: String
    city: String
    state: String
    pincode: String
    country: String (default: 'India')
  }
  jobWorkType: Array<Enum> ['Knitting', 'Dyeing', 'Printing', 'Stitching', 'Finishing']
  gstin: String
  pan: String
  bankDetails: {
    accountNumber: String
    ifscCode: String
    bankName: String
    branch: String
  }
  isActive: Boolean (default: true)
  rating: Number (0-5)
  timestamps: true
}
```

### JobOrder Model
```javascript
{
  jobOrderNumber: String (auto-generated, unique)
  vendorId: ObjectId (ref: Vendor, required)
  jobWorkType: Enum ['Knitting', 'Dyeing', 'Printing', 'Stitching', 'Finishing']
  status: Enum ['Sent', 'In-Process', 'Partially Returned', 'Completed', 'Cancelled']
  currentLocation: Enum ['Internal Warehouse', 'Vendor']
  
  materialsIssued: [{
    materialId: ObjectId (ref: Material)
    materialType: Enum
    quantity: Number
    unit: Enum
    issuedDate: Date
  }]
  
  materialsReceived: [{
    materialId: ObjectId (ref: Material)
    materialType: Enum
    quantity: Number
    unit: Enum
    receivedDate: Date
  }]
  
  processLoss: {
    percentage: Number (0-100)
    calculated: Boolean
  }
  
  challanNumber: String
  challanDate: Date
  expectedCompletionDate: Date
  actualCompletionDate: Date
  
  gstDetails: {
    cgst: Number
    sgst: Number
    igst: Number
    taxRate: Number (default: 5)
    serviceValue: Number
  }
  
  notes: String
  createdBy: ObjectId (ref: User)
  qrCode: String (base64)
  timestamps: true
}
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user (Protected)
```

### Users
```
GET    /api/users            - Get all users (Admin only)
GET    /api/users/:id        - Get single user (Admin only)
PUT    /api/users/:id        - Update user (Admin only)
DELETE /api/users/:id        - Delete user (Admin only)
```

### Vendors
```
GET    /api/vendors          - Get all vendors
GET    /api/vendors/:id     - Get single vendor
POST   /api/vendors          - Create vendor (Admin/Supervisor)
PUT    /api/vendors/:id     - Update vendor (Admin/Supervisor)
DELETE /api/vendors/:id     - Delete vendor (Admin)
```

**Query Parameters:**
- `jobWorkType`: Filter by job work type
- `isActive`: Filter by active status
- `search`: Search by name, contact, email, phone

### Materials
```
GET    /api/materials                    - Get all materials
GET    /api/materials/:id               - Get single material
GET    /api/materials/inventory/summary - Get inventory summary
POST   /api/materials                   - Create material (Admin/Supervisor)
PUT    /api/materials/:id               - Update material (Admin/Supervisor)
DELETE /api/materials/:id               - Delete material (Admin)
```

**Query Parameters:**
- `materialType`: Filter by type
- `currentLocation`: Filter by location
- `vendorId`: Filter by vendor
- `search`: Search by name, description, batch number

### Job Orders
```
GET    /api/job-orders              - Get all job orders
GET    /api/job-orders/:id         - Get single job order
POST   /api/job-orders              - Create job order (Admin/Supervisor)
PUT    /api/job-orders/:id/receive  - Receive materials
GET    /api/job-orders/:id/challan - Download challan PDF
PUT    /api/job-orders/:id/status  - Update status (Admin/Supervisor)
```

**Query Parameters:**
- `status`: Filter by status
- `vendorId`: Filter by vendor
- `jobWorkType`: Filter by job work type

**Vendor Access:**
- Vendors can only see job orders assigned to them
- Vendors can update materials received

---

## 💼 Business Logic

### Job Order Number Generation
**Format**: `JO-YYYYMM-NNNN`
- `YYYY`: Year (e.g., 2024)
- `MM`: Month (e.g., 01)
- `NNNN`: Sequential number (e.g., 0001)

**Example**: `JO-202401-0001`

**Logic**: Generated automatically before saving if not provided.

### Challan Number Generation
**Format**: `CH-JO-YYYYMM-NNNN`
- Prefix: `CH-` (Challan)
- Follows job order number format

### Process Loss Calculation

**Formula**:
```
Process Loss (%) = ((Issued Quantity - Received Quantity) / Issued Quantity) × 100
```

**Example**:
- Issued: 100 kg Yarn
- Received: 92 kg Fabric
- Loss: ((100 - 92) / 100) × 100 = 8%

**Tolerance**: System flags if loss > 10%

**Calculation Trigger**: Automatically calculated when materials are received.

### GST Calculation

**Tax Rate**: 5% (default, as per 2026 textile norms)

**Intrastate (Same State)**:
```
CGST = (Service Value × Tax Rate) / 2
SGST = (Service Value × Tax Rate) / 2
IGST = 0
Total Tax = CGST + SGST
```

**Interstate (Different State)**:
```
CGST = 0
SGST = 0
IGST = Service Value × Tax Rate
Total Tax = IGST
```

**Determination**: Based on vendor state vs company state (default: Tamil Nadu)

### Material Location Updates

**When Job Order Created**:
- Materials moved from "Internal Warehouse" → "Vendor"
- `vendorId` set on materials
- `jobOrderId` linked to materials

**When Materials Received**:
- Materials moved from "Vendor" → "Internal Warehouse"
- `vendorId` cleared
- `jobOrderId` remains for history

### Job Order Status Flow

```
Sent → In-Process → Partially Returned → Completed
  ↓
Cancelled (at any stage)
```

**Status Updates**:
- **Sent**: Default when created
- **In-Process**: Manual update or vendor acknowledgment
- **Partially Returned**: Some materials received
- **Completed**: All materials received (automatic)
- **Cancelled**: Manual cancellation

---

## 🔄 Workflows

### Workflow 1: Complete Job Order Lifecycle

```
1. Create Vendor
   ↓
2. Add Materials to Inventory
   ↓
3. Create Job Order
   ├─ Select Vendor
   ├─ Select Job Work Type
   ├─ Add Materials to Issue
   └─ Set Expected Completion Date
   ↓
4. System Actions:
   ├─ Generate Job Order Number
   ├─ Generate Challan Number
   ├─ Generate QR Code
   ├─ Update Material Locations
   ├─ Calculate GST (if service value provided)
   └─ Send WhatsApp Notification
   ↓
5. Vendor Receives Materials
   ↓
6. Vendor Processes Materials
   ↓
7. Receive Materials Back
   ├─ Enter Received Quantities
   └─ System Calculates Process Loss
   ↓
8. Job Order Completed
   ├─ Status: Completed
   ├─ Materials Back to Internal Warehouse
   └─ Process Loss Recorded
```

### Workflow 2: Process Loss Monitoring

```
1. Materials Issued → Record Quantities
   ↓
2. Materials Received → Enter Received Quantities
   ↓
3. System Calculates:
   ├─ Material-wise Loss
   ├─ Overall Loss Percentage
   └─ Flag if Loss > 10%
   ↓
4. Review Process Loss Report
   ↓
5. Take Action if High Loss
```

### Workflow 3: Vendor Management

```
1. Create Vendor Account
   ├─ Add Contact Information
   ├─ Set Job Work Types
   └─ Add Bank & GST Details
   ↓
2. Create Vendor User (Optional)
   ├─ Link to Vendor Account
   └─ Set Role: Vendor
   ↓
3. Assign Job Orders
   ↓
4. Vendor Views & Updates Job Orders
```

---

## 🧮 Calculations & Formulas

### Process Loss Calculator

**Function**: `calculateProcessLoss(issuedQuantity, receivedQuantity, unit)`

**Returns**:
```javascript
{
  loss: Number,
  lossPercentage: Number,
  receivedQuantity: Number,
  issuedQuantity: Number,
  unit: String,
  isWithinTolerance: Boolean
}
```

**Job Order Process Loss**:
```javascript
{
  materialWiseLoss: Array,
  overallLossPercentage: Number,
  totalIssued: Number,
  totalReceived: Number,
  flagHighLoss: Boolean
}
```

### GST Calculator

**Function**: `calculateGST(serviceValue, taxRate, gstType)`

**Parameters**:
- `serviceValue`: Base service amount
- `taxRate`: Tax percentage (default: 5%)
- `gstType`: 'intrastate' or 'interstate'

**Returns**:
```javascript
{
  serviceValue: Number,
  taxRate: Number,
  cgst: Number,
  sgst: Number,
  igst: Number,
  totalTax: Number,
  totalAmount: Number,
  gstType: String
}
```

---

## 🔗 Integration Points

### WhatsApp Integration (Twilio)

**Endpoint**: Twilio WhatsApp API

**Configuration**:
- Account SID: `TWILIO_ACCOUNT_SID`
- Auth Token: `TWILIO_AUTH_TOKEN`
- Phone Number: `TWILIO_PHONE_NUMBER`

**Notifications Sent**:
1. Job Order Assignment
2. Material Receipt Confirmation

**Fallback**: Mock mode (logs to console) if Twilio not configured

### PDF Generation (PDFKit)

**Function**: `generateChallanPDF(jobOrder, vendor, materials)`

**Output**: PDF Buffer

**Content**:
- Company details
- Vendor details
- Challan number and date
- Material list with quantities
- QR code
- Terms & conditions
- Signatures

### QR Code Generation

**Library**: `qrcode`

**Data Format**:
```json
{
  "jobOrderNumber": "JO-202401-0001",
  "vendorId": "vendor_id",
  "type": "job-order",
  "timestamp": "ISO date string"
}
```

---

## ⚠️ Error Handling

### Validation Errors

**User Input Validation**:
- Email format validation
- Password strength (min 6 characters)
- Required field validation
- Enum value validation

**Business Logic Validation**:
- Vendor job work type match
- Material availability check
- Quantity validation (non-negative)

### API Error Responses

**Format**:
```json
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly message"
}
```

**Status Codes**:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

### Error Logging

- Server-side errors logged to console
- Client-side errors logged to browser console
- API errors include stack trace in development

---

## 🔒 Security & Access Control

### Authentication

**Method**: JWT (JSON Web Tokens)

**Token Structure**:
```javascript
{
  id: User._id,
  iat: Issued at timestamp,
  exp: Expiration timestamp
}
```

**Token Storage**: localStorage (frontend)

**Expiration**: 7 days (configurable)

### Authorization (RBAC)

**Roles**:
- **Admin**: Full access
- **Supervisor**: Can create/manage job orders, materials, vendors
- **Vendor**: Can only view/update their own job orders

### Protected Routes

**Middleware**: `protect` - Verifies JWT token

**Role-based**: `authorize(...roles)` - Checks user role

**Vendor-specific**: `vendorAccess` - Filters by vendor ID

### Data Isolation

**Vendor Users**:
- Can only see job orders assigned to their vendor
- Cannot access other vendors' data
- Cannot create job orders

**Supervisor/Admin**:
- Can see all job orders
- Can create and manage all resources

---

## 📊 Data Flow Diagrams

### Job Order Creation Flow

```
User Input → Validation → Create JobOrder Document
                              ↓
                    Update Material Locations
                              ↓
                    Generate QR Code
                              ↓
                    Calculate GST (if applicable)
                              ↓
                    Send WhatsApp Notification
                              ↓
                    Return Job Order with Details
```

### Material Receipt Flow

```
User Input → Validation → Update JobOrder.materialsReceived
                              ↓
                    Calculate Process Loss
                              ↓
                    Update Material Locations
                              ↓
                    Update Job Order Status
                              ↓
                    Return Updated Job Order
```

---

## 🔧 Configuration

### Environment Variables

**Backend (.env)**:
```
PORT=5001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
NODE_ENV=development
```

**Frontend**:
```
VITE_API_URL=/api (default, uses proxy)
```

---

## 📝 Notes

### Important Considerations

1. **Process Loss**: Calculated automatically, cannot be manually overridden
2. **Material Tracking**: Location updates are automatic based on job order status
3. **GST Calculation**: Based on vendor state, defaults to Tamil Nadu
4. **Job Order Numbers**: Auto-generated, cannot be changed
5. **Challan Numbers**: Auto-generated based on job order number

### Future Enhancements

- Barcode scanning for materials
- Advanced reporting and analytics
- Email notifications
- Multi-warehouse support
- Material movement history tracking
- Vendor performance metrics

---

**Document Version**: 1.0.0
**Last Updated**: January 2024
**Maintained By**: Development Team

