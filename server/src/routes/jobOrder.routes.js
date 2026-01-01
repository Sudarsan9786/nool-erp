import express from 'express';
import {
  createJobOrder,
  getJobOrders,
  getJobOrder,
  receiveMaterials,
  generateChallan,
  updateStatus
} from '../controllers/jobOrder.controller.js';
import { protect, authorize, vendorAccess } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Vendor access middleware for vendor-specific routes
router.use(vendorAccess);

// Create job order (Admin, Supervisor only)
router.post('/', authorize('Admin', 'Supervisor'), createJobOrder);

// Get all job orders
router.get('/', getJobOrders);

// Get single job order
router.get('/:id', getJobOrder);

// Receive materials
router.put('/:id/receive', receiveMaterials);

// Generate challan PDF
router.get('/:id/challan', generateChallan);

// Update status
router.put('/:id/status', authorize('Admin', 'Supervisor'), updateStatus);

export default router;

