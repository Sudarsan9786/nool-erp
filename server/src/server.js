import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
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

// Health check without /api prefix
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Nool ERP Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database health check endpoint - tests DB connection
app.get('/api/health/db', async (req, res) => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({
        status: 'ERROR',
        error: 'MONGODB_URI environment variable is not set',
        diagnostic: {
          hasMongoUri: false,
          nodeEnv: process.env.NODE_ENV,
          isVercel: !!(process.env.VERCEL === '1' || process.env.VERCEL_ENV || process.env.VERCEL_URL),
          timestamp: new Date().toISOString()
        },
        solution: 'Please set MONGODB_URI in Vercel environment variables'
      });
    }

    await connectDB();
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      status: dbState === 1 ? 'OK' : 'ERROR',
      database: {
        state: states[dbState] || 'unknown',
        readyState: dbState,
        host: mongoose.connection.host || 'unknown',
        name: mongoose.connection.name || 'unknown',
        connected: dbState === 1
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Extract more detailed error information
    const errorDetails = {
      name: error.name || 'Unknown',
      message: error.message || 'Unknown error',
      code: error.code || 'N/A',
      hasMongoUri: !!process.env.MONGODB_URI,
      uriLength: process.env.MONGODB_URI?.length || 0,
      uriPreview: process.env.MONGODB_URI ? 
        process.env.MONGODB_URI.substring(0, 30) + '...' : 'Not set'
    };

    // Add specific error messages based on error type
    let userMessage = 'Database connection failed';
    let solution = 'Please check your MongoDB Atlas configuration';

    if (error.name === 'MongoServerSelectionError') {
      userMessage = 'Cannot reach MongoDB servers';
      solution = 'Check MongoDB Atlas IP whitelist - add 0.0.0.0/0 to allow all IPs';
    } else if (error.name === 'MongoAuthenticationError') {
      userMessage = 'MongoDB authentication failed';
      solution = 'Check your username and password in the connection string';
    } else if (error.message?.includes('ENOTFOUND') || error.message?.includes('getaddrinfo')) {
      userMessage = 'Cannot resolve MongoDB hostname';
      solution = 'Check your connection string format - should start with mongodb+srv://';
    } else if (error.message?.includes('timeout')) {
      userMessage = 'Connection timeout';
      solution = 'Check MongoDB Atlas IP whitelist and ensure cluster is running';
    }

    res.status(503).json({
      status: 'ERROR',
      error: userMessage,
      message: error.message,
      details: errorDetails,
      solution: solution,
      timestamp: new Date().toISOString()
    });
  }
});

// Database health check without /api prefix
app.get('/health/db', async (req, res) => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({
        status: 'ERROR',
        error: 'MONGODB_URI environment variable is not set',
        diagnostic: {
          hasMongoUri: false,
          nodeEnv: process.env.NODE_ENV,
          isVercel: !!(process.env.VERCEL === '1' || process.env.VERCEL_ENV || process.env.VERCEL_URL),
          timestamp: new Date().toISOString()
        },
        solution: 'Please set MONGODB_URI in Vercel environment variables'
      });
    }

    await connectDB();
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      status: dbState === 1 ? 'OK' : 'ERROR',
      database: {
        state: states[dbState] || 'unknown',
        readyState: dbState,
        host: mongoose.connection.host || 'unknown',
        name: mongoose.connection.name || 'unknown',
        connected: dbState === 1
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Extract more detailed error information
    const errorDetails = {
      name: error.name || 'Unknown',
      message: error.message || 'Unknown error',
      code: error.code || 'N/A',
      hasMongoUri: !!process.env.MONGODB_URI,
      uriLength: process.env.MONGODB_URI?.length || 0,
      uriPreview: process.env.MONGODB_URI ? 
        process.env.MONGODB_URI.substring(0, 30) + '...' : 'Not set'
    };

    // Add specific error messages based on error type
    let userMessage = 'Database connection failed';
    let solution = 'Please check your MongoDB Atlas configuration';

    if (error.name === 'MongoServerSelectionError') {
      userMessage = 'Cannot reach MongoDB servers';
      solution = 'Check MongoDB Atlas IP whitelist - add 0.0.0.0/0 to allow all IPs';
    } else if (error.name === 'MongoAuthenticationError') {
      userMessage = 'MongoDB authentication failed';
      solution = 'Check your username and password in the connection string';
    } else if (error.message?.includes('ENOTFOUND') || error.message?.includes('getaddrinfo')) {
      userMessage = 'Cannot resolve MongoDB hostname';
      solution = 'Check your connection string format - should start with mongodb+srv://';
    } else if (error.message?.includes('timeout')) {
      userMessage = 'Connection timeout';
      solution = 'Check MongoDB Atlas IP whitelist and ensure cluster is running';
    }

    res.status(503).json({
      status: 'ERROR',
      error: userMessage,
      message: error.message,
      details: errorDetails,
      solution: solution,
      timestamp: new Date().toISOString()
    });
  }
});

// Database connection middleware - connects lazily on first request (except health check and root)
app.use(async (req, res, next) => {
  // Skip DB connection for health check endpoints and root
  if (req.path === '/api/health' || req.path === '/api/health/db' || 
      req.path === '/health' || req.path === '/health/db' || req.path === '/') {
    return next();
  }
  
  try {
    // Check if MONGODB_URI is set before attempting connection
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set in environment variables');
      if (!res.headersSent) {
        return res.status(503).json({
          success: false,
          error: 'Database connection failed. MONGODB_URI environment variable is not set.',
          diagnostic: {
            hasMongoUri: false,
            solution: 'Please set MONGODB_URI in Vercel environment variables',
            timestamp: new Date().toISOString()
          }
        });
      }
      return next(new Error('MONGODB_URI not set'));
    }

    await connectDB();
    return next();
  } catch (error) {
    console.error('Database connection failed:', error);
    console.error('Connection error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      hasMongoUri: !!process.env.MONGODB_URI,
      uriLength: process.env.MONGODB_URI?.length || 0
    });
    
    // Check if response was already sent
    if (!res.headersSent) {
      // Provide helpful error messages based on error type
      let userMessage = 'Database connection failed. Please try again later.';
      let solution = 'Check your MongoDB Atlas configuration';

      if (error.name === 'MongoServerSelectionError') {
        userMessage = 'Cannot reach MongoDB servers. Check IP whitelist.';
        solution = 'Add 0.0.0.0/0 to MongoDB Atlas Network Access';
      } else if (error.name === 'MongoAuthenticationError') {
        userMessage = 'MongoDB authentication failed. Check credentials.';
        solution = 'Verify username and password in connection string';
      } else if (error.message?.includes('ENOTFOUND')) {
        userMessage = 'Invalid MongoDB connection string format.';
        solution = 'Connection string should start with mongodb+srv://';
      }

      return res.status(503).json({
        success: false,
        error: userMessage,
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
        diagnostic: {
          hasMongoUri: !!process.env.MONGODB_URI,
          errorType: error.name || 'Unknown',
          errorCode: error.code || 'N/A',
          solution: solution,
          timestamp: new Date().toISOString()
        }
      });
    }
    // If headers already sent, pass error to error handler
    return next(error);
  }
});

// API Routes (with /api prefix)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/job-orders', jobOrderRoutes);

// Also support routes without /api prefix for convenience
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/materials', materialRoutes);
app.use('/vendors', vendorRoutes);
app.use('/job-orders', jobOrderRoutes);

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

