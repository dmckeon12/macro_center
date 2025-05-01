import apiClient from './client.js';

/**
 * Create a new order
 * @param {Object} orderData - Order data
 * @returns {Promise<Object>} - Created order
 */
export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Get user orders
 * @param {Object} params - Query parameters for pagination and filtering
 * @returns {Promise<Object>} - Orders with pagination
 */
export const getUserOrders = async (params = {}) => {
  try {
    const response = await apiClient.get('/orders/my-orders', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

/**
 * Get order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} - Order
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Update order to paid status with payment result
 * @param {string} orderId - Order ID
 * @param {Object} paymentResult - Payment result data
 * @returns {Promise<Object>} - Updated order
 */
export const updateOrderToPaid = async (orderId, paymentResult) => {
  try {
    const response = await apiClient.put(`/orders/${orderId}/pay`, { paymentResult });
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${orderId} payment:`, error);
    throw error;
  }
};

/**
 * Calculate order shipping price
 * @param {Object} orderItems - Order items
 * @param {string} shippingAddress - Shipping address
 * @returns {number} - Shipping price in cents
 */
export const calculateShippingPrice = (orderItems, shippingAddress) => {
  // Base shipping cost
  let shippingPrice = 995; // $9.95 in cents
  
  // Calculate total weight (simplified)
  const totalItems = orderItems.reduce((total, item) => total + item.qty, 0);
  
  // Add weight-based cost
  if (totalItems > 5) {
    shippingPrice += 500; // Additional $5 for orders with more than 5 items
  }
  
  // Add location-based cost (simplified)
  const nonContinentalStates = ['AK', 'HI'];
  if (shippingAddress && nonContinentalStates.includes(shippingAddress.state)) {
    shippingPrice += 1500; // Additional $15 for Alaska and Hawaii
  }
  
  return shippingPrice;
};

/**
 * Calculate order tax
 * @param {number} subtotal - Order subtotal in cents
 * @param {string} state - State code
 * @returns {number} - Tax amount in cents
 */
export const calculateTax = (subtotal, state) => {
  // Simplified tax rates by state
  const taxRates = {
    'CA': 0.0725, // California
    'NY': 0.045,  // New York
    'TX': 0.0625, // Texas
    'FL': 0.06,   // Florida
    // Default tax rate for other states
    'default': 0.05
  };
  
  const taxRate = taxRates[state] || taxRates.default;
  return Math.round(subtotal * taxRate);
};
