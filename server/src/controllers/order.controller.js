import httpStatus from 'http-status';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import { ApiError } from '../middleware/error.middleware.js';
import { validateObjectId } from '../utils/custom-validators.js';
import { paginateResponse } from '../utils/helpers.js';

/**
 * Create a new order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const createOrder = async (req, res) => {
  // Add the user ID to the order
  req.body.user = req.user.id;
  
  // Validate if products exist and have sufficient quantity
  const orderItems = req.body.orderItems;
  const productIds = orderItems.map(item => item.product);
  
  const products = await Product.find({ _id: { $in: productIds } });
  
  if (products.length !== productIds.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'One or more products not found');
  }
  
  for (const item of orderItems) {
    const product = products.find(p => p._id.toString() === item.product);
    
    if (!product.stock || (product.quantity !== undefined && product.quantity < item.qty)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST, 
        `Product ${product.name} is out of stock or has insufficient quantity`
      );
    }
  }
  
  // Create the order
  const order = await Order.create(req.body);
  
  // Update product quantities
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { quantity: -item.qty } }
    );
  }
  
  res.status(httpStatus.CREATED).json(order);
};

/**
 * Get all orders for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getUserOrders = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  // Build filter
  const filter = { user: req.user.id };
  
  if (status) {
    filter.status = status;
  }
  
  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Execute query with pagination
  const [orders, totalCount] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Order.countDocuments(filter),
  ]);
  
  // Return paginated response
  res.status(httpStatus.OK).json(
    paginateResponse(orders, parseInt(page), parseInt(limit), totalCount)
  );
};

/**
 * Get order by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getOrder = async (req, res) => {
  const { orderId } = req.params;
  validateObjectId(orderId);
  
  const order = await Order.findById(orderId);
  
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  
  // Check if the order belongs to the user or if admin
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to access this order');
  }
  
  res.status(httpStatus.OK).json(order);
};

/**
 * Update order status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  validateObjectId(orderId);
  
  // Find order first to check permissions
  const existingOrder = await Order.findById(orderId);
  
  if (!existingOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  
  // Check permissions - only admin can update order details
  if (req.user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update this order');
  }
  
  // Update delivery status if needed
  if (req.body.isDelivered && !existingOrder.isDelivered) {
    req.body.deliveredAt = new Date();
  }
  
  // Update order
  const order = await Order.findByIdAndUpdate(
    orderId,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.status(httpStatus.OK).json(order);
};

/**
 * Update order to paid
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const updateOrderToPaid = async (req, res) => {
  const { orderId } = req.params;
  validateObjectId(orderId);
  
  const order = await Order.findById(orderId);
  
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  
  // Check if the order belongs to the user or if admin
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update this order');
  }
  
  // Update order
  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = req.body.paymentResult;
  
  // Update status to processing if it was pending
  if (order.status === 'pending') {
    order.status = 'processing';
  }
  
  const updatedOrder = await order.save();
  
  res.status(httpStatus.OK).json(updatedOrder);
};

/**
 * Get all orders (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getAllOrders = async (req, res) => {
  const { page = 1, limit = 10, status, isPaid, isDelivered } = req.query;
  
  // Build filter
  const filter = {};
  
  if (status) {
    filter.status = status;
  }
  
  if (isPaid !== undefined) {
    filter.isPaid = isPaid === 'true';
  }
  
  if (isDelivered !== undefined) {
    filter.isDelivered = isDelivered === 'true';
  }
  
  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Execute query with pagination
  const [orders, totalCount] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'firstName lastName email')
      .skip(skip)
      .limit(parseInt(limit)),
    Order.countDocuments(filter),
  ]);
  
  // Return paginated response
  res.status(httpStatus.OK).json(
    paginateResponse(orders, parseInt(page), parseInt(limit), totalCount)
  );
};

/**
 * Get order summary statistics (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getOrderSummary = async (req, res) => {
  // Get total order count
  const totalOrders = await Order.countDocuments();
  
  // Get total paid orders amount
  const totalSales = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice_cents' } } },
  ]);
  
  // Get orders by status
  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  
  // Get orders by date (last 7 days)
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  
  const dailyOrders = await Order.aggregate([
    { $match: { createdAt: { $gte: last7Days } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        sales: { $sum: '$totalPrice_cents' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  
  res.status(httpStatus.OK).json({
    totalOrders,
    totalSales: totalSales.length > 0 ? totalSales[0].total : 0,
    ordersByStatus,
    dailyOrders,
  });
};
