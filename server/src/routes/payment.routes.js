import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as paymentController from '../controllers/payment.controller.js';

const router = express.Router();

// Stripe webhook - no authentication required
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

// Public payment routes for guest checkout
router.post('/create-payment-intent/guest', paymentController.createPaymentIntent);

// Routes requiring authentication
router.use(authenticate);
router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.post('/create-customer', paymentController.createStripeCustomer);
router.get('/methods/:customerId', paymentController.getPaymentMethods);

export default router;
