/**
 * Integration tests for the Express application
 */

const request = require('supertest');
const app = require('../src/index');

describe('Express App Integration Tests', () => {
  describe('GET /', () => {
    test('should return welcome message and endpoints', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        message: 'Welcome to Hackathon Group 4 Project!',
        version: '1.0.0',
        endpoints: expect.arrayContaining([
          'GET /',
          'GET /health',
          'POST /data',
          'GET /data',
          'GET /data/stats'
        ])
      });
    });
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'healthy',
        timestamp: expect.any(String),
        uptime: expect.any(Number)
      });
    });

    test('should return valid ISO timestamp', async () => {
      const response = await request(app).get('/health');
      
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.toISOString()).toBe(response.body.timestamp);
    });
  });

  describe('POST /data', () => {
    test('should accept valid data', async () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        score: 85
      };

      const response = await request(app)
        .post('/data')
        .send(validData);
      
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        message: 'Data added successfully',
        count: expect.any(Number)
      });
    });

    test('should reject invalid email', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        score: 85
      };

      const response = await request(app)
        .post('/data')
        .send(invalidData);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Valid email is required');
    });

    test('should reject missing email', async () => {
      const invalidData = {
        name: 'John Doe',
        score: 85
      };

      const response = await request(app)
        .post('/data')
        .send(invalidData);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Valid email is required');
    });

    test('should reject invalid score (too high)', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        score: 150
      };

      const response = await request(app)
        .post('/data')
        .send(invalidData);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Score must be a number between 0 and 100');
    });

    test('should reject invalid score (negative)', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        score: -10
      };

      const response = await request(app)
        .post('/data')
        .send(invalidData);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Score must be a number between 0 and 100');
    });

    test('should reject non-numeric score', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        score: 'not-a-number'
      };

      const response = await request(app)
        .post('/data')
        .send(invalidData);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Score must be a number between 0 and 100');
    });

    test('should reject missing name', async () => {
      const invalidData = {
        email: 'john@example.com',
        score: 85
      };

      const response = await request(app)
        .post('/data')
        .send(invalidData);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Name is required and must be a string');
    });

    test('should reject non-string name', async () => {
      const invalidData = {
        name: 123,
        email: 'john@example.com',
        score: 85
      };

      const response = await request(app)
        .post('/data')
        .send(invalidData);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Name is required and must be a string');
    });
  });

  describe('GET /data', () => {
    beforeEach(async () => {
      // Add some test data
      await request(app)
        .post('/data')
        .send({ name: 'Alice', email: 'alice@example.com', score: 90 });
      
      await request(app)
        .post('/data')
        .send({ name: 'Bob', email: 'bob@example.com', score: 75 });
    });

    test('should return all data', async () => {
      const response = await request(app).get('/data');
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        data: expect.any(Array),
        count: expect.any(Number)
      });
      expect(response.body.count).toBeGreaterThanOrEqual(2);
    });

    test('should return data with correct structure', async () => {
      const response = await request(app).get('/data');
      
      const firstItem = response.body.data[0];
      expect(firstItem).toMatchObject({
        name: expect.any(String),
        email: expect.any(String),
        score: expect.any(Number),
        id: expect.any(String),
        timestamp: expect.any(String)
      });
    });

    test('should support sorting by score', async () => {
      const response = await request(app)
        .get('/data')
        .query({ sortBy: 'score', order: 'asc' });
      
      expect(response.status).toBe(200);
      const scores = response.body.data.map(item => item.score);
      const sortedScores = [...scores].sort((a, b) => a - b);
      expect(scores).toEqual(sortedScores);
    });

    test('should support sorting by name in descending order', async () => {
      const response = await request(app)
        .get('/data')
        .query({ sortBy: 'name', order: 'desc' });
      
      expect(response.status).toBe(200);
      const names = response.body.data.map(item => item.name);
      const sortedNames = [...names].sort().reverse();
      expect(names).toEqual(sortedNames);
    });
  });

  describe('GET /data/stats', () => {
    beforeEach(async () => {
      // Add test data with known scores
      await request(app)
        .post('/data')
        .send({ name: 'Test1', email: 'test1@example.com', score: 80 });
      
      await request(app)
        .post('/data')
        .send({ name: 'Test2', email: 'test2@example.com', score: 90 });
      
      await request(app)
        .post('/data')
        .send({ name: 'Test3', email: 'test3@example.com', score: 70 });
    });

    test('should return correct statistics', async () => {
      const response = await request(app).get('/data/stats');
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        totalItems: expect.any(Number),
        averageScore: expect.any(Number),
        maxScore: expect.any(Number),
        minScore: expect.any(Number),
        lastUpdated: expect.any(String)
      });
      
      expect(response.body.totalItems).toBeGreaterThanOrEqual(3);
      expect(response.body.maxScore).toBeGreaterThanOrEqual(90);
      expect(response.body.minScore).toBeLessThanOrEqual(70);
    });

    test('should return valid date format', async () => {
      const response = await request(app).get('/data/stats');
      
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      expect(response.body.lastUpdated).toMatch(dateRegex);
    });

    test('should calculate average correctly', async () => {
      // Clear data and add specific scores
      const response = await request(app).get('/data/stats');
      
      expect(response.body.averageScore).toBeGreaterThan(0);
      expect(response.body.averageScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Error handling', () => {
    test('should handle 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');
      
      expect(response.status).toBe(404);
    });

    test('should handle malformed JSON in POST requests', async () => {
      const response = await request(app)
        .post('/data')
        .type('json')
        .send('{"invalid": json}');
      
      expect(response.status).toBe(400);
    });
  });

  describe('API endpoints integration', () => {
    test('should handle complete data flow', async () => {
      // 1. Check initial stats
      const initialStats = await request(app).get('/data/stats');
      const initialCount = initialStats.body.totalItems;
      
      // 2. Add new data
      const newData = {
        name: 'Integration Test',
        email: 'integration@test.com',
        score: 95
      };
      
      const addResponse = await request(app)
        .post('/data')
        .send(newData);
      
      expect(addResponse.status).toBe(201);
      expect(addResponse.body.count).toBe(initialCount + 1);
      
      // 3. Verify data was added
      const dataResponse = await request(app).get('/data');
      expect(dataResponse.body.count).toBe(initialCount + 1);
      
      const addedItem = dataResponse.body.data.find(
        item => item.email === 'integration@test.com'
      );
      expect(addedItem).toBeDefined();
      expect(addedItem.name).toBe('Integration Test');
      expect(addedItem.score).toBe(95);
      
      // 4. Check updated stats
      const updatedStats = await request(app).get('/data/stats');
      expect(updatedStats.body.totalItems).toBe(initialCount + 1);
      expect(updatedStats.body.maxScore).toBeGreaterThanOrEqual(95);
    });
  });
});