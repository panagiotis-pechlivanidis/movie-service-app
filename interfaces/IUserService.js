/**
 * Interface for User Service
 * Defines the contract for user-related operations
 */
class IUserService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registered user details
   */
  async register(userData) {
    throw new Error('Method not implemented');
  }

  /**
   * Authenticate user credentials
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<Object>} Authentication result
   */
  async authenticate(username, password) {
    throw new Error('Method not implemented');
  }

  /**
   * Get user profile
   * @param {string} userId - User's unique identifier
   * @returns {Promise<Object>} User profile details
   */
  async getProfile(userId) {
    throw new Error('Method not implemented');
  }
}

module.exports = IUserService;
