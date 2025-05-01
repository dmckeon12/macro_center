import apiClient, { useOfflineFallback } from './client.js';
import data from '../assets/data.js';

/**
 * Get all products with filtering, sorting, and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Products with pagination
 */
export const getProducts = async (params = {}) => {
  try {
    // If offline or in development without backend, use frontend data
    if (useOfflineFallback()) {
      // Filter products based on params
      let filteredProducts = [...data.products];
      
      // Apply category filter
      if (params.category) {
        filteredProducts = filteredProducts.filter(
          product => product.category === params.category
        );
      }
      
      // Apply brand filter
      if (params.brand_name) {
        filteredProducts = filteredProducts.filter(
          product => product.brand_name === params.brand_name
        );
      }
      
      // Apply price filters
      if (params.min_price) {
        filteredProducts = filteredProducts.filter(
          product => product.price_cents >= parseInt(params.min_price)
        );
      }
      
      if (params.max_price) {
        filteredProducts = filteredProducts.filter(
          product => product.price_cents <= parseInt(params.max_price)
        );
      }
      
      // Apply search filter
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          product =>
            product.name.toLowerCase().includes(searchLower) ||
            product.brand_name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply sorting
      if (params.sort_by) {
        switch (params.sort_by) {
          case 'price_asc':
            filteredProducts.sort((a, b) => a.price_cents - b.price_cents);
            break;
          case 'price_desc':
            filteredProducts.sort((a, b) => b.price_cents - a.price_cents);
            break;
          case 'rating':
            filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case 'newest':
          default:
            // Default order in data.js is already "newest"
            break;
        }
      }
      
      // Apply pagination
      const page = parseInt(params.page) || 1;
      const limit = parseInt(params.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      
      // Return data in the same format as the API
      return {
        results: paginatedProducts,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(filteredProducts.length / limit),
          total_items: filteredProducts.length,
          items_per_page: limit,
          has_next_page: endIndex < filteredProducts.length,
          has_prev_page: page > 1
        }
      };
    }
    
    // Use API for online mode
    const response = await apiClient.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Fallback to frontend data
    return {
      results: data.products,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_items: data.products.length,
        items_per_page: data.products.length,
        has_next_page: false,
        has_prev_page: false
      }
    };
  }
};

/**
 * Get product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} - Product
 */
export const getProductById = async (productId) => {
  try {
    // If offline or in development without backend, use frontend data
    if (useOfflineFallback()) {
      const product = data.products.find(p => p.id.toString() === productId.toString());
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      return product;
    }
    
    // Use API for online mode
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    
    // Fallback to frontend data
    const product = data.products.find(p => p.id.toString() === productId.toString());
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  }
};

/**
 * Get featured products
 * @param {number} limit - Number of products to retrieve
 * @returns {Promise<Array>} - Featured products
 */
