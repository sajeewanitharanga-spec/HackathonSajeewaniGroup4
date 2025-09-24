/**
 * Test cases for utility functions
 */

const {
  validateEmail,
  calculateAverage,
  formatDate,
  generateRandomString,
  debounce
} = require('../src/utils');

describe('validateEmail', () => {
  test('should return true for valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    expect(validateEmail('simple@test.org')).toBe(true);
  });

  test('should return false for invalid email addresses', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('test.example.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  test('should return false for non-string inputs', () => {
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(undefined)).toBe(false);
    expect(validateEmail(123)).toBe(false);
    expect(validateEmail({})).toBe(false);
    expect(validateEmail([])).toBe(false);
  });
});

describe('calculateAverage', () => {
  test('should calculate average correctly for positive numbers', () => {
    expect(calculateAverage([1, 2, 3, 4, 5])).toBe(3);
    expect(calculateAverage([10, 20, 30])).toBe(20);
    expect(calculateAverage([1])).toBe(1);
  });

  test('should calculate average correctly for negative numbers', () => {
    expect(calculateAverage([-1, -2, -3])).toBe(-2);
    expect(calculateAverage([-5, 5])).toBe(0);
  });

  test('should calculate average correctly for decimal numbers', () => {
    expect(calculateAverage([1.5, 2.5, 3.5])).toBe(2.5);
    expect(calculateAverage([0.1, 0.2, 0.3])).toBeCloseTo(0.2, 1);
  });

  test('should throw error for invalid inputs', () => {
    expect(() => calculateAverage([])).toThrow('Input must be a non-empty array of numbers');
    expect(() => calculateAverage(null)).toThrow('Input must be a non-empty array of numbers');
    expect(() => calculateAverage('not-array')).toThrow('Input must be a non-empty array of numbers');
    expect(() => calculateAverage([1, 'not-number', 3])).toThrow('All elements must be valid numbers');
    expect(() => calculateAverage([1, NaN, 3])).toThrow('All elements must be valid numbers');
  });
});

describe('formatDate', () => {
  test('should format valid dates correctly', () => {
    const date = new Date('2023-12-25T10:30:00Z');
    expect(formatDate(date)).toBe('2023-12-25');
    
    const date2 = new Date('2024-01-01T00:00:00Z');
    expect(formatDate(date2)).toBe('2024-01-01');
  });

  test('should throw error for invalid dates', () => {
    expect(() => formatDate(new Date('invalid'))).toThrow('Input must be a valid Date object');
    expect(() => formatDate('2023-12-25')).toThrow('Input must be a valid Date object');
    expect(() => formatDate(null)).toThrow('Input must be a valid Date object');
    expect(() => formatDate(undefined)).toThrow('Input must be a valid Date object');
    expect(() => formatDate(123)).toThrow('Input must be a valid Date object');
  });
});

describe('generateRandomString', () => {
  test('should generate string of correct length', () => {
    expect(generateRandomString(5)).toHaveLength(5);
    expect(generateRandomString(10)).toHaveLength(10);
    expect(generateRandomString(1)).toHaveLength(1);
  });

  test('should generate different strings on multiple calls', () => {
    const str1 = generateRandomString(10);
    const str2 = generateRandomString(10);
    expect(str1).not.toBe(str2);
  });

  test('should use default length when no parameter provided', () => {
    expect(generateRandomString()).toHaveLength(10);
  });

  test('should only contain valid characters', () => {
    const str = generateRandomString(100);
    const validChars = /^[A-Za-z0-9]+$/;
    expect(validChars.test(str)).toBe(true);
  });

  test('should throw error for invalid length', () => {
    expect(() => generateRandomString(0)).toThrow('Length must be a positive number');
    expect(() => generateRandomString(-1)).toThrow('Length must be a positive number');
    expect(() => generateRandomString('not-number')).toThrow('Length must be a positive number');
  });
});

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should delay function execution', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('should reset timer on multiple calls', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    jest.advanceTimersByTime(50);
    debouncedFn();
    jest.advanceTimersByTime(50);
    
    expect(mockFn).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('should pass arguments correctly', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('arg1', 'arg2');
    jest.advanceTimersByTime(100);
    
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  test('should throw error for invalid function', () => {
    expect(() => debounce('not-function', 100)).toThrow('First argument must be a function');
    expect(() => debounce(null, 100)).toThrow('First argument must be a function');
  });

  test('should throw error for invalid delay', () => {
    const mockFn = jest.fn();
    expect(() => debounce(mockFn, -1)).toThrow('Delay must be a non-negative number');
    expect(() => debounce(mockFn, 'not-number')).toThrow('Delay must be a non-negative number');
  });
});