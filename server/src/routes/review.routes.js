import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createReviewSchema, updateReviewSchema } from '../utils/validation.js';
import * as reviewController from '../controllers/review.controller.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/:reviewId', reviewController.getReview);

// Routes requiring authentication
router.post('/', authenticate, validate(createReviewSchema), reviewController.createReview);
router.put('/:reviewId', authenticate, validate(updateReviewSchema), reviewController.updateReview);
router.delete('/:reviewId', authenticate, reviewController.deleteReview);
router.post('/:reviewId/helpful', authenticate, reviewController.voteReviewHelpful);

// Admin routes
router.get('/', authenticate, authorize('admin'), reviewController.getAllReviews);

export default router;
