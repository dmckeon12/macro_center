import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createOrderSchema, updateOrderSchema } from '../utils/validation.js';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// User routes
router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/my-orders', orderController.getUserOrders);
router.get('/:orderId', orderController.getOrder);
router.put('/:orderId/pay', orderController.updateOrderToPaid);

// Admin routes
router.get('/', authorize('admin'), orderController.getAllOrders);
router.put('/:orderId', authorize('admin'), validate(updateOrderSchema), orderController.updateOrder);
router.get('/summary', authorize('admin'), orderController.getOrderSummary);

export default router;
