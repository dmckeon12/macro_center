import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { updateUserSchema, addressSchema, paymentMethodSchema } from '../utils/validation.js';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get user by ID (admin only)
router.get('/:userId', authorize('admin'), userController.getUser);

// Update user
router.put('/:userId', validate(updateUserSchema), userController.updateUser);

// Address management routes
router.post('/addresses', validate(addressSchema), userController.addAddress);
router.put('/addresses/:addressId', validate(addressSchema), userController.updateAddress);
router.delete('/addresses/:addressId', userController.deleteAddress);

// Payment method management routes
router.post('/payment-methods', validate(paymentMethodSchema), userController.addPaymentMethod);
router.put('/payment-methods/:paymentId', validate(paymentMethodSchema), userController.updatePaymentMethod);
router.delete('/payment-methods/:paymentId', userController.deletePaymentMethod);

export default router;
