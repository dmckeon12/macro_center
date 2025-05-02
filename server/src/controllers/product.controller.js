import httpStatus from 'http-status';
import { Product } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Setup for fallback mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let mockData = null;

// Load mock data function
const loadMockData = async () => {
  try {
    // In fallback mode, try to load product data from a file
    // This is relative to the server code structure
    const frontendDataPath = path.join(__dirname, '../../../src/assets/data.js');
    
    // Check if data.js exists
    if (fs.existsSync(frontendDataPath)) {
      console.log('Using frontend data for fallback mode');
      // Import frontend data dynamically
      const module = await import('file://' + frontendDataPath);
      mockData = module.default || module;
      return mockData.products || [];
    } else {
      console.log('Frontend data not found, using empty array');
      return [];
    }
  } catch (error) {
    console.error('Error loading mock data:', error);
    return [];
  }
};

/**
 * Create a new product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const createProduct = async (req, res) => {
  // Add the user ID of the creator (admin)
  req.body.created_by = req.user.id;
  
  const product = await Product.create(req.body);
  
  res.status(httpStatus.CREATED).json(product);
};

/**
 * Get all products with filtering, sorting, and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getProducts = async (req, res) => {
  const {
    category,
    brand_name,
    status = 'active',
    featured,
    min_price,
    max_price,
    sort_by = 'newest',
    page = 1,
    limit = 10,
    search,
  } = req.query;

  // Build filter object
  const filter = { status };
  
  if (category) {
    filter.category = category;
  }
  
  if (brand_name) {
    filter.brand_name = brand_name;
  }
  
  if (featured !== undefined) {
    filter.featured = featured === 'true';
  }
  
  if (min_price !== undefined) {
    filter.price_cents = { $gte: parseInt(min_price) };
  }
  
  if (max_price !== undefined) {
    filter.price_cents = { ...filter.price_cents, $lte: parseInt(max_price) };
  }
  
  // Add text search if search parameter is provided
  if (search) {
    filter.$text = { $search: search };
  }
  
  // Build sort object
  let sortOption = {};
  switch (sort_by) {
    case 'price_asc':
      sortOption = { price_cents: 1 };
      break;
    case 'price_desc':
      sortOption = { price_cents: -1 };
      break;
    case 'rating':
      sortOption = { rating: -1 };
      break;
    case 'newest':
    default:
      sortOption = { createdAt: -1 };
  }
  
  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Execute query with pagination
  const [products, totalCount] = await Promise.all([
    Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit)),
    Product.countDocuments(filter),
  ]);
  
  // Return paginated response
  res.status(httpStatus.OK).json(
    paginateResponse(products, parseInt(page), parseInt(limit), totalCount)
  );
};

/**
 * Get product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getProduct = async (req, res) => {
  const { productId } = req.params;
  validateObjectId(productId);
  
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  
  res.status(httpStatus.OK).json(product);
};

/**
 * Update product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  validateObjectId(productId);
  
  const product = await Product.findByIdAndUpdate(
    productId,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  
  res.status(httpStatus.OK).json(product);
};

/**
 * Delete product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  validateObjectId(productId);
  
  const product = await Product.findByIdAndDelete(productId);
  
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  
  res.status(httpStatus.NO_CONTENT).send();
};

/**
 * Get featured products
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getFeaturedProducts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  
  const products = await Product.find({ 
    status: 'active', 
    featured: true 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
  
  res.status(httpStatus.OK).json(products);
};

/**
 * Get products by category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  
  const products = await Product.find({ 
    status: 'active', 
    category 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
  
  res.status(httpStatus.OK).json(products);
};

/**
 * Check compatibility between products
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const checkCompatibility = async (req, res) => {
  const { productIds } = req.body;
  
  if (!Array.isArray(productIds) || productIds.length < 2) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'At least two product IDs required');
  }
  
  // Validate all product IDs
  productIds.forEach(id => validateObjectId(id));
  
  // Fetch all products
  const products = await Product.find({ _id: { $in: productIds } });
  
  if (products.length !== productIds.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'One or more products not found');
  }
  
  // Check compatibility between all pairs of products
  const compatibilityResults = [];
  
  for (let i = 0; i < products.length - 1; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const product1 = products[i];
      const product2 = products[j];
      
      const isCompatible = product1.isCompatibleWith(product2);
      
      compatibilityResults.push({
        product1: { id: product1._id, name: product1.name, category: product1.category },
        product2: { id: product2._id, name: product2.name, category: product2.category },
        isCompatible,
      });
    }
  }
  
  res.status(httpStatus.OK).json({
    compatible: compatibilityResults.every(result => result.isCompatible),
    details: compatibilityResults,
  });
};

/**
 * Get product recommendations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getProductRecommendations = async (req, res) => {
  try {
    const { productId } = req.params;
    const { category, relatedCategory } = req.query;

    // Validate the product ID
    validateObjectId(productId);

    // Find the source product
    const sourceProduct = await Product.findById(productId);
    if (!sourceProduct) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }

    let recommendedProducts = [];
    
    // If we have a related category, we want cross-category recommendations
    if (relatedCategory) {
      try {
        // Get all products from the related category
        const relatedCategoryProducts = await Product.find({ 
          category: relatedCategory, 
          _id: { $ne: productId },
          status: 'active'
        });
        
        // Apply compatibility logic based on the categories
        if (sourceProduct.category === 'cpu' && relatedCategory === 'motherboard') {
          try {
            // Recommend motherboards that match the CPU socket
            recommendedProducts = relatedCategoryProducts.filter(product => 
              product.specs && product.specs.socket && 
              sourceProduct.specs && sourceProduct.specs.socket &&
              product.specs.socket === sourceProduct.specs.socket
            );
          } catch (filterError) {
            console.error('Error filtering CPU-compatible motherboards:', filterError);
            recommendedProducts = relatedCategoryProducts;
          }
        } 
        else if (sourceProduct.category === 'motherboard' && relatedCategory === 'cpu') {
          try {
            // Recommend CPUs that match the motherboard socket
            recommendedProducts = relatedCategoryProducts.filter(product => 
              product.specs && product.specs.socket && 
              sourceProduct.specs && sourceProduct.specs.socket &&
              product.specs.socket === sourceProduct.specs.socket
            );
          } catch (filterError) {
            console.error('Error filtering motherboard-compatible CPUs:', filterError);
            recommendedProducts = relatedCategoryProducts;
          }
        }
        else if (sourceProduct.category === 'motherboard' && relatedCategory === 'ram') {
          try {
            // Recommend RAM that matches the motherboard's memory support
            recommendedProducts = relatedCategoryProducts.filter(product => 
              product.specs && product.specs.type && 
              sourceProduct.specs && sourceProduct.specs.memory_support &&
              product.specs.type === sourceProduct.specs.memory_support
            );
          } catch (filterError) {
            console.error('Error filtering motherboard-compatible RAM:', filterError);
            recommendedProducts = relatedCategoryProducts;
          }
        }
        else if (sourceProduct.category === 'cpu' && relatedCategory === 'gpu') {
          try {
            // Recommend GPUs that pair well with this CPU (based on performance tier)
            const highEndCpus = ['Ryzen 9', 'Core i9', 'Ryzen 7'];
            const isCpuHighEnd = sourceProduct.name && 
              highEndCpus.some(name => sourceProduct.name.includes(name));
            
            if (isCpuHighEnd) {
              // Recommend high-end GPUs for high-end CPUs
              recommendedProducts = relatedCategoryProducts.filter(product => 
                product.name && (
                  product.name.includes('RTX 40') || 
                  product.name.includes('RX 7900') || 
                  product.name.includes('RX 6800')
                )
              );
            } else {
              // Recommend mid-range GPUs for mid-range CPUs
              recommendedProducts = relatedCategoryProducts.filter(product => 
                product.name && (
                  product.name.includes('RTX 3060') || 
                  product.name.includes('RX 6600') ||
                  product.name.includes('GTX 1660')
                )
              );
            }
          } catch (filterError) {
            console.error('Error filtering CPU-compatible GPUs:', filterError);
            recommendedProducts = relatedCategoryProducts;
          }
        }
        else {
          // For other cross-category recommendations, just return products from the related category
          recommendedProducts = relatedCategoryProducts;
        }
      } catch (categoryError) {
        console.error('Error processing related category recommendations:', categoryError);
        // Return an empty array if there's an error with cross-category recommendations
        recommendedProducts = [];
      }
    } else {
      try {
        // Regular recommendations - same category, similar price range
        recommendedProducts = await Product.find({
          category: sourceProduct.category,
          _id: { $ne: sourceProduct._id },
          status: 'active',
          price_cents: { 
            $gte: sourceProduct.price_cents * 0.7,  // Within 30% price range
            $lte: sourceProduct.price_cents * 1.3
          }
        }).limit(10);
      } catch (sameTypeError) {
        console.error('Error finding same-category recommendations:', sameTypeError);
        recommendedProducts = [];
      }
    }
    
    try {
      // Get a random subset of up to 4 recommendations
      if (recommendedProducts.length > 4) {
        // Shuffle array
        for (let i = recommendedProducts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [recommendedProducts[i], recommendedProducts[j]] = [recommendedProducts[j], recommendedProducts[i]];
        }
        // Slice to get only 4 items
        recommendedProducts = recommendedProducts.slice(0, 4);
      }
    } catch (shuffleError) {
      console.error('Error shuffling recommendations:', shuffleError);
      // If there's an error shuffling, just return the first 4 items
      recommendedProducts = recommendedProducts.slice(0, 4);
    }

    res.status(httpStatus.OK).json(recommendedProducts);
  } catch (error) {
    console.error('Error in product recommendations:', error);
    if (error instanceof ApiError) {
      throw error; // Re-throw API errors to be handled by the error middleware
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not generate product recommendations');
  }
};
