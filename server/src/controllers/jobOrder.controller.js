import JobOrder from '../models/JobOrder.model.js';
import Material from '../models/Material.model.js';
import Vendor from '../models/Vendor.model.js';
import { calculateJobOrderProcessLoss } from '../utils/processLossCalculator.js';
import { calculateJobOrderGST } from '../utils/gstCalculator.js';
import { generateChallanPDF } from '../utils/challanGenerator.js';
import { sendJobOrderNotification } from '../utils/whatsappService.js';
import QRCode from 'qrcode';

/**
 * @desc    Create new job order
 * @route   POST /api/job-orders
 * @access  Private (Admin, Supervisor)
 */
export const createJobOrder = async (req, res, next) => {
  try {
    const {
      vendorId,
      jobWorkType,
      materialsIssued,
      expectedCompletionDate,
      serviceValue,
      taxRate,
      notes
    } = req.body;

    // Verify vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Verify vendor supports this job work type
    if (!vendor.jobWorkType.includes(jobWorkType)) {
      return res.status(400).json({
        success: false,
        message: `Vendor does not support ${jobWorkType} job work`
      });
    }

    // Validate materials exist and have sufficient quantity
    for (const material of materialsIssued) {
      const materialDoc = await Material.findById(material.materialId);
      if (!materialDoc) {
        return res.status(404).json({
          success: false,
          message: `Material with ID ${material.materialId} not found`
        });
      }
      if (materialDoc.currentLocation !== 'Internal Warehouse') {
        return res.status(400).json({
          success: false,
          message: `Material ${materialDoc.name} is not in Internal Warehouse`
        });
      }
      if (materialDoc.quantity < parseFloat(material.quantity)) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for ${materialDoc.name}. Available: ${materialDoc.quantity} ${materialDoc.unit}, Requested: ${material.quantity} ${material.unit}`
        });
      }
    }

    // Generate job order number before creation
    const count = await JobOrder.countDocuments();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const jobOrderNumber = `JO-${year}${month}-${String(count + 1).padStart(4, '0')}`;

    // Create job order
    const jobOrder = await JobOrder.create({
      jobOrderNumber, // Explicitly set job order number
      vendorId,
      jobWorkType,
      materialsIssued: materialsIssued.map(m => ({
        ...m,
        quantity: parseFloat(m.quantity) // Ensure quantity is a number
      })),
      expectedCompletionDate: expectedCompletionDate || undefined,
      notes,
      createdBy: req.user._id,
      challanDate: new Date()
    });

    // Update material locations and quantities after job order creation
    for (const material of materialsIssued) {
      const materialDoc = await Material.findById(material.materialId);
      const issuedQuantity = parseFloat(material.quantity);
      
      // Update material location and link to job order
      await Material.findByIdAndUpdate(material.materialId, {
        currentLocation: 'Vendor',
        vendorId: vendorId,
        jobOrderId: jobOrder._id,
        quantity: materialDoc.quantity - issuedQuantity // Reduce quantity
      });
    }

    // Materials already updated above

    // Generate QR code
    const qrData = JSON.stringify({
      jobOrderNumber: jobOrder.jobOrderNumber,
      vendorId: vendorId.toString(),
      type: 'job-order'
    });
    const qrCode = await QRCode.toDataURL(qrData);
    jobOrder.qrCode = qrCode;
    await jobOrder.save();

    // Calculate GST
    if (serviceValue) {
      const gstDetails = calculateJobOrderGST(jobOrder, serviceValue, taxRate);
      jobOrder.gstDetails = gstDetails;
      await jobOrder.save();
    }

    // Generate challan number
    jobOrder.challanNumber = `CH-${jobOrder.jobOrderNumber}`;
    await jobOrder.save();

    // Send WhatsApp notification
    const whatsappNumber = vendor.whatsappNumber || vendor.phone;
    if (whatsappNumber) {
      await sendJobOrderNotification(whatsappNumber, jobOrder, vendor);
    }

    const populatedJobOrder = await JobOrder.findById(jobOrder._id)
      .populate('vendorId')
      .populate('materialsIssued.materialId')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedJobOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all job orders
 * @route   GET /api/job-orders
 * @access  Private
 */
export const getJobOrders = async (req, res, next) => {
  try {
    const { status, vendorId, jobWorkType } = req.query;
    const filter = {};

    // Vendor filter - vendors can only see their own orders
    if (req.user.role === 'Vendor' && req.user.vendorId) {
      filter.vendorId = req.user.vendorId;
    } else if (vendorId) {
      filter.vendorId = vendorId;
    }

    if (status) filter.status = status;
    if (jobWorkType) filter.jobWorkType = jobWorkType;

    const jobOrders = await JobOrder.find(filter)
      .populate('vendorId')
      .populate('materialsIssued.materialId')
      .populate('materialsReceived.materialId')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobOrders.length,
      data: jobOrders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single job order
 * @route   GET /api/job-orders/:id
 * @access  Private
 */
export const getJobOrder = async (req, res, next) => {
  try {
    const jobOrder = await JobOrder.findById(req.params.id)
      .populate('vendorId')
      .populate('materialsIssued.materialId')
      .populate('materialsReceived.materialId')
      .populate('createdBy', 'name email');

    if (!jobOrder) {
      return res.status(404).json({
        success: false,
        message: 'Job order not found'
      });
    }

    // Check vendor access
    if (req.user.role === 'Vendor' && req.user.vendorId) {
      if (jobOrder.vendorId._id.toString() !== req.user.vendorId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this job order'
        });
      }
    }

    res.json({
      success: true,
      data: jobOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update job order (receive materials)
 * @route   PUT /api/job-orders/:id/receive
 * @access  Private
 */
export const receiveMaterials = async (req, res, next) => {
  try {
    const { materialsReceived } = req.body;
    const jobOrder = await JobOrder.findById(req.params.id);

    if (!jobOrder) {
      return res.status(404).json({
        success: false,
        message: 'Job order not found'
      });
    }

    // Check vendor access
    if (req.user.role === 'Vendor' && req.user.vendorId) {
      if (jobOrder.vendorId.toString() !== req.user.vendorId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this job order'
        });
      }
    }

    // Add received materials
    jobOrder.materialsReceived.push(...materialsReceived);

    // Update material locations
    for (const material of materialsReceived) {
      await Material.findByIdAndUpdate(material.materialId, {
        currentLocation: 'Internal Warehouse',
        vendorId: null
      });
    }

    // Calculate process loss
    const lossCalculation = calculateJobOrderProcessLoss(
      jobOrder.materialsIssued,
      jobOrder.materialsReceived
    );
    jobOrder.processLoss = {
      percentage: lossCalculation.overallLossPercentage,
      calculated: true
    };

    // Update status
    const totalIssued = jobOrder.materialsIssued.reduce((sum, m) => sum + m.quantity, 0);
    const totalReceived = jobOrder.materialsReceived.reduce((sum, m) => sum + m.quantity, 0);

    if (totalReceived >= totalIssued) {
      jobOrder.status = 'Completed';
      jobOrder.actualCompletionDate = new Date();
      jobOrder.currentLocation = 'Internal Warehouse';
    } else if (totalReceived > 0) {
      jobOrder.status = 'Partially Returned';
    }

    await jobOrder.save();

    const populatedJobOrder = await JobOrder.findById(jobOrder._id)
      .populate('vendorId')
      .populate('materialsIssued.materialId')
      .populate('materialsReceived.materialId');

    res.json({
      success: true,
      data: populatedJobOrder,
      processLoss: lossCalculation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate challan PDF
 * @route   GET /api/job-orders/:id/challan
 * @access  Private
 */
export const generateChallan = async (req, res, next) => {
  try {
    const jobOrder = await JobOrder.findById(req.params.id)
      .populate('vendorId')
      .populate('materialsIssued.materialId');

    if (!jobOrder) {
      return res.status(404).json({
        success: false,
        message: 'Job order not found'
      });
    }

    const materials = jobOrder.materialsIssued.map(m => ({
      materialType: m.materialType,
      name: m.materialId?.name || 'N/A',
      description: m.materialId?.description || '',
      quantity: m.quantity,
      unit: m.unit
    }));

    const pdfBuffer = await generateChallanPDF(jobOrder, jobOrder.vendorId, materials);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=challan-${jobOrder.jobOrderNumber}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update job order status
 * @route   PUT /api/job-orders/:id/status
 * @access  Private
 */
export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const jobOrder = await JobOrder.findById(req.params.id);

    if (!jobOrder) {
      return res.status(404).json({
        success: false,
        message: 'Job order not found'
      });
    }

    jobOrder.status = status;
    if (status === 'Completed') {
      jobOrder.actualCompletionDate = new Date();
    }

    await jobOrder.save();

    res.json({
      success: true,
      data: jobOrder
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createJobOrder,
  getJobOrders,
  getJobOrder,
  receiveMaterials,
  generateChallan,
  updateStatus
};

