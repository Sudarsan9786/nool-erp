import express from 'express';
import {
  createVendor,
  getVendors,
  getVendor,
  updateVendor,
  deleteVendor,
  seedDemoVendors
} from '../controllers/vendor.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate, vendorValidation } from '../utils/validation.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getVendors);
router.get('/:id', getVendor);
router.post('/', authorize('Admin', 'Supervisor'), validate(vendorValidation), createVendor);
router.post('/seed-demo', authorize('Admin', 'Supervisor'), seedDemoVendors);
router.put('/:id', authorize('Admin', 'Supervisor'), validate(vendorValidation), updateVendor);
router.delete('/:id', authorize('Admin'), deleteVendor);

export default router;

