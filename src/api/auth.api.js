import apiClient from './client.js';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - User data and tokens
 */
export const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    
    // Store tokens and user data in localStorage
    if (response.data.tokens) {
      localStorage.setItem('accessToken', response.data.tokens.access.token);
      localStorage.setItem('refreshToken', response.data.tokens.refresh.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} - User data and tokens
 */
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Store tokens and user data in localStorage
    if (response.data.tokens) {
      localStorage.setItem('accessToken', response.data.tokens.access.token);
      localStorage.setItem('refreshToken', response.data.tokens.refresh.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    // Call logout API
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear tokens and user data regardless of API success
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

/**
 * Get current user profile
 * @returns {Promise<Object>} - User profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Refresh token
 * @returns {Promise<Object>} - New tokens
 */
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    
    // Store new tokens
    if (response.data.tokens) {
      localStorage.setItem('accessToken', response.data.tokens.access.token);
      localStorage.setItem('refreshToken', response.data.tokens.refresh.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    
    // Clear tokens and user data if refresh fails
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

/**
 * Get current user data from localStorage
 * @returns {Object|null} - User data or null if not authenticated
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
