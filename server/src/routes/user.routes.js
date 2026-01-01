import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication and Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;

