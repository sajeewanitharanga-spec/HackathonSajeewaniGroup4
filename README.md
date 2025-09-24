# HackathonSajeewaniGroup4

A comprehensive Node.js hackathon project with extensive test coverage and modern development practices.

## 🚀 Features

- **RESTful API** with Express.js
- **Data Processing** capabilities with CRUD operations
- **HTTP Client** with error handling and authentication
- **Utility Functions** for common tasks
- **Comprehensive Test Suite** with 97%+ coverage
- **Modern JavaScript** with ES6+ features

## 📁 Project Structure

```
├── src/
│   ├── index.js          # Main Express application
│   ├── dataProcessor.js  # Data processing class
│   ├── apiClient.js      # HTTP client for external APIs
│   └── utils.js          # Utility functions
├── tests/
│   ├── app.test.js           # Integration tests
│   ├── dataProcessor.test.js # Unit tests for data processor
│   ├── apiClient.test.js     # Unit tests for API client
│   └── utils.test.js         # Unit tests for utilities
├── package.json
└── README.md
```

## 🧪 Testing

This project features comprehensive test coverage with multiple types of tests:

### Test Types

1. **Unit Tests** - Test individual functions and classes in isolation
   - `utils.test.js` - 35 tests for utility functions
   - `dataProcessor.test.js` - 33 tests for data processing
   - `apiClient.test.js` - 24 tests for HTTP client

2. **Integration Tests** - Test complete API workflows
   - `app.test.js` - 19 tests for Express routes and middleware

### Test Coverage

- **92 total tests** across 4 test suites
- **97.54% statement coverage**
- **98.75% branch coverage**
- **100% function coverage**

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## 🛠 Development

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd HackathonSajeewaniGroup4

# Install dependencies
npm install
```

### Available Scripts

```bash
# Start the application
npm start

# Start in development mode with auto-reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📡 API Endpoints

### Core Endpoints

- `GET /` - Welcome message and API information
- `GET /health` - Health check endpoint
- `POST /data` - Add new data entry
- `GET /data` - Retrieve all data with optional sorting
- `GET /data/stats` - Get statistical analysis of data

### Example Usage

```bash
# Health check
curl http://localhost:3000/health

# Add data
curl -X POST http://localhost:3000/data \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","score":85}'

# Get all data
curl http://localhost:3000/data

# Get data with sorting
curl "http://localhost:3000/data?sortBy=score&order=desc"

# Get statistics
curl http://localhost:3000/data/stats
```

## 🏗 Architecture

### Core Components

1. **Utils (`src/utils.js`)**
   - Email validation
   - Average calculation
   - Date formatting
   - Random string generation
   - Debounce function

2. **Data Processor (`src/dataProcessor.js`)**
   - CRUD operations
   - Data filtering and sorting
   - ID generation and management
   - In-memory data storage

3. **API Client (`src/apiClient.js`)**
   - HTTP methods (GET, POST, PUT, DELETE)
   - Authentication handling
   - Error management
   - Health checks

4. **Express App (`src/index.js`)**
   - RESTful API routes
   - Request validation
   - Error handling
   - JSON middleware

## 🎯 Test Examples

### Unit Test Example (Email Validation)

```javascript
describe('validateEmail', () => {
  test('should return true for valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
  });

  test('should return false for invalid email addresses', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
  });
});
```

### Integration Test Example (API Endpoint)

```javascript
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
    expect(response.body.message).toBe('Data added successfully');
  });
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📊 Test Coverage Details

- **Boundary Testing** - Tests edge cases and invalid inputs
- **Error Handling** - Comprehensive error scenario testing  
- **Integration Testing** - Full API workflow testing
- **Mocking** - External dependencies properly mocked
- **Async Testing** - Proper handling of promises and async operations

## 🎉 Hackathon Ready

This project provides a solid foundation for hackathon development with:

- ✅ Comprehensive test suite already in place
- ✅ Modern development practices
- ✅ API-first architecture
- ✅ Easy to extend and modify
- ✅ Well-documented codebase
- ✅ Production-ready error handling