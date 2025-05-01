import httpStatus from 'http-status';
import Stripe from 'stripe';
import config from '../config/config.js';
import Order from '../models/order.model.js';
import { ApiError } from '../middleware/error.middleware.js';
import { validateObjectId } from '../utils/custom-validators.js';
import logger from '../config/logger.js';

// Initialize Stripe
const stripe = new Stripe(config.stripe.secretKey);

/**
 * Create a Stripe payment intent
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const createPaymentIntent = async (req, res) => {
  const { orderId } = req.body;
  validateObjectId(orderId);
  
  const order = await Order.findById(orderId);
  
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  
  // Check if the order belongs to the user
  if (order.user.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to pay for this order');
  }
  
  // Check if order is already paid
  if (order.isPaid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order is already paid');
  }
  
  try {
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalPrice_cents,
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id,
      },
    });
    
    res.status(httpStatus.OK).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    logger.error(`Error creating payment intent: ${error.message}`);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error processing payment');
  }
};

/**
 * Handle Stripe webhook events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const handleWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.stripe.webhookSecret
    );
  } catch (error) {
    logger.error(`Webhook signature verification failed: ${error.message}`);
    return res.status(httpStatus.BAD_REQUEST).send(`Webhook Error: ${error.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      
      // Update order to paid
      if (paymentIntent.metadata.orderId) {
        const order = await Order.findById(paymentIntent.metadata.orderId);
        
        if (order && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = new Date();
          order.status = 'processing';
          order.paymentResult = {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString(),
            payment_method: 'stripe',
            last_four: paymentIntent.payment_method_details?.card?.last4 || '',
          };
          
          await order.save();
          logger.info(`Order ${order._id} marked as paid`);
        }
      }
      break;
    }
    
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      logger.info(`Payment failed for order ${paymentIntent.metadata.orderId}`);
      break;
    }
    
    default:
      // Unexpected event type
      logger.info(`Unhandled event type ${event.type}`);
  }
  
  // Return a 200 response to acknowledge receipt of the event
  res.status(httpStatus.OK).json({ received: true });
};

/**
 * Create a new Stripe customer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const createStripeCustomer = async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      name: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      metadata: {
        userId: req.user.id,
      },
    });
    
    res.status(httpStatus.CREATED).json({
      customerId: customer.id,
    });
  } catch (error) {
    logger.error(`Error creating Stripe customer: ${error.message}`);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating customer');
  }
};

/**
 * Get payment methods for a customer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getPaymentMethods = async (req, res) => {
  const { customerId } = req.params;
  
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    
    res.status(httpStatus.OK).json(paymentMethods.data);
  } catch (error) {
    logger.error(`Error fetching payment methods: ${error.message}`);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching payment methods');
  }
};
