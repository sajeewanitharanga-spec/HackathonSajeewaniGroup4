/**
 * Test cases for DataProcessor class
 */

const DataProcessor = require('../src/dataProcessor');

describe('DataProcessor', () => {
  let processor;

  beforeEach(() => {
    processor = new DataProcessor();
  });

  describe('constructor', () => {
    test('should initialize with empty data array', () => {
      expect(processor.getAllData()).toEqual([]);
      expect(processor.getCount()).toBe(0);
    });
  });

  describe('addData', () => {
    test('should add valid data item', () => {
      const item = { name: 'John', age: 30 };
      const result = processor.addData(item);
      
      expect(result).toBe(true);
      expect(processor.getCount()).toBe(1);
      
      const data = processor.getAllData();
      expect(data[0]).toMatchObject(item);
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('timestamp');
    });

    test('should add multiple data items', () => {
      processor.addData({ name: 'John', age: 30 });
      processor.addData({ name: 'Jane', age: 25 });
      
      expect(processor.getCount()).toBe(2);
    });

    test('should throw error for invalid data', () => {
      expect(() => processor.addData(null)).toThrow('Data item must be a valid object');
      expect(() => processor.addData(undefined)).toThrow('Data item must be a valid object');
      expect(() => processor.addData('string')).toThrow('Data item must be a valid object');
      expect(() => processor.addData(123)).toThrow('Data item must be a valid object');
    });

    test('should generate unique IDs for each item', () => {
      processor.addData({ name: 'John' });
      processor.addData({ name: 'Jane' });
      
      const data = processor.getAllData();
      expect(data[0].id).not.toBe(data[1].id);
    });

    test('should not modify original object', () => {
      const original = { name: 'John', age: 30 };
      processor.addData(original);
      
      expect(original).not.toHaveProperty('id');
      expect(original).not.toHaveProperty('timestamp');
    });
  });

  describe('getAllData', () => {
    test('should return copy of data array', () => {
      processor.addData({ name: 'John' });
      const data1 = processor.getAllData();
      const data2 = processor.getAllData();
      
      expect(data1).not.toBe(data2); // Different array references
      expect(data1).toEqual(data2); // Same content
    });
  });

  describe('filterData', () => {
    beforeEach(() => {
      processor.addData({ name: 'John', age: 30, city: 'NYC' });
      processor.addData({ name: 'Jane', age: 25, city: 'LA' });
      processor.addData({ name: 'Bob', age: 35, city: 'NYC' });
    });

    test('should filter data correctly', () => {
      const adults = processor.filterData(item => item.age >= 30);
      expect(adults).toHaveLength(2);
      expect(adults.every(item => item.age >= 30)).toBe(true);
    });

    test('should filter by string values', () => {
      const nycResidents = processor.filterData(item => item.city === 'NYC');
      expect(nycResidents).toHaveLength(2);
      expect(nycResidents.every(item => item.city === 'NYC')).toBe(true);
    });

    test('should return empty array when no matches', () => {
      const result = processor.filterData(item => item.age > 100);
      expect(result).toEqual([]);
    });

    test('should throw error for non-function predicate', () => {
      expect(() => processor.filterData('not-function')).toThrow('Predicate must be a function');
      expect(() => processor.filterData(null)).toThrow('Predicate must be a function');
    });
  });

  describe('sortData', () => {
    beforeEach(() => {
      processor.addData({ name: 'Charlie', age: 35 });
      processor.addData({ name: 'Alice', age: 25 });
      processor.addData({ name: 'Bob', age: 30 });
    });

    test('should sort data in ascending order by default', () => {
      const sorted = processor.sortData('age');
      expect(sorted.map(item => item.age)).toEqual([25, 30, 35]);
    });

    test('should sort data in descending order', () => {
      const sorted = processor.sortData('age', 'desc');
      expect(sorted.map(item => item.age)).toEqual([35, 30, 25]);
    });

    test('should sort by string field', () => {
      const sorted = processor.sortData('name');
      expect(sorted.map(item => item.name)).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    test('should not modify original data', () => {
      const originalFirst = processor.getAllData()[0];
      processor.sortData('age');
      expect(processor.getAllData()[0]).toBe(originalFirst);
    });

    test('should throw error for invalid field', () => {
      expect(() => processor.sortData(123)).toThrow('Field must be a string');
      expect(() => processor.sortData(null)).toThrow('Field must be a string');
    });

    test('should throw error for invalid order', () => {
      expect(() => processor.sortData('age', 'invalid')).toThrow('Order must be "asc" or "desc"');
    });
  });

  describe('clearData', () => {
    test('should clear all data', () => {
      processor.addData({ name: 'John' });
      processor.addData({ name: 'Jane' });
      
      expect(processor.getCount()).toBe(2);
      
      processor.clearData();
      
      expect(processor.getCount()).toBe(0);
      expect(processor.getAllData()).toEqual([]);
    });
  });

  describe('findById', () => {
    let testId;

    beforeEach(() => {
      processor.addData({ name: 'John', age: 30 });
      testId = processor.getAllData()[0].id;
    });

    test('should find data by valid ID', () => {
      const found = processor.findById(testId);
      expect(found).toMatchObject({ name: 'John', age: 30 });
      expect(found.id).toBe(testId);
    });

    test('should return null for non-existent ID', () => {
      const found = processor.findById('non-existent');
      expect(found).toBeNull();
    });

    test('should throw error for non-string ID', () => {
      expect(() => processor.findById(123)).toThrow('ID must be a string');
      expect(() => processor.findById(null)).toThrow('ID must be a string');
    });
  });

  describe('updateById', () => {
    let testId;

    beforeEach(() => {
      processor.addData({ name: 'John', age: 30 });
      testId = processor.getAllData()[0].id;
    });

    test('should update existing data', () => {
      const result = processor.updateById(testId, { age: 31, city: 'NYC' });
      
      expect(result).toBe(true);
      
      const updated = processor.findById(testId);
      expect(updated.age).toBe(31);
      expect(updated.city).toBe('NYC');
      expect(updated.name).toBe('John'); // Original field preserved
      expect(updated).toHaveProperty('updatedAt');
    });

    test('should return false for non-existent ID', () => {
      const result = processor.updateById('non-existent', { age: 31 });
      expect(result).toBe(false);
    });

    test('should throw error for invalid inputs', () => {
      expect(() => processor.updateById(123, {})).toThrow('ID must be a string');
      expect(() => processor.updateById(testId, null)).toThrow('Updates must be a valid object');
      expect(() => processor.updateById(testId, 'string')).toThrow('Updates must be a valid object');
    });
  });

  describe('removeById', () => {
    let testId;

    beforeEach(() => {
      processor.addData({ name: 'John', age: 30 });
      processor.addData({ name: 'Jane', age: 25 });
      testId = processor.getAllData()[0].id;
    });

    test('should remove existing data', () => {
      expect(processor.getCount()).toBe(2);
      
      const result = processor.removeById(testId);
      
      expect(result).toBe(true);
      expect(processor.getCount()).toBe(1);
      expect(processor.findById(testId)).toBeNull();
    });

    test('should return false for non-existent ID', () => {
      const result = processor.removeById('non-existent');
      expect(result).toBe(false);
      expect(processor.getCount()).toBe(2); // No change in count
    });

    test('should throw error for non-string ID', () => {
      expect(() => processor.removeById(123)).toThrow('ID must be a string');
      expect(() => processor.removeById(null)).toThrow('ID must be a string');
    });
  });

  describe('generateId', () => {
    test('should generate string IDs', () => {
      const id = processor.generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    test('should generate unique IDs', () => {
      const id1 = processor.generateId();
      const id2 = processor.generateId();
      expect(id1).not.toBe(id2);
    });
  });
});