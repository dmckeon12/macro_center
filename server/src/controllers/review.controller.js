import httpStatus from 'http-status';
import Review from '../models/review.model.js';
import Order from '../models/order.model.js';
import { ApiError } from '../middleware/error.middleware.js';
import { validateObjectId } from '../utils/custom-validators.js';
import { paginateResponse } from '../utils/helpers.js';

/**
 * Create a new product review
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const createReview = async (req, res) => {
  const { product } = req.body;
  const userId = req.user.id;
  
  // Check if user has already reviewed this product
  const existingReview = await Review.findOne({ user: userId, product });
  if (existingReview) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You have already reviewed this product');
  }
  
  // Check if user has purchased the product
  const orders = await Order.find({
    user: userId,
    isPaid: true,
    'orderItems.product': product
  });
  
  // Add the user ID and verified purchase status
  req.body.user = userId;
  req.body.verified_purchase = orders.length > 0;
  
  // Create the review
  const review = await Review.create(req.body);
  
  res.status(httpStatus.CREATED).json(review);
};

/**
 * Get reviews for a product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getProductReviews = async (req, res) => {
  const { productId } = req.params;
  validateObjectId(productId);
  
  const { page = 1, limit = 10, sort_by = 'newest' } = req.query;
  
  // Build filter
  const filter = { 
    product: productId,
    status: 'approved' 
  };
  
  // Build sort object
  let sortOption = {};
  switch (sort_by) {
    case 'helpful':
      sortOption = { helpful_votes: -1 };
      break;
    case 'highest':
      sortOption = { rating: -1 };
      break;
    case 'lowest':
      sortOption = { rating: 1 };
      break;
    case 'newest':
    default:
      sortOption = { createdAt: -1 };
  }
  
  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Execute query with pagination
  const [reviews, totalCount] = await Promise.all([
    Review.find(filter)
      .sort(sortOption)
      .populate('user', 'firstName lastName avatar')
      .skip(skip)
      .limit(parseInt(limit)),
    Review.countDocuments(filter),
  ]);
  
  // Return paginated response
  res.status(httpStatus.OK).json(
    paginateResponse(reviews, parseInt(page), parseInt(limit), totalCount)
  );
};

/**
 * Get a specific review
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getReview = async (req, res) => {
  const { reviewId } = req.params;
  validateObjectId(reviewId);
  
  const review = await Review.findById(reviewId)
    .populate('user', 'firstName lastName avatar')
    .populate('product', 'name main_picture_url');
  
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  
  res.status(httpStatus.OK).json(review);
};

/**
 * Update a review
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  validateObjectId(reviewId);
  
  const review = await Review.findById(reviewId);
  
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  
  // Check if the review belongs to the user or if admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update this review');
  }
  
  // Only admin can update status or helpful votes
  if (req.user.role !== 'admin') {
    delete req.body.status;
    delete req.body.helpful_votes;
  }
  
  const updatedReview = await Review.findByIdAndUpdate(
    reviewId,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.status(httpStatus.OK).json(updatedReview);
};

/**
 * Delete a review
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  validateObjectId(reviewId);
  
  const review = await Review.findById(reviewId);
  
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  
  // Check if the review belongs to the user or if admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete this review');
  }
  
  await Review.findByIdAndDelete(reviewId);
  
  res.status(httpStatus.NO_CONTENT).send();
};

/**
 * Vote a review as helpful
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const voteReviewHelpful = async (req, res) => {
  const { reviewId } = req.params;
  validateObjectId(reviewId);
  
  const review = await Review.findByIdAndUpdate(
    reviewId,
    { $inc: { helpful_votes: 1 } },
    { new: true }
  );
  
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  
  res.status(httpStatus.OK).json(review);
};

/**
 * Get all reviews (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getAllReviews = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  // Build filter
  const filter = {};
  
  if (status) {
    filter.status = status;
  }
  
  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Execute query with pagination
  const [reviews, totalCount] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'firstName lastName email')
      .populate('product', 'name main_picture_url')
      .skip(skip)
      .limit(parseInt(limit)),
    Review.countDocuments(filter),
  ]);
  
  // Return paginated response
  res.status(httpStatus.OK).json(
    paginateResponse(reviews, parseInt(page), parseInt(limit), totalCount)
  );
};
