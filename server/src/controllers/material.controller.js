import Material from '../models/Material.model.js';

/**
 * @desc    Create new material
 * @route   POST /api/materials
 * @access  Private (Admin, Supervisor)
 */
export const createMaterial = async (req, res, next) => {
  try {
    const material = await Material.create(req.body);
    res.status(201).json({
      success: true,
      data: material
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all materials
 * @route   GET /api/materials
 * @access  Private
 */
export const getMaterials = async (req, res, next) => {
  try {
    const { materialType, currentLocation, vendorId, search } = req.query;
    const filter = {};

    if (materialType) filter.materialType = materialType;
    if (currentLocation) filter.currentLocation = currentLocation;
    if (vendorId) filter.vendorId = vendorId;

    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { batchNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const materials = await Material.find(filter)
      .populate('vendorId', 'name')
      .populate('jobOrderId', 'jobOrderNumber')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single material
 * @route   GET /api/materials/:id
 * @access  Private
 */
export const getMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('vendorId')
      .populate('jobOrderId');

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    res.json({
      success: true,
      data: material
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update material
 * @route   PUT /api/materials/:id
 * @access  Private (Admin, Supervisor)
 */
export const updateMaterial = async (req, res, next) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    res.json({
      success: true,
      data: material
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete material
 * @route   DELETE /api/materials/:id
 * @access  Private (Admin)
 */
export const deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    res.json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get inventory summary
 * @route   GET /api/materials/inventory/summary
 * @access  Private
 */
export const getInventorySummary = async (req, res, next) => {
  try {
    const summary = await Material.aggregate([
      {
        $group: {
          _id: {
            materialType: '$materialType',
            currentLocation: '$currentLocation'
          },
          totalQuantity: { $sum: '$quantity' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.materialType',
          locations: {
            $push: {
              location: '$_id.currentLocation',
              quantity: '$totalQuantity',
              count: '$count'
            }
          },
          totalQuantity: { $sum: '$totalQuantity' }
        }
      }
    ]);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Seed demo materials
 * @route   POST /api/materials/seed-demo
 * @access  Private (Admin, Supervisor)
 */
export const seedDemoMaterials = async (req, res, next) => {
  try {
    // Check if materials already exist
    const existingCount = await Material.countDocuments();
    if (existingCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Materials already exist (${existingCount}). Delete existing materials first or use seed script.`
      });
    }

    const materials = [
      {
        name: 'Cotton Yarn - Premium Quality',
        materialType: 'Yarn',
        description: 'Premium quality cotton yarn for knitting',
        quantity: 1000,
        unit: 'kg',
        currentLocation: 'Internal Warehouse',
        batchNumber: 'YRN-2024-001',
        quality: 'Premium',
        color: 'White'
      },
      {
        name: 'Polyester Yarn - Standard',
        materialType: 'Yarn',
        description: 'Standard polyester yarn',
        quantity: 500,
        unit: 'kg',
        currentLocation: 'Internal Warehouse',
        batchNumber: 'YRN-2024-002',
        quality: 'Standard',
        color: 'White'
      },
      {
        name: 'Cotton Yarn - Medium Quality',
        materialType: 'Yarn',
        description: 'Medium quality cotton yarn',
        quantity: 750,
        unit: 'kg',
        currentLocation: 'Internal Warehouse',
        batchNumber: 'YRN-2024-003',
        quality: 'Medium',
        color: 'Natural'
      },
      {
        name: 'Grey Fabric - Cotton 40s',
        materialType: 'Grey Fabric',
        description: 'Grey cotton fabric 40s count',
        quantity: 2000,
        unit: 'meters',
        currentLocation: 'Internal Warehouse',
        batchNumber: 'GRY-2024-001',
        gsm: 180,
        quality: 'Standard'
      },
      {
        name: 'Grey Fabric - Cotton 30s',
        materialType: 'Grey Fabric',
        description: 'Grey cotton fabric 30s count',
        quantity: 1500,
        unit: 'meters',
        currentLocation: 'Internal Warehouse',
        batchNumber: 'GRY-2024-002',
        gsm: 200,
        quality: 'Standard'
      },
      {
        name: 'Grey Fabric - Polyester Blend',
        materialType: 'Grey Fabric',
        description: 'Grey polyester-cotton blend fabric',
        quantity: 1000,
        unit: 'meters',
        currentLocation: 'Internal Warehouse',
        batchNumber: 'GRY-2024-003',
        gsm: 160,
        quality: 'Premium'
      },
      {
        name: 'Finished Fabric - Dyed Blue',
        materialType: 'Finished Fabric',
        description: 'Blue dyed cotton fabric ready for stitching',
        quantity: 800,
        unit: 'meters',
        currentLocation: 'Internal Warehouse',
        batchNumber: 'FIN-2024-001',
        color: 'Blue',
        gsm: 180,
        quality: 'Premium'
      },
      {
        name: 'Finished Fabric - Printed Floral',
        materialType: 'Finished Fabric',
        description: 'Printed floral pattern fabric',
        quantity: 600,
        unit: 'meters',
        currentLocation: 'Internal Warehouse',
        batchNumber: 'FIN-2024-002',
        color: 'Multi-color',
        gsm: 160,
        quality: 'Standard'
      }
    ];

    const createdMaterials = await Material.insertMany(materials);

    res.status(201).json({
      success: true,
      message: `Successfully created ${createdMaterials.length} demo materials`,
      count: createdMaterials.length,
      data: createdMaterials.map(m => ({
        _id: m._id,
        name: m.name,
        materialType: m.materialType,
        quantity: m.quantity,
        unit: m.unit,
        currentLocation: m.currentLocation
      }))
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createMaterial,
  getMaterials,
  getMaterial,
  updateMaterial,
  deleteMaterial,
  getInventorySummary,
  seedDemoMaterials
};

