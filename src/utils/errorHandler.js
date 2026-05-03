/**
 * Centralized error handler for parsing API responses into user-friendly messages.
 */

/**
 * Parses an error from an API response or generic Error object.
 * @param {Error|any} error - The error to parse.
 * @returns {string} A user-friendly error message.
 */
export const parseError = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle Axios/Fetch custom structured errors
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};
