import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { registerUserSchema, loginSchema, refreshTokenSchema } from '../utils/validation.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

// Register a new user
router.post('/register', validate(registerUserSchema), authController.register);

// Login user
router.post('/login', validate(loginSchema), authController.login);

// Refresh token
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

// Get user profile (protected route)
router.get('/profile', authenticate, authController.getProfile);

// Logout user
router.post('/logout', authenticate, authController.logout);

export default router;