export const getFeaturedProducts = async (limit = 8) => {
  try {
    // If offline or in development without backend, use frontend data
    if (useOfflineFallback()) {
      // Simulate featured products - just get first 8 products
      return data.products.slice(0, limit);
    }
    
    // Use API for online mode
    const response = await apiClient.get('/products/featured', { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    
    // Fallback to frontend data
    return data.products.slice(0, limit);
  }
};

/**
 * Get products by category
 * @param {string} category - Product category
 * @param {number} limit - Number of products to retrieve
 * @returns {Promise<Array>} - Products in the category
 */
export const getProductsByCategory = async (category, limit = 10) => {
  try {
    // If offline or in development without backend, use frontend data
    if (useOfflineFallback()) {
      const categoryProducts = data.products.filter(p => p.category === category);
      return categoryProducts.slice(0, limit);
    }
    
    // Use API for online mode
    const response = await apiClient.get(`/products/category/${category}`, { params: { limit } });
    return response.data;
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    
    // Fallback to frontend data
    const categoryProducts = data.products.filter(p => p.category === category);
    return categoryProducts.slice(0, limit);
  }
};

/**
 * Check compatibility between products
 * @param {Array<string>} productIds - Array of product IDs
 * @returns {Promise<Object>} - Compatibility result
 */
export const checkCompatibility = async (productIds) => {
  try {
    // If offline or in development without backend, use frontend data
    if (useOfflineFallback()) {
      // Get the products
      const products = productIds.map(id => 
        data.products.find(p => p.id.toString() === id.toString())
      ).filter(Boolean);
      
      // Simple compatibility check based on categories
      let compatible = true;
      
      // Check CPU and motherboard socket compatibility
      const cpu = products.find(p => p.category === 'cpu');
      const motherboard = products.find(p => p.category === 'motherboard');
      
      if (cpu && motherboard) {
        compatible = cpu.specs.socket === motherboard.specs.socket;
      }
      
      // Check RAM and motherboard compatibility
      const ram = products.find(p => p.category === 'ram');
      
      if (ram && motherboard && compatible) {
        compatible = ram.specs.type === motherboard.specs.memory_support;
      }
      
      return {
        compatible,
        details: [
          { message: compatible ? 'All components are compatible' : 'Some components are incompatible' }
        ]
      };
    }
    
    // Use API for online mode
    const response = await apiClient.post('/products/check-compatibility', { productIds });
    return response.data;
  } catch (error) {
    console.error('Error checking compatibility:', error);
    
    // Return cautious result
    return {
      compatible: false,
      details: [{ message: 'Unable to verify compatibility. Please check manually.' }]
    };
  }
};

/**
 * Get product recommendations based on a product, category, or both
 * @param {string} productId - Product ID to base recommendations on
 * @param {string} category - Category to filter recommendations
 * @param {string} relatedCategory - Optional related category for cross-category recommendations
 * @returns {Promise<Array>} - Recommended products
 */
export const getRecommendations = async (productId, category, relatedCategory = null) => {
  try {
    // Use API for online mode
    const params = { category };
    if (relatedCategory) params.relatedCategory = relatedCategory;
    
    const response = await apiClient.get(`/products/${productId}/recommendations`, { params });
    return response;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error; // Let the component handle fallback
  }
};

/**
 * Fallback method to get recommendations using local data
 * @param {string} productId - Product ID to base recommendations on
 * @param {string} category - Category to filter recommendations
 * @param {string} relatedCategory - Optional related category for cross-category recommendations
 * @returns {Promise<Array>} - Recommended products
 */
export const getRecommendationsFallback = async (productId, category, relatedCategory = null) => {
  try {
    // Get the source product
    const product = data.products.find(p => p.id.toString() === productId.toString());
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    let recommendedProducts = [];
    
    // If we want recommendations from a related category (e.g., recommend RAM for this CPU)
    if (relatedCategory) {
      recommendedProducts = data.products.filter(p => p.category === relatedCategory);
      
      // Apply compatibility logic based on the categories
      if (category === 'cpu' && relatedCategory === 'motherboard') {
        // Recommend motherboards that match the CPU socket
        recommendedProducts = recommendedProducts.filter(p => 
          p.specs.socket === product.specs.socket
        );
      } 
      else if (category === 'motherboard' && relatedCategory === 'cpu') {
        // Recommend CPUs that match the motherboard socket
        recommendedProducts = recommendedProducts.filter(p => 
          p.specs.socket === product.specs.socket
        );
      }
      else if (category === 'motherboard' && relatedCategory === 'ram') {
        // Recommend RAM that matches the motherboard's memory support
        recommendedProducts = recommendedProducts.filter(p => 
          p.specs.type === product.specs.memory_support
        );
      }
      else if (category === 'cpu' && relatedCategory === 'gpu') {
        // Recommend GPUs that pair well with this CPU (based on performance tier)
        // This is a simplified example - in a real system, more sophisticated matching would be used
        const highEndCpus = ['Ryzen 9', 'Core i9', 'Ryzen 7'];
        const isCpuHighEnd = highEndCpus.some(name => product.name.includes(name));
        
        if (isCpuHighEnd) {
          // Recommend high-end GPUs for high-end CPUs
          recommendedProducts = recommendedProducts.filter(p => 
            p.name.includes('RTX') || p.name.includes('RX 6800') || p.name.includes('RX 6900')
          );
        } else {
          // Recommend mid-range GPUs for mid-range CPUs
          recommendedProducts = recommendedProducts.filter(p => 
            p.name.includes('RTX 3060') || p.name.includes('RX 6600') ||
            p.name.includes('GTX 1660') || p.name.includes('RTX 3050')
          );
        }
      }
    } else {
      // Regular recommendations - same category, similar price range or features
      recommendedProducts = data.products.filter(p => 
        p.category === product.category && 
        p.id !== product.id && // Don't recommend the same product
        Math.abs(p.price_cents - product.price_cents) < product.price_cents * 0.3 // Within 30% price range
      );
    }
    
    // Limit to 4 recommendations and randomize slightly for variety
    recommendedProducts = recommendedProducts
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
    
    return recommendedProducts;
  } catch (error) {
    console.error('Error generating fallback recommendations:', error);
    return [];
  }
};
