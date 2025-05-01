/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
export const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

/**
 * Format price from cents to dollars with currency symbol
 * @param {number} cents 
 * @returns {string}
 */
export const formatPrice = (cents) => {
  return `$${(cents / 100).toFixed(2)}`;
};

/**
 * Generate a random string
 * @param {number} length
 * @returns {string}
 */
export const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Convert an array to a paginated response
 * @param {Array} data - Array of documents to paginate
 * @param {number} page - Current page number
 * @param {number} limit - Number of documents per page
 * @param {number} total - Total number of documents
 * @returns {Object} Paginated response
 */
export const paginateResponse = (data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    results: data,
    pagination: {
      current_page: page,
      total_pages: totalPages,
      total_items: total,
      items_per_page: limit,
      has_next_page: page < totalPages,
      has_prev_page: page > 1
    }
  };
};

/**
 * Calculate discounted price
 * @param {number} price - Original price
 * @param {number} discountPercent - Discount percentage
 * @returns {number} Discounted price
 */
export const calculateDiscountedPrice = (price, discountPercent) => {
  if (!discountPercent) return price;
  return Math.round(price * (1 - discountPercent / 100));
};

/**
 * Check if an object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean}
 */
export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};
