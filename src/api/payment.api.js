import apiClient from './client.js';

/**
 * Create a payment intent for an order using Stripe
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} - Payment intent with client secret
 */
export const createPaymentIntent = async (orderId) => {
  try {
    const response = await apiClient.post('/payments/create-payment-intent', { orderId });
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

/**
 * Create a Stripe customer
 * @returns {Promise<Object>} - Created customer
 */
export const createStripeCustomer = async () => {
  try {
    const response = await apiClient.post('/payments/create-customer');
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

/**
 * Get payment methods for a customer
 * @param {string} customerId - Stripe customer ID
 * @returns {Promise<Array>} - Payment methods
 */
export const getPaymentMethods = async (customerId) => {
  try {
    const response = await apiClient.get(`/payments/methods/${customerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching payment methods for customer ${customerId}:`, error);
    throw error;
  }
};

/**
 * Process payment during checkout with card details
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} - Payment result
 */
export const processCardPayment = async (paymentData) => {
  try {
    // Initialize Stripe.js if needed
    if (!window.Stripe) {
      console.error('Stripe.js is not loaded');
      throw new Error('Stripe.js is not loaded');
    }
    
    const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    
    // Create payment method
    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: paymentData.cardElement,
      billing_details: {
        name: paymentData.cardHolderName,
        email: paymentData.email,
      },
    });
    
    if (paymentMethodError) {
      console.error('Error creating payment method:', paymentMethodError);
      throw paymentMethodError;
    }
    
    // Confirm payment intent
    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
      paymentData.clientSecret, 
      {
        payment_method: paymentMethod.id,
      }
    );
    
    if (confirmError) {
      console.error('Error confirming payment:', confirmError);
      throw confirmError;
    }
    
    // Return payment result for order update
    return {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: new Date().toISOString(),
      email_address: paymentData.email,
      payment_method: 'credit_card',
      last_four: paymentData.cardElement._frame.firstChild.value.slice(-4),
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

/**
 * Validate credit card number (Luhn algorithm)
 * @param {string} cardNumber - Credit card number
 * @returns {boolean} - True if valid
 */
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber) return false;
  
  // Remove spaces and dashes
  const sanitized = cardNumber.replace(/[\s-]/g, '');
  
  // Check if contains only digits
  if (!/^\d+$/.test(sanitized)) return false;
  
  // Check length (most cards are 13-19 digits)
  if (sanitized.length < 13 || sanitized.length > 19) return false;
  
  // Luhn algorithm
  let sum = 0;
  let double = false;
  
  // Go from right to left
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    
    // Double every second digit
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    double = !double;
  }
  
  return sum % 10 === 0;
};
