/**
 * Utility functions for the hackathon project
 */

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
function validateEmail(email) {
  if (typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Calculates the average of an array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} The average value
 */
function calculateAverage(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('Input must be a non-empty array of numbers');
  }
  
  if (!numbers.every(num => typeof num === 'number' && !isNaN(num))) {
    throw new Error('All elements must be valid numbers');
  }
  
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

/**
 * Formats a date to YYYY-MM-DD format
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error('Input must be a valid Date object');
  }
  
  return date.toISOString().split('T')[0];
}

/**
 * Generates a random string of specified length
 * @param {number} length - Length of the random string
 * @returns {string} Random string
 */
function generateRandomString(length = 10) {
  if (typeof length !== 'number' || length < 1) {
    throw new Error('Length must be a positive number');
  }
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Debounce function to limit the rate of function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
  if (typeof func !== 'function') {
    throw new Error('First argument must be a function');
  }
  
  if (typeof delay !== 'number' || delay < 0) {
    throw new Error('Delay must be a non-negative number');
  }
  
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

module.exports = {
  validateEmail,
  calculateAverage,
  formatDate,
  generateRandomString,
  debounce
};