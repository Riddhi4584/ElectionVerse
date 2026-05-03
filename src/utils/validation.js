/**
 * Reusable validation functions for the application.
 * Shared between frontend components for input validation.
 */

/**
 * Validates an email address format.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if the email format is valid.
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password's strength.
 * Requires minimum 6 characters.
 * @param {string} password - The password to validate.
 * @returns {boolean} True if password meets criteria.
 */
export const isValidPassword = (password) => {
  if (!password) return false;
  return password.length >= 6;
};

/**
 * Checks if a string is empty or contains only whitespace.
 * @param {string} value - The string to check.
 * @returns {boolean} True if the value is valid (not empty).
 */
export const isNotEmpty = (value) => {
  if (value === undefined || value === null) return false;
  return String(value).trim().length > 0;
};
