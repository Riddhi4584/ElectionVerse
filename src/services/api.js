import { config } from '../config';

/**
 * Centralized API service.
 * All HTTP requests to the backend should flow through these functions.
 */

/**
 * Generic fetch wrapper with error handling.
 * @param {string} endpoint - API endpoint (e.g., '/auth/login').
 * @param {Object} options - Fetch options.
 * @returns {Promise<any>} The parsed JSON response.
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${config.api.baseUrl}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    // Backend should return { success: false, message: "..." }
    const errorMessage = data.message || data.error || 'An unexpected error occurred';
    throw new Error(errorMessage);
  }

  return data;
};

export const api = {
  auth: {
    login: (email, password) => 
      fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (email, password) =>
      fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
  },
  user: {
    updateOnboarding: (userId, activeRole, language, location) =>
      fetchAPI('/user/onboarding', {
        method: 'PUT',
        body: JSON.stringify({ userId, activeRole, language, location }),
      }),
  },
  journey: {
    markStepComplete: (userId, stepIndex) =>
      fetchAPI('/journey/step', {
        method: 'POST',
        body: JSON.stringify({ userId, stepIndex }),
      }),
  }
};
