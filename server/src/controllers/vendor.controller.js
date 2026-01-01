import Vendor from '../models/Vendor.model.js';

/**
 * @desc    Create new vendor
 * @route   POST /api/vendors
 * @access  Private (Admin, Supervisor)
 */
export const createVendor = async (req, res, next) => {
  try {
    // Validate required fields
    if (!req.body.name || !req.body.contactPerson || !req.body.phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, contact person, and phone are required fields'
      });
    }

    if (!req.body.jobWorkType || !Array.isArray(req.body.jobWorkType) || req.body.jobWorkType.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one job work type is required'
      });
    }

    // Validate job work types
    const validTypes = ['Knitting', 'Dyeing', 'Printing', 'Stitching', 'Finishing'];
    const invalidTypes = req.body.jobWorkType.filter(type => !validTypes.includes(type));
    if (invalidTypes.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid job work types: ${invalidTypes.join(', ')}`
      });
    }

    // Check for duplicate vendor (by name or phone)
    const existingVendor = await Vendor.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${req.body.name}$`, 'i') } },
        { phone: req.body.phone }
      ]
    });

    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: 'Vendor with this name or phone number already exists'
      });
    }

    const vendor = await Vendor.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Vendor created successfully',
      data: vendor
    });
  } catch (error) {
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Vendor with this information already exists'
      });
    }
    next(error);
  }
};

/**
 * @desc    Get all vendors
 * @route   GET /api/vendors
 * @access  Private
 */
export const getVendors = async (req, res, next) => {
  try {
    const { jobWorkType, isActive, search } = req.query;
    const filter = {};

    if (jobWorkType) filter.jobWorkType = jobWorkType;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const vendors = await Vendor.find(filter).sort({ name: 1 });

    res.json({
      success: true,
      count: vendors.length,
      data: vendors
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single vendor
 * @route   GET /api/vendors/:id
 * @access  Private
 */
export const getVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create demo vendors (for development/testing)
 * @route   POST /api/vendors/seed-demo
 * @access  Private (Admin)
 */
export const seedDemoVendors = async (req, res, next) => {
  try {
    // Check if vendors already exist
    const existingCount = await Vendor.countDocuments();
    if (existingCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Vendors already exist (${existingCount}). Delete existing vendors first or use seed script.`
      });
    }

    const demoVendors = [
      {
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
        isActive: true,
        rating: 4.5
      },
      {
        name: 'XYZ Knitting Mills',
        contactPerson: 'Suresh Kumar',
        email: 'info@xyzknitting.com',
        phone: '+919876543211',
        whatsappNumber: '+919876543211',
        address: {
          street: '456 Knitting Road',
          city: 'Erode',
          state: 'Tamil Nadu',
          pincode: '638001',
          country: 'India'
        },
        jobWorkType: ['Knitting'],
        gstin: '33BBBBB0000B2Z6',
        isActive: true,
        rating: 4.2
      },
      {
        name: 'Premium Printing House',
        contactPerson: 'Lakshmi Devi',
        email: 'sales@premiumprinting.com',
        phone: '+919876543212',
        whatsappNumber: '+919876543212',
        address: {
          street: '789 Printing Avenue',
          city: 'Tirupur',
          state: 'Tamil Nadu',
          pincode: '641602',
          country: 'India'
        },
        jobWorkType: ['Printing'],
        gstin: '33CCCCC0000C3Z7',
        isActive: true,
        rating: 4.7
      },
      {
        name: 'Master Stitching Unit',
        contactPerson: 'Karthik M',
        email: 'contact@masterstitching.com',
        phone: '+919876543213',
        whatsappNumber: '+919876543213',
        address: {
          street: '321 Stitching Lane',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          pincode: '641001',
          country: 'India'
        },
        jobWorkType: ['Stitching'],
        gstin: '33DDDDD0000D4Z8',
        isActive: true,
        rating: 4.3
      },
      {
        name: 'Elite Finishing Works',
        contactPerson: 'Priya S',
        email: 'info@elitefinishing.com',
        phone: '+919876543214',
        whatsappNumber: '+919876543214',
        address: {
          street: '654 Finishing Street',
          city: 'Erode',
          state: 'Tamil Nadu',
          pincode: '638002',
          country: 'India'
        },
        jobWorkType: ['Finishing'],
        gstin: '33EEEEE0000E5Z9',
        isActive: true,
        rating: 4.6
      },
      {
        name: 'Multi-Work Textiles',
        contactPerson: 'Mohan R',
        email: 'sales@multiwork.com',
        phone: '+919876543215',
        whatsappNumber: '+919876543215',
        address: {
          street: '987 Industrial Area',
          city: 'Tirupur',
          state: 'Tamil Nadu',
          pincode: '641603',
          country: 'India'
        },
        jobWorkType: ['Dyeing', 'Printing', 'Finishing'],
        gstin: '33FFFFF0000F6Z0',
        isActive: true,
        rating: 4.8
      }
    ];

    const vendors = await Vendor.insertMany(demoVendors);

    res.status(201).json({
      success: true,
      message: `Successfully created ${vendors.length} demo vendors`,
      count: vendors.length,
      data: vendors
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update vendor
 * @route   PUT /api/vendors/:id
 * @access  Private (Admin, Supervisor)
 */
export const updateVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete vendor
 * @route   DELETE /api/vendors/:id
 * @access  Private (Admin)
 */
export const deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      message: 'Vendor deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createVendor,
  getVendors,
  getVendor,
  updateVendor,
  deleteVendor,
  seedDemoVendors
};
