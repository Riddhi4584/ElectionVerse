/**
 * Server-side validation utilities.
 */

export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  if (!password) return false;
  return password.length >= 6;
};

export const isNotEmpty = (value) => {
  if (value === undefined || value === null) return false;
  return String(value).trim().length > 0;
};
