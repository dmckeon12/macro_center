import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createProductSchema, updateProductSchema, getProductsSchema } from '../utils/validation.js';
import * as productController from '../controllers/product.controller.js';

const router = express.Router();

// Public routes
router.get('/', validate(getProductsSchema), productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:productId', productController.getProduct);

// Protected routes - Admin only for creation, updating, and deletion
router.post('/', authenticate, authorize('admin'), validate(createProductSchema), productController.createProduct);
router.put('/:productId', authenticate, authorize('admin'), validate(updateProductSchema), productController.updateProduct);
router.delete('/:productId', authenticate, authorize('admin'), productController.deleteProduct);

// Check compatibility between products
router.post('/check-compatibility', productController.checkCompatibility);

// Get product recommendations
router.get('/:productId/recommendations', productController.getProductRecommendations);

export default router;
