import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

/**
 * Protect routes - Verify JWT token
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is inactive'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

/**
 * Role-Based Access Control (RBAC)
 * @param {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - no user found'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

/**
 * Vendor-specific access - Vendors can only see their own job orders
 */
export const vendorAccess = async (req, res, next) => {
  if (req.user.role === 'Vendor') {
    // Vendors can only access their own vendor ID
    if (req.user.vendorId) {
      // If accessing a specific resource, check if it belongs to this vendor
      if (req.params.vendorId && req.params.vendorId !== req.user.vendorId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this resource'
        });
      }
      // Set vendor filter for queries
      req.vendorFilter = { vendorId: req.user.vendorId };
    } else {
      return res.status(403).json({
        success: false,
        message: 'Vendor account not properly linked'
      });
    }
  }
  next();
};

export default {
  protect,
  authorize,
  vendorAccess
};

