// Base Service with Dependency Injection
class BaseService {
  /**
   * Constructor with dependency injection
   * @param {Object} dependencies - Service dependencies
   */
  constructor(dependencies = {}) {
    this.logger = dependencies.logger || console;
    this.errorHandler = dependencies.errorHandler || this.defaultErrorHandler;
  }

  /**
   * Default error handler
   * @param {Error} error - Error object
   */
  defaultErrorHandler(error) {
    this.logger.error(`Unhandled error: ${error.message}`);
    throw error;
  }

  /**
   * Validate input data
   * @param {Object} data - Data to validate
   * @param {Object} schema - Validation schema
   * @returns {boolean} Validation result
   */
  validate(data, schema) {
    // Implement validation logic
    return true;
  }
}

module.exports = BaseService;
