import jwt from 'jsonwebtoken';
import moment from 'moment';
import config from '../config/config.js';
import { ApiError } from '../middleware/error.middleware.js';
import httpStatus from 'http-status';

/**
 * Generate a JWT token
 * @param {ObjectId} userId - User ID to include in token
 * @param {Moment} expires - Expiration time
 * @param {string} [secret=config.jwt.secret] - Secret to sign the token
 * @returns {string} JWT token
 */
export const generateToken = (userId, expires, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

/**
 * Verify JWT token and return payload
 * @param {string} token - JWT token to verify
 * @returns {object} Token payload
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }
};

/**
 * Generate auth tokens
 * @param {User} user - User to generate tokens for
 * @returns {Object} Generated tokens
 */
export const generateAuthTokens = async (user) => {
  // Generate access token expiry
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes, 
    'minutes'
  );
  const accessToken = generateToken(
    user.id, 
    accessTokenExpires
  );

  // Generate refresh token expiry
  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays, 
    'days'
  );
  const refreshToken = generateToken(
    user.id, 
    refreshTokenExpires
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};
