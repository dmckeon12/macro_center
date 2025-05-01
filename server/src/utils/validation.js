import Joi from 'joi';
import { password } from './custom-validators.js';

export const registerUserSchema = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    phone: Joi.string().allow(''),
  }),
};

export const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

export const refreshTokenSchema = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const updateUserSchema = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      phone: Joi.string().allow(''),
      avatar: Joi.string().allow(''),
    })
    .min(1),
};

export const addressSchema = {
  body: Joi.object().keys({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().default('United States'),
    isDefault: Joi.boolean().default(false),
  }),
};

export const paymentMethodSchema = {
  body: Joi.object().keys({
    type: Joi.string().valid('credit', 'debit', 'paypal').required(),
    cardHolderName: Joi.string().when('type', {
      is: Joi.valid('credit', 'debit'),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    lastFourDigits: Joi.string().when('type', {
      is: Joi.valid('credit', 'debit'),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    expiryMonth: Joi.number().when('type', {
      is: Joi.valid('credit', 'debit'),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    expiryYear: Joi.number().when('type', {
      is: Joi.valid('credit', 'debit'),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    email: Joi.string().email().when('type', {
      is: 'paypal',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    isDefault: Joi.boolean().default(false),
  }),
};

export const createProductSchema = {
  body: Joi.object().keys({
    category: Joi.string().required().valid('cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu'),
    brand_name: Joi.string().required(),
    name: Joi.string().required(),
    details: Joi.string().required(),
    price_cents: Joi.number().integer().required().min(0),
    status: Joi.string().valid('active', 'inactive', 'discontinued').default('active'),
    specs: Joi.object().required(),
    stock: Joi.boolean().default(true),
    quantity: Joi.number().integer().min(0).default(100),
    main_picture_url: Joi.string().required(),
    additional_images: Joi.array().items(Joi.string()),
    description: Joi.string().required(),
    discount_percent: Joi.number().min(0).max(100).default(0),
    featured: Joi.boolean().default(false),
  }),
};

export const updateProductSchema = {
  params: Joi.object().keys({
    productId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      category: Joi.string().valid('cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu'),
      brand_name: Joi.string(),
      name: Joi.string(),
      details: Joi.string(),
      price_cents: Joi.number().integer().min(0),
      status: Joi.string().valid('active', 'inactive', 'discontinued'),
      specs: Joi.object(),
      stock: Joi.boolean(),
      quantity: Joi.number().integer().min(0),
      main_picture_url: Joi.string(),
      additional_images: Joi.array().items(Joi.string()),
      description: Joi.string(),
      discount_percent: Joi.number().min(0).max(100),
      featured: Joi.boolean(),
    })
    .min(1),
};

export const getProductsSchema = {
  query: Joi.object().keys({
    category: Joi.string(),
    brand_name: Joi.string(),
    status: Joi.string(),
    featured: Joi.boolean(),
    min_price: Joi.number().integer().min(0),
    max_price: Joi.number().integer().min(0),
    sort_by: Joi.string().valid('price_asc', 'price_desc', 'newest', 'rating'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string(),
  }),
};

export const createOrderSchema = {
  body: Joi.object().keys({
    orderItems: Joi.array()
      .items(
        Joi.object().keys({
          product: Joi.string().required(),
          name: Joi.string().required(),
          qty: Joi.number().integer().min(1).required(),
          price_cents: Joi.number().integer().min(0).required(),
          main_picture_url: Joi.string().required(),
        })
      )
      .min(1)
      .required(),
    shippingAddress: Joi.object()
      .keys({
        fullName: Joi.string().required(),
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().required(),
        country: Joi.string().default('United States'),
        phone: Joi.string(),
      })
      .required(),
    paymentMethod: Joi.string().valid('credit_card', 'paypal', 'stripe').required(),
    itemsPrice_cents: Joi.number().integer().min(0).required(),
    shippingPrice_cents: Joi.number().integer().min(0).required(),
    taxPrice_cents: Joi.number().integer().min(0).required(),
    totalPrice_cents: Joi.number().integer().min(0).required(),
  }),
};

export const updateOrderSchema = {
  params: Joi.object().keys({
    orderId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      isPaid: Joi.boolean(),
      paidAt: Joi.date(),
      isDelivered: Joi.boolean(),
      deliveredAt: Joi.date(),
      trackingNumber: Joi.string(),
      paymentResult: Joi.object().keys({
        id: Joi.string().required(),
        status: Joi.string().required(),
        update_time: Joi.string().required(),
        email_address: Joi.string().email(),
        payment_method: Joi.string().valid('credit_card', 'paypal', 'stripe').required(),
        last_four: Joi.string(),
      }),
    })
    .min(1),
};

export const createReviewSchema = {
  body: Joi.object().keys({
    product: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    title: Joi.string().required().max(100),
    comment: Joi.string().required().min(5).max(1000),
  }),
};

export const updateReviewSchema = {
  params: Joi.object().keys({
    reviewId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      rating: Joi.number().integer().min(1).max(5),
      title: Joi.string().max(100),
      comment: Joi.string().min(5).max(1000),
      helpful_votes: Joi.number().integer().min(0),
      status: Joi.string().valid('pending', 'approved', 'rejected'),
    })
    .min(1),
};
