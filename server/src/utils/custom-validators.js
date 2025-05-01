import { ApiError } from '../middleware/error.middleware.js';
import httpStatus from 'http-status';

/**
 * Custom validator for password
 * @param {string} value 
 * @param {object} helpers 
 * @returns {string|Error}
 */
export const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('Password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('Password must contain at least 1 letter and 1 number');
  }
  return value;
};

/**
 * Check if a MongoDB ID is valid
 * @param {string} id - MongoDB ID to validate
 * @returns {boolean}
 */
export const isValidObjectId = (id) => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
};

/**
 * Validate MongoDB ID
 * @param {string} id - MongoDB ID to validate
 * @throws {ApiError} If ID is invalid
 */
export const validateObjectId = (id) => {
  if (!isValidObjectId(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid ID format');
  }
};
