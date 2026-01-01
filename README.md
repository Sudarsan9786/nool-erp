# 🧵 Nool ERP - Textile Manufacturing ERP

A comprehensive Micro-ERP system for textile manufacturing, focusing on Work-in-Progress (WIP) tracking between internal storage and external job-work vendors in South India.

## ✨ Features

- **Material Management**: Track yarn, grey fabric, and finished fabric inventory
- **Job Order Management**: Issue and receive materials from vendors with process loss calculation
- **Vendor Management**: Manage vendor details, job work types, and GST compliance
- **Real-time Dashboard**: Monitor material at vendor, active vendors, and process loss
- **PDF Challan Generation**: Generate ITC-04 compliant delivery challans
- **Multi-language Support**: English and Tamil (தமிழ்)
- **Role-Based Access Control**: Admin, Supervisor, and Vendor roles
- **Dark/Light Theme**: Modern UI with theme switching
- **Mobile-First Design**: Responsive design for factory floor use

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/nool-erp.git
cd nool-erp
```

2. **Install Server Dependencies**
```bash
cd server
npm install
```

3. **Install Client Dependencies**
```bash
cd ../client
npm install
```

4. **Configure Environment Variables**

**Server** (`server/.env`):
```env
PORT=5001
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
NODE_ENV=development
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5001
```

5. **Start Development Servers**

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## 📦 Production Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed Vercel deployment instructions.

### Quick Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Production ready"
git push origin main
```

2. **Deploy Server**
   - Import `server` folder as Vercel project
   - Set environment variables
   - Deploy

3. **Deploy Client**
   - Import `client` folder as Vercel project
   - Set `VITE_API_URL` to server URL
   - Deploy

## 👥 Demo Credentials

### Admin
- Email: `admin@nool.com`
- Password: `admin123`
- Access: Full system access

### Supervisor
- Email: `supervisor@nool.com`
- Password: `supervisor123`
- Access: Operational management

### Vendor
- Email: `vendor@nool.com`
- Password: `vendor123`
- Access: View own job orders

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Axios
- i18next

### Backend
- Node.js
- Express.js
- MongoDB/Mongoose
- JWT Authentication
- PDFKit (Challan generation)
- QRCode generation

## 📁 Project Structure

```
nool-erp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── contexts/      # React contexts
│   │   └── locales/       # i18n translations
│   └── public/            # Static assets
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── scripts/       # Seed scripts
│   │   └── utils/         # Utility functions
│   └── vercel.json        # Vercel configuration
│
└── DEPLOYMENT_GUIDE.md    # Deployment instructions
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Materials
- `GET /api/materials` - Get all materials
- `POST /api/materials` - Create material
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material

### Vendors
- `GET /api/vendors` - Get all vendors
- `POST /api/vendors` - Create vendor
- `PUT /api/vendors/:id` - Update vendor

### Job Orders
- `GET /api/job-orders` - Get all job orders
- `POST /api/job-orders` - Create job order
- `GET /api/job-orders/:id` - Get job order details
- `PUT /api/job-orders/:id/receive` - Receive materials

## 🎨 Features in Detail

### Material Inward
- Add raw materials to warehouse
- Track HSN codes for GST compliance
- Real-time inventory updates

### Job-Work Issue
- Move materials to vendors
- Generate PDF delivery challan (ITC-04)
- QR code generation for tracking
- WhatsApp notifications (mock/Twilio)

### Job-Work Receive
- Record received materials
- Automatic process loss calculation
- Update job order status
- Inventory reconciliation

### Process Loss Calculator
- Automatic calculation based on issued vs received
- Percentage and absolute value tracking
- Historical data analysis

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation with Joi
- CORS protection
- Environment variable security

## 📱 Mobile Support

- Responsive design
- Touch-friendly interface
- QR code scanning support
- Mobile-first approach

## 🌐 Internationalization

- English (EN)
- Tamil (தமிழ்)
- Easy to add more languages

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please check the deployment guide or create an issue on GitHub.

---

**Built with ❤️ for Textile Manufacturing Industry**
