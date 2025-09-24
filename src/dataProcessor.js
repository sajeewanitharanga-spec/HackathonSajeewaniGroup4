/**
 * Data processing functions for hackathon project
 */

/**
 * User data processor class
 */
class DataProcessor {
  constructor() {
    this.data = [];
  }

  /**
   * Add data to the processor
   * @param {Object} item - Data item to add
   * @returns {boolean} True if added successfully
   */
  addData(item) {
    if (!item || typeof item !== 'object') {
      throw new Error('Data item must be a valid object');
    }
    
    this.data.push({ ...item, id: this.generateId(), timestamp: new Date() });
    return true;
  }

  /**
   * Get all data
   * @returns {Array} Array of data items
   */
  getAllData() {
    return [...this.data];
  }

  /**
   * Filter data by a predicate function
   * @param {Function} predicate - Filter function
   * @returns {Array} Filtered data
   */
  filterData(predicate) {
    if (typeof predicate !== 'function') {
      throw new Error('Predicate must be a function');
    }
    
    return this.data.filter(predicate);
  }

  /**
   * Sort data by a field
   * @param {string} field - Field to sort by
   * @param {string} order - 'asc' or 'desc'
   * @returns {Array} Sorted data
   */
  sortData(field, order = 'asc') {
    if (typeof field !== 'string') {
      throw new Error('Field must be a string');
    }
    
    if (!['asc', 'desc'].includes(order)) {
      throw new Error('Order must be "asc" or "desc"');
    }
    
    return [...this.data].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /**
   * Get data count
   * @returns {number} Number of data items
   */
  getCount() {
    return this.data.length;
  }

  /**
   * Clear all data
   */
  clearData() {
    this.data = [];
  }

  /**
   * Generate a unique ID
   * @returns {string} Unique identifier
   */
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Find data by ID
   * @param {string} id - ID to search for
   * @returns {Object|null} Found data item or null
   */
  findById(id) {
    if (typeof id !== 'string') {
      throw new Error('ID must be a string');
    }
    
    return this.data.find(item => item.id === id) || null;
  }

  /**
   * Update data by ID
   * @param {string} id - ID of item to update
   * @param {Object} updates - Updates to apply
   * @returns {boolean} True if updated successfully
   */
  updateById(id, updates) {
    if (typeof id !== 'string') {
      throw new Error('ID must be a string');
    }
    
    if (!updates || typeof updates !== 'object') {
      throw new Error('Updates must be a valid object');
    }
    
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      return false;
    }
    
    this.data[index] = { ...this.data[index], ...updates, updatedAt: new Date() };
    return true;
  }

  /**
   * Remove data by ID
   * @param {string} id - ID of item to remove
   * @returns {boolean} True if removed successfully
   */
  removeById(id) {
    if (typeof id !== 'string') {
      throw new Error('ID must be a string');
    }
    
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      return false;
    }
    
    this.data.splice(index, 1);
    return true;
  }
}

module.exports = DataProcessor;