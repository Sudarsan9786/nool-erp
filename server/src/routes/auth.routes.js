import express from 'express';
import { register, login, getMe, seedDemoUsers, fixDemoPasswords } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate, loginValidation, userRegistrationValidation } from '../utils/validation.js';

const router = express.Router();

router.post('/register', validate(userRegistrationValidation), register);
router.post('/login', validate(loginValidation), login);
router.post('/seed-demo-users', seedDemoUsers); // Public endpoint for demo
router.post('/fix-passwords', fixDemoPasswords); // Public endpoint to fix passwords
router.get('/me', protect, getMe);

export default router;

