/**
 * Example test cases demonstrating various testing patterns
 * This file shows different approaches to testing that can be used as reference
 */

describe('Testing Patterns Examples', () => {
  
  // Example 1: Basic assertion tests
  describe('Basic Assertions', () => {
    test('should demonstrate basic Jest matchers', () => {
      // Equality matchers
      expect(2 + 2).toBe(4);
      expect({ name: 'John' }).toEqual({ name: 'John' });
      
      // Truthiness matchers
      expect(true).toBeTruthy();
      expect(false).toBeFalsy();
      expect(null).toBeNull();
      expect(undefined).toBeUndefined();
      
      // Number matchers
      expect(10).toBeGreaterThan(5);
      expect(3.14).toBeCloseTo(3.1, 1);
      
      // String matchers
      expect('hello world').toMatch(/world/);
      expect('hello world').toContain('world');
      
      // Array matchers
      expect(['apple', 'banana', 'orange']).toContain('banana');
      expect([1, 2, 3]).toHaveLength(3);
    });
  });

  // Example 2: Error testing
  describe('Error Testing', () => {
    function throwError() {
      throw new Error('Something went wrong');
    }

    function throwSpecificError() {
      throw new Error('Specific error message');
    }

    test('should test functions that throw errors', () => {
      expect(throwError).toThrow();
      expect(throwError).toThrow('Something went wrong');
      expect(throwError).toThrow(/wrong/);
      expect(throwSpecificError).toThrow('Specific error message');
    });
  });

  // Example 3: Async testing patterns
  describe('Async Testing', () => {
    // Promise-based async function
    const fetchData = () => {
      return Promise.resolve('data received');
    };

    const fetchDataWithError = () => {
      return Promise.reject(new Error('Network error'));
    };

    test('should test promises with async/await', async () => {
      const data = await fetchData();
      expect(data).toBe('data received');
    });

    test('should test promise rejections', async () => {
      await expect(fetchDataWithError()).rejects.toThrow('Network error');
    });

    test('should test promises with .resolves matcher', () => {
      return expect(fetchData()).resolves.toBe('data received');
    });
  });

  // Example 4: Mock functions and spies
  describe('Mocking Examples', () => {
    test('should demonstrate mock functions', () => {
      const mockCallback = jest.fn();
      const mockFunction = jest.fn();
      
      // Setup mock return values
      mockFunction.mockReturnValue(42);
      mockFunction.mockReturnValueOnce(100);
      
      // Call the mocks
      mockCallback('arg1', 'arg2');
      const result1 = mockFunction();
      const result2 = mockFunction();
      
      // Verify mock calls
      expect(mockCallback).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith('arg1', 'arg2');
      expect(mockCallback).toHaveBeenCalledTimes(1);
      
      // Verify mock return values
      expect(result1).toBe(100); // First call returns mockReturnValueOnce
      expect(result2).toBe(42);  // Subsequent calls return mockReturnValue
    });

    test('should demonstrate spying on object methods', () => {
      const calculator = {
        add: (a, b) => a + b,
        multiply: (a, b) => a * b
      };

      const addSpy = jest.spyOn(calculator, 'add');
      const multiplySpy = jest.spyOn(calculator, 'multiply');

      // Use the methods
      const sum = calculator.add(2, 3);
      const product = calculator.multiply(4, 5);

      // Verify the spies
      expect(addSpy).toHaveBeenCalledWith(2, 3);
      expect(multiplySpy).toHaveBeenCalledWith(4, 5);
      expect(sum).toBe(5);
      expect(product).toBe(20);

      // Restore original methods
      addSpy.mockRestore();
      multiplySpy.mockRestore();
    });
  });

  // Example 5: Setup and teardown
  describe('Setup and Teardown Examples', () => {
    let testData;

    beforeAll(() => {
      // Runs once before all tests in this describe block
      console.log('Setting up test suite');
    });

    beforeEach(() => {
      // Runs before each test
      testData = { count: 0, items: [] };
    });

    afterEach(() => {
      // Runs after each test
      testData = null;
    });

    afterAll(() => {
      // Runs once after all tests in this describe block
      console.log('Cleaning up test suite');
    });

    test('should have fresh test data', () => {
      expect(testData.count).toBe(0);
      expect(testData.items).toEqual([]);
      
      // Modify test data
      testData.count = 1;
      testData.items.push('test');
    });

    test('should have fresh test data again', () => {
      // This proves beforeEach resets the data
      expect(testData.count).toBe(0);
      expect(testData.items).toEqual([]);
    });
  });

  // Example 6: Parameterized tests
  describe('Parameterized Testing', () => {
    test.each([
      [1, 1, 2],
      [2, 2, 4],
      [3, 3, 6],
      [5, 5, 10]
    ])('should add %i + %i to equal %i', (a, b, expected) => {
      expect(a + b).toBe(expected);
    });

    test.each([
      { input: 'test@example.com', expected: true },
      { input: 'invalid-email', expected: false },
      { input: 'user@domain.org', expected: true },
      { input: '@invalid.com', expected: false }
    ])('should validate email: $input -> $expected', ({ input, expected }) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(input)).toBe(expected);
    });
  });

  // Example 7: Conditional tests
  describe('Conditional Testing', () => {
    const isNodeEnvironment = typeof process !== 'undefined';
    
    test.skip('should demonstrate skipped test', () => {
      // This test will be skipped
      expect(false).toBe(true);
    });

    if (isNodeEnvironment) {
      test('should only run in Node.js environment', () => {
        expect(process.version).toBeDefined();
      });
    }

    test('should run in any environment', () => {
      expect(true).toBe(true);
    });
  });

  // Example 8: Custom matchers example
  describe('Custom Matchers', () => {
    // This would typically be in a setup file
    expect.extend({
      toBeWithinRange(received, floor, ceiling) {
        const pass = received >= floor && received <= ceiling;
        if (pass) {
          return {
            message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
            pass: true,
          };
        } else {
          return {
            message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
            pass: false,
          };
        }
      },
    });

    test('should use custom matcher', () => {
      expect(100).toBeWithinRange(50, 150);
      expect(25).not.toBeWithinRange(50, 150);
    });
  });
});