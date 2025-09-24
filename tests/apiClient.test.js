/**
 * Test cases for ApiClient class
 */

const axios = require('axios');
const ApiClient = require('../src/apiClient');

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('ApiClient', () => {
  let client;

  beforeEach(() => {
    client = new ApiClient('https://api.example.com', 3000);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should initialize with default values', () => {
      const defaultClient = new ApiClient();
      expect(defaultClient.baseURL).toBe('');
      expect(defaultClient.timeout).toBe(5000);
      expect(defaultClient.headers).toEqual({
        'Content-Type': 'application/json',
      });
    });

    test('should initialize with custom values', () => {
      expect(client.baseURL).toBe('https://api.example.com');
      expect(client.timeout).toBe(3000);
    });
  });

  describe('setAuthToken', () => {
    test('should set authorization header', () => {
      client.setAuthToken('test-token');
      expect(client.headers['Authorization']).toBe('Bearer test-token');
    });

    test('should throw error for non-string token', () => {
      expect(() => client.setAuthToken(123)).toThrow('Token must be a string');
      expect(() => client.setAuthToken(null)).toThrow('Token must be a string');
    });
  });

  describe('removeAuthToken', () => {
    test('should remove authorization header', () => {
      client.setAuthToken('test-token');
      expect(client.headers['Authorization']).toBe('Bearer test-token');
      
      client.removeAuthToken();
      expect(client.headers['Authorization']).toBeUndefined();
    });
  });

  describe('get', () => {
    test('should make GET request successfully', async () => {
      const mockResponse = { data: { message: 'success' } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await client.get('/users', { page: 1 });

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.example.com/users', {
        params: { page: 1 },
        headers: client.headers,
        timeout: 3000,
      });
      expect(result).toEqual({ message: 'success' });
    });

    test('should make GET request without params', async () => {
      const mockResponse = { data: { message: 'success' } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      await client.get('/users');

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.example.com/users', {
        params: {},
        headers: client.headers,
        timeout: 3000,
      });
    });

    test('should throw error for non-string endpoint', async () => {
      await expect(client.get(123)).rejects.toThrow('Endpoint must be a string');
    });

    test('should handle axios errors', async () => {
      const axiosError = {
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { error: 'User not found' }
        }
      };
      mockedAxios.get.mockRejectedValue(axiosError);

      await expect(client.get('/users/999')).rejects.toThrow(
        'API Error 404: Not Found - {"error":"User not found"}'
      );
    });
  });

  describe('post', () => {
    test('should make POST request successfully', async () => {
      const mockResponse = { data: { id: 1, message: 'created' } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const data = { name: 'John', email: 'john@example.com' };
      const result = await client.post('/users', data);

      expect(mockedAxios.post).toHaveBeenCalledWith('https://api.example.com/users', data, {
        headers: client.headers,
        timeout: 3000,
      });
      expect(result).toEqual({ id: 1, message: 'created' });
    });

    test('should make POST request without data', async () => {
      const mockResponse = { data: { message: 'success' } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      await client.post('/endpoint');

      expect(mockedAxios.post).toHaveBeenCalledWith('https://api.example.com/endpoint', {}, {
        headers: client.headers,
        timeout: 3000,
      });
    });

    test('should throw error for non-string endpoint', async () => {
      await expect(client.post(null, {})).rejects.toThrow('Endpoint must be a string');
    });
  });

  describe('put', () => {
    test('should make PUT request successfully', async () => {
      const mockResponse = { data: { id: 1, message: 'updated' } };
      mockedAxios.put.mockResolvedValue(mockResponse);

      const data = { name: 'John Updated' };
      const result = await client.put('/users/1', data);

      expect(mockedAxios.put).toHaveBeenCalledWith('https://api.example.com/users/1', data, {
        headers: client.headers,
        timeout: 3000,
      });
      expect(result).toEqual({ id: 1, message: 'updated' });
    });

    test('should throw error for non-string endpoint', async () => {
      await expect(client.put(undefined, {})).rejects.toThrow('Endpoint must be a string');
    });
  });

  describe('delete', () => {
    test('should make DELETE request successfully', async () => {
      const mockResponse = { data: { message: 'deleted' } };
      mockedAxios.delete.mockResolvedValue(mockResponse);

      const result = await client.delete('/users/1');

      expect(mockedAxios.delete).toHaveBeenCalledWith('https://api.example.com/users/1', {
        headers: client.headers,
        timeout: 3000,
      });
      expect(result).toEqual({ message: 'deleted' });
    });

    test('should throw error for non-string endpoint', async () => {
      await expect(client.delete([])).rejects.toThrow('Endpoint must be a string');
    });
  });

  describe('handleError', () => {
    test('should handle response errors', () => {
      const axiosError = {
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: { error: 'Database connection failed' }
        }
      };

      const error = client.handleError(axiosError);
      expect(error.message).toBe('API Error 500: Internal Server Error - {"error":"Database connection failed"}');
    });

    test('should handle request errors (no response)', () => {
      const axiosError = {
        request: {}
      };

      const error = client.handleError(axiosError);
      expect(error.message).toBe('Network Error: No response received from server');
    });

    test('should handle other errors', () => {
      const axiosError = {
        message: 'Something went wrong'
      };

      const error = client.handleError(axiosError);
      expect(error.message).toBe('Request Error: Something went wrong');
    });
  });

  describe('isHealthy', () => {
    test('should return true when health check passes', async () => {
      const mockResponse = { data: { status: 'healthy' } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await client.isHealthy();

      expect(result).toBe(true);
      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.example.com/health', {
        params: {},
        headers: client.headers,
        timeout: 3000,
      });
    });

    test('should return false when health check fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      const result = await client.isHealthy();

      expect(result).toBe(false);
    });

    test('should use custom health endpoint', async () => {
      const mockResponse = { data: { status: 'ok' } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      await client.isHealthy('/status');

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.example.com/status', {
        params: {},
        headers: client.headers,
        timeout: 3000,
      });
    });
  });

  describe('integration with auth token', () => {
    test('should include auth token in requests', async () => {
      const mockResponse = { data: { message: 'success' } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      client.setAuthToken('my-secret-token');
      await client.get('/protected');

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.example.com/protected', {
        params: {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer my-secret-token'
        },
        timeout: 3000,
      });
    });
  });
});