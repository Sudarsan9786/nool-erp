import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';

// Load env vars
dotenv.config();

// Global error handlers for serverless environments
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit in serverless environment
  if (process.env.VERCEL !== '1') {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit in serverless environment
  if (process.env.VERCEL !== '1') {
    process.exit(1);
  }
});

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
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (no DB connection required) - must be before DB middleware
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Nool ERP Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database connection middleware - connects lazily on first request (except health check)
app.use(async (req, res, next) => {
  // Skip DB connection for health check
  if (req.path === '/api/health') {
    return next();
  }
  
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(503).json({
      success: false,
      error: 'Database connection failed. Please try again later.',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import materialRoutes from './routes/material.routes.js';
import vendorRoutes from './routes/vendor.routes.js';
import jobOrderRoutes from './routes/jobOrder.routes.js';
import errorHandler from './middleware/errorHandler.middleware.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/job-orders', jobOrderRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Export for Vercel serverless functions
export default app;

// Only start server if not in Vercel environment
if (process.env.VERCEL !== '1') {
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

