/**
 * Main entry point for the hackathon project
 */

const express = require('express');
const DataProcessor = require('./dataProcessor');
const ApiClient = require('./apiClient');
const { validateEmail, calculateAverage, formatDate } = require('./utils');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize services
const dataProcessor = new DataProcessor();
const apiClient = new ApiClient();

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Hackathon Group 4 Project!',
    version: '1.0.0',
    endpoints: [
      'GET /',
      'GET /health',
      'POST /data',
      'GET /data',
      'GET /data/stats'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Data endpoints
app.post('/data', (req, res) => {
  try {
    const { email, score, name } = req.body;
    
    // Validate input
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({ error: 'Score must be a number between 0 and 100' });
    }
    
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Name is required and must be a string' });
    }
    
    // Add data
    dataProcessor.addData({ email, score, name });
    
    res.status(201).json({
      message: 'Data added successfully',
      count: dataProcessor.getCount()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/data', (req, res) => {
  try {
    const { sortBy, order } = req.query;
    let data = dataProcessor.getAllData();
    
    if (sortBy) {
      data = dataProcessor.sortData(sortBy, order);
    }
    
    res.json({
      data,
      count: data.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/data/stats', (req, res) => {
  try {
    const allData = dataProcessor.getAllData();
    const scores = allData.map(item => item.score);
    
    const stats = {
      totalItems: allData.length,
      averageScore: scores.length > 0 ? calculateAverage(scores) : 0,
      maxScore: scores.length > 0 ? Math.max(...scores) : 0,
      minScore: scores.length > 0 ? Math.min(...scores) : 0,
      lastUpdated: formatDate(new Date())
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server only if this file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;