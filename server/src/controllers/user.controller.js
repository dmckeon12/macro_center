import httpStatus from 'http-status';
import User from '../models/user.model.js';
import { ApiError } from '../middleware/error.middleware.js';
import { validateObjectId } from '../utils/custom-validators.js';

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getUser = async (req, res) => {
  const { userId } = req.params;
  validateObjectId(userId);
  
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  
  res.status(httpStatus.OK).json(user);
};

/**
 * Update user details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const updateUser = async (req, res) => {
  const { userId } = req.params;
  validateObjectId(userId);
  
  // Check if updating email and if it's taken
  if (req.body.email && await User.isEmailTaken(req.body.email, userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  
  const user = await User.findByIdAndUpdate(
    userId, 
    req.body, 
    { new: true, runValidators: true }
  );
  
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  
  res.status(httpStatus.OK).json(user);
};

/**
 * Add a new address to user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const addAddress = async (req, res) => {
  const userId = req.user.id;
  const newAddress = req.body;
  
  // If this address is set as default, unset any existing default
  if (newAddress.isDefault) {
    await User.updateOne(
      { _id: userId, 'addresses.isDefault': true },
      { $set: { 'addresses.$.isDefault': false } }
    );
  }
  
  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { addresses: newAddress } },
    { new: true, runValidators: true }
  );
  
  res.status(httpStatus.OK).json(user.addresses);
};

/**
 * Update an existing address
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const updateAddress = async (req, res) => {
  const userId = req.user.id;
  const { addressId } = req.params;
  const updatedAddress = req.body;
  
  // If this address is set as default, unset any existing default
  if (updatedAddress.isDefault) {
    await User.updateOne(
      { _id: userId, 'addresses.isDefault': true, 'addresses._id': { $ne: addressId } },
      { $set: { 'addresses.$.isDefault': false } }
    );
  }
  
  const user = await User.findOneAndUpdate(
    { _id: userId, 'addresses._id': addressId },
    { $set: { 'addresses.$': updatedAddress } },
    { new: true, runValidators: true }
  );
  
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }
  
  res.status(httpStatus.OK).json(user.addresses);
};

/**
 * Delete an address
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const deleteAddress = async (req, res) => {
  const userId = req.user.id;
  const { addressId } = req.params;
  
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { addresses: { _id: addressId } } },
    { new: true }
  );
  
  res.status(httpStatus.OK).json(user.addresses);
};

/**
 * Add a new payment method
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const addPaymentMethod = async (req, res) => {
  const userId = req.user.id;
  const newPaymentMethod = req.body;
  
  // If this payment method is set as default, unset any existing default
  if (newPaymentMethod.isDefault) {
    await User.updateOne(
      { _id: userId, 'paymentMethods.isDefault': true },
      { $set: { 'paymentMethods.$.isDefault': false } }
    );
  }
  
  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { paymentMethods: newPaymentMethod } },
    { new: true, runValidators: true }
  );
  
  res.status(httpStatus.OK).json(user.paymentMethods);
};

/**
 * Update a payment method
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const updatePaymentMethod = async (req, res) => {
  const userId = req.user.id;
  const { paymentId } = req.params;
  const updatedPaymentMethod = req.body;
  
  // If this payment method is set as default, unset any existing default
  if (updatedPaymentMethod.isDefault) {
    await User.updateOne(
      { 
        _id: userId, 
        'paymentMethods.isDefault': true, 
        'paymentMethods._id': { $ne: paymentId } 
      },
      { $set: { 'paymentMethods.$.isDefault': false } }
    );
  }
  
  const user = await User.findOneAndUpdate(
    { _id: userId, 'paymentMethods._id': paymentId },
    { $set: { 'paymentMethods.$': updatedPaymentMethod } },
    { new: true, runValidators: true }
  );
  
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment method not found');
  }
  
  res.status(httpStatus.OK).json(user.paymentMethods);
};

/**
 * Delete a payment method
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const deletePaymentMethod = async (req, res) => {
  const userId = req.user.id;
  const { paymentId } = req.params;
  
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { paymentMethods: { _id: paymentId } } },
    { new: true }
  );
  
  res.status(httpStatus.OK).json(user.paymentMethods);
};
