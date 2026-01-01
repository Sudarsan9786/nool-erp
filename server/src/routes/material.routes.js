import express from 'express';
import {
  createMaterial,
  getMaterials,
  getMaterial,
  updateMaterial,
  deleteMaterial,
  getInventorySummary,
  seedDemoMaterials
} from '../controllers/material.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/inventory/summary', getInventorySummary);
router.post('/seed-demo', authorize('Admin', 'Supervisor'), seedDemoMaterials);
router.get('/', getMaterials);
router.get('/:id', getMaterial);
router.post('/', authorize('Admin', 'Supervisor'), createMaterial);
router.put('/:id', authorize('Admin', 'Supervisor'), updateMaterial);
router.delete('/:id', authorize('Admin'), deleteMaterial);

export default router;

