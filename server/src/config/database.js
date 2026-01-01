import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  // Return existing connection if already connected
  if (isConnected) {
    console.log('MongoDB: Using existing connection');
    return;
  }

  // Check if connection is in progress
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    console.log('MongoDB: Already connected');
    return;
  }

  // Check if connection is in progress
  if (mongoose.connection.readyState === 2) {
    console.log('MongoDB: Connection in progress, waiting...');
    await new Promise((resolve) => {
      mongoose.connection.once('connected', resolve);
      mongoose.connection.once('error', resolve);
    });
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      return;
    }
  }

  try {
    if (!process.env.MONGODB_URI) {
      const errorMsg = 'MONGODB_URI is not defined in environment variables';
      console.error(`MongoDB Connection Error: ${errorMsg}`);
      console.error('Environment check:', {
        hasMongoUri: !!process.env.MONGODB_URI,
        nodeEnv: process.env.NODE_ENV,
        isVercel: !!(process.env.VERCEL === '1' || process.env.VERCEL_ENV || process.env.VERCEL_URL)
      });
      throw new Error(errorMsg);
    }

    // Log connection attempt (without exposing full URI)
    const uriPreview = process.env.MONGODB_URI.substring(0, 20) + '...';
    console.log(`Attempting MongoDB connection to: ${uriPreview}`);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000, // Increased to 15s for Vercel
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      connectTimeoutMS: 15000, // Connection timeout
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain at least 2 socket connections
      bufferMaxEntries: 0, // Disable mongoose buffering in serverless
      bufferCommands: false, // Disable mongoose buffering in serverless
    });
    
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        code: err.code
      });
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
      isConnected = true;
    });
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      reason: error.reason?.message || 'Unknown',
      hasMongoUri: !!process.env.MONGODB_URI,
      uriLength: process.env.MONGODB_URI?.length || 0
    });
    isConnected = false;
    // Don't exit process in serverless environment
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV || process.env.VERCEL_URL;
    if (!isVercel) {
      process.exit(1);
    }
    throw error;
  }
};

export default connectDB;

