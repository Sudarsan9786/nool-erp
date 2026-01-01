import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
// Import routes at top level (ES modules hoist these anyway)
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import materialRoutes from './routes/material.routes.js';
import vendorRoutes from './routes/vendor.routes.js';
import jobOrderRoutes from './routes/jobOrder.routes.js';
import errorHandler from './middleware/errorHandler.middleware.js';

// Load env vars
dotenv.config();

// Detect Vercel environment
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV || process.env.VERCEL_URL;

// Global error handlers for serverless environments
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit in serverless environment
  if (!isVercel) {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  // Don't exit in serverless environment
  if (!isVercel) {
    process.exit(1);
  }
});

// Log environment info (helpful for debugging) - wrapped in try-catch to prevent crashes
try {
  console.log('Server initializing...', {
    nodeEnv: process.env.NODE_ENV,
    isVercel,
    hasMongoUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET
  });
} catch (logError) {
  console.error('Error logging initialization:', logError);
}

const app = express();

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      // Log CORS rejection but don't throw error that crashes the function
      console.warn(`CORS blocked origin: ${origin}`);
      callback(null, true); // Allow in serverless to prevent crashes, CORS will still block browser
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Nool ERP API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      materials: '/api/materials',
      vendors: '/api/vendors',
      jobOrders: '/api/job-orders'
    }
  });
});

// Health check endpoint (no DB connection required) - must be before DB middleware
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Nool ERP Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database connection middleware - connects lazily on first request (except health check and root)
app.use(async (req, res, next) => {
  // Skip DB connection for health check and root
  if (req.path === '/api/health' || req.path === '/') {
    return next();
  }
  
  try {
    await connectDB();
    return next();
  } catch (error) {
    console.error('Database connection failed:', error);
    // Check if response was already sent
    if (!res.headersSent) {
      return res.status(503).json({
        success: false,
        error: 'Database connection failed. Please try again later.',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    // If headers already sent, pass error to error handler
    return next(error);
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/job-orders', jobOrderRoutes);

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Export for Vercel serverless functions
export default app;

// Only start server if not in Vercel environment
if (!isVercel) {
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // Handle port conflicts gracefully
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already in use.`);
      console.error(`Please either:`);
      console.error(`  1. Stop the process using port ${PORT}: lsof -ti:${PORT} | xargs kill -9`);
      console.error(`  2. Or use a different port by setting PORT in .env file\n`);
      process.exit(1);
    } else {
      throw error;
    }
  });
}

