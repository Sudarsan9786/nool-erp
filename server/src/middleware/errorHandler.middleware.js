/**
 * Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Check if response has already been sent
  if (res.headersSent) {
    return next(err);
  }

  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error Handler:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = { message: 'Invalid token', statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    error = { message: 'Token expired', statusCode: 401 };
  }

  try {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  } catch (sendError) {
    console.error('Failed to send error response:', sendError);
  }
};

export default errorHandler;

