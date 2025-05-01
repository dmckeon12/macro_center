import httpStatus from 'http-status';
import User from '../models/user.model.js';
import { generateAuthTokens, verifyToken } from '../utils/token.js';
import { ApiError } from '../middleware/error.middleware.js';

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const register = async (req, res) => {
  const { email } = req.body;
  
  // Check if email is already taken
  if (await User.isEmailTaken(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  
  // Create user
  const user = await User.create(req.body);
  
  // Generate tokens
  const tokens = await generateAuthTokens(user);
  
  res.status(httpStatus.CREATED).json({ user, tokens });
};

/**
 * Login with email and password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  
  // Generate tokens
  const tokens = await generateAuthTokens(user);
  
  res.status(httpStatus.OK).json({ user, tokens });
};

/**
 * Refresh user token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  
  try {
    // Verify refresh token
    const payload = verifyToken(refreshToken);
    
    // Find user
    const user = await User.findById(payload.sub);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }
    
    // Generate new tokens
    const tokens = await generateAuthTokens(user);
    
    res.status(httpStatus.OK).json({ tokens });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getProfile = async (req, res) => {
  res.status(httpStatus.OK).json(req.user);
};

/**
 * Logout user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const logout = async (req, res) => {
  // In a real implementation, you would also invalidate the token
  // by adding it to a blacklist or using Redis to track invalid tokens
  res.status(httpStatus.NO_CONTENT).send();
};
