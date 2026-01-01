import User from '../models/User.model.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, vendorId } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Validate role
    const validRoles = ['Admin', 'Supervisor', 'Vendor'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      });
    }

    // Validate vendor ID for vendor users
    if (role === 'Vendor' && !vendorId) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID is required for vendor users'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Verify vendor exists if vendorId provided
    if (vendorId) {
      const Vendor = (await import('../models/Vendor.model.js')).default;
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: 'Vendor not found'
        });
      }
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role: role || 'Supervisor',
      phone,
      vendorId: role === 'Vendor' ? vendorId : null
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorId: user.vendorId,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check for user (email is stored lowercase in DB)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact administrator.'
      });
    }

    // For vendor users, verify vendor link
    if (user.role === 'Vendor' && !user.vendorId) {
      return res.status(403).json({
        success: false,
        message: 'Vendor account is not properly linked. Please contact administrator.'
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorId: user.vendorId,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('vendorId');
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fix demo user passwords (for development/testing)
 * @route   POST /api/auth/fix-passwords
 * @access  Public (for demo purposes)
 */
export const fixDemoPasswords = async (req, res, next) => {
  try {
    const demoUsers = [
      { email: 'admin@nool.com', password: 'admin123' },
      { email: 'supervisor@nool.com', password: 'supervisor123' },
      { email: 'vendor@nool.com', password: 'vendor123' }
    ];

    const results = [];

    for (const demoUser of demoUsers) {
      const user = await User.findOne({ email: demoUser.email });
      if (user) {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(demoUser.password, salt);
        
        // Update password directly (bypassing pre-save hook)
        await User.updateOne(
          { _id: user._id },
          { $set: { password: hashedPassword } }
        );
        
        results.push({ email: demoUser.email, status: 'fixed' });
      } else {
        results.push({ email: demoUser.email, status: 'not found' });
      }
    }

    res.json({
      success: true,
      message: 'Passwords fixed successfully',
      results: results
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create demo users (for development/testing)
 * @route   POST /api/auth/seed-demo-users
 * @access  Public (for demo purposes)
 */
export const seedDemoUsers = async (req, res, next) => {
  try {
    // Check which users already exist
    const existingUsers = await User.find({ email: { $in: ['admin@nool.com', 'supervisor@nool.com', 'vendor@nool.com'] } });
    const existingEmails = existingUsers.map(u => u.email);
    
    if (existingEmails.length === 3) {
      return res.status(400).json({
        success: false,
        message: 'All demo users already exist',
        existing: existingEmails
      });
    }

    // Get or create demo vendor for vendor user
    const Vendor = (await import('../models/Vendor.model.js')).default;
    let demoVendor = await Vendor.findOne({ name: 'ABC Dyeing Works' });
    if (!demoVendor) {
      demoVendor = await Vendor.create({
        name: 'ABC Dyeing Works',
        contactPerson: 'Raj Kumar',
        email: 'contact@abcdyeing.com',
        phone: '+919876543210',
        whatsappNumber: '+919876543210',
        address: {
          street: '123 Textile Street',
          city: 'Tirupur',
          state: 'Tamil Nadu',
          pincode: '641601',
          country: 'India'
        },
        jobWorkType: ['Dyeing'],
        gstin: '33AAAAA0000A1Z5',
        isActive: true
      });
    }

    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@nool.com',
        password: 'admin123',
        role: 'Admin',
        phone: '+919876543200'
      },
      {
        name: 'Supervisor User',
        email: 'supervisor@nool.com',
        password: 'supervisor123',
        role: 'Supervisor',
        phone: '+919876543201'
      },
      {
        name: 'Vendor User',
        email: 'vendor@nool.com',
        password: 'vendor123',
        role: 'Vendor',
        phone: '+919876543202',
        vendorId: demoVendor._id
      }
    ];

    // Filter out users that already exist
    const usersToCreate = demoUsers.filter(user => !existingEmails.includes(user.email));
    
    if (usersToCreate.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'All demo users already exist',
        existing: existingEmails
      });
    }

    // Hash passwords before creating (insertMany bypasses pre-save hooks)
    const usersWithHashedPasswords = await Promise.all(
      usersToCreate.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );

    const users = await User.insertMany(usersWithHashedPasswords);

    // Get all demo users (existing + newly created)
    const allDemoUsers = await User.find({ email: { $in: ['admin@nool.com', 'supervisor@nool.com', 'vendor@nool.com'] } });

    res.status(201).json({
      success: true,
      message: `Successfully created ${users.length} demo user(s)`,
      created: users.length,
      total: allDemoUsers.length,
      credentials: {
        admin: { email: 'admin@nool.com', password: 'admin123', exists: existingEmails.includes('admin@nool.com') },
        supervisor: { email: 'supervisor@nool.com', password: 'supervisor123', exists: existingEmails.includes('supervisor@nool.com') },
        vendor: { email: 'vendor@nool.com', password: 'vendor123', exists: existingEmails.includes('vendor@nool.com') }
      },
      createdUsers: users.map(u => ({ email: u.email, role: u.role })),
      existingUsers: existingUsers.map(u => ({ email: u.email, role: u.role }))
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  getMe,
  seedDemoUsers,
  fixDemoPasswords
};
