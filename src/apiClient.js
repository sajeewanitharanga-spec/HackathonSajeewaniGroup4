/**
 * API client for external requests
 */

const axios = require('axios');

/**
 * API Client class for making HTTP requests
 */
class ApiClient {
  constructor(baseURL = '', timeout = 5000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set authorization header
   * @param {string} token - Authorization token
   */
  setAuthToken(token) {
    if (typeof token !== 'string') {
      throw new Error('Token must be a string');
    }
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authorization header
   */
  removeAuthToken() {
    delete this.headers['Authorization'];
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  async get(endpoint, params = {}) {
    if (typeof endpoint !== 'string') {
      throw new Error('Endpoint must be a string');
    }

    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        params,
        headers: this.headers,
        timeout: this.timeout,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @returns {Promise} API response
   */
  async post(endpoint, data = {}) {
    if (typeof endpoint !== 'string') {
      throw new Error('Endpoint must be a string');
    }

    try {
      const response = await axios.post(`${this.baseURL}${endpoint}`, data, {
        headers: this.headers,
        timeout: this.timeout,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @returns {Promise} API response
   */
  async put(endpoint, data = {}) {
    if (typeof endpoint !== 'string') {
      throw new Error('Endpoint must be a string');
    }

    try {
      const response = await axios.put(`${this.baseURL}${endpoint}`, data, {
        headers: this.headers,
        timeout: this.timeout,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} API response
   */
  async delete(endpoint) {
    if (typeof endpoint !== 'string') {
      throw new Error('Endpoint must be a string');
    }

    try {
      const response = await axios.delete(`${this.baseURL}${endpoint}`, {
        headers: this.headers,
        timeout: this.timeout,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - Axios error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, statusText, data } = error.response;
      return new Error(`API Error ${status}: ${statusText} - ${JSON.stringify(data)}`);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network Error: No response received from server');
    } else {
      // Something else happened
      return new Error(`Request Error: ${error.message}`);
    }
  }

  /**
   * Check if API is healthy
   * @param {string} healthEndpoint - Health check endpoint
   * @returns {Promise<boolean>} True if API is healthy
   */
  async isHealthy(healthEndpoint = '/health') {
    try {
      await this.get(healthEndpoint);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = ApiClient;