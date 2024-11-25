const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const BaseService = require('./BaseService');
const IUserService = require('../interfaces/IUserService');

class UserService extends BaseService {
  constructor(dependencies = {}) {
    super(dependencies);
    this.userModel = dependencies.userModel || User;
    this.jwtSecret = dependencies.jwtSecret || process.env.JWT_SECRET;
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registered user details
   */
  async register(userData) {
    try {
      // Validate input
      if (!this.validate(userData, this.registrationSchema)) {
        throw new Error('Invalid user data');
      }

      const { username, password, email } = userData;
      
      // Check if user already exists
      const existingUser = await this.userModel.findOne({ 
        $or: [{ username }, { email }] 
      });

      if (existingUser) {
        throw new Error('Username or email already exists');
      }

      const user = new this.userModel({ 
        username, 
        password, // Let the model handle password hashing
        email 
      });

      await user.save();
      return { 
        message: 'User registered successfully', 
        userId: user._id 
      };
    } catch (error) {
      this.errorHandler(error);
      throw error; // Throw original error for more details
    }
  }

  /**
   * Authenticate user
   * @param {string} username - Username
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication result
   */
  async authenticate(username, password) {
    try {
      console.log(`Attempting to authenticate user: ${username}`);
      
      const user = await this.userModel.findOne({ username });

      if (!user) {
        console.log(`User not found: ${username}`);
        throw new Error('User not found');
      }

      console.log(`User found, comparing passwords`);
      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        console.log(`Invalid credentials for user: ${username}`);
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { id: user._id }, 
        this.jwtSecret, 
        { expiresIn: '1d' }
      );

      return { 
        message: 'Logged in successfully', 
        token,
        userId: user._id 
      };
    } catch (error) {
      console.error(`Authentication error: ${error.message}`);
      this.errorHandler(error);
      throw error; // Throw original error for more details
    }
  }

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile
   */
  async getUserProfile(userId) {
    try {
      const user = await this.userModel.findById(userId).select('-password');
      
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      this.errorHandler(error);
      throw new Error('Could not retrieve user profile');
    }
  }

  /**
   * Registration data validation schema
   */
  get registrationSchema() {
    return {
      username: (value) => value && value.length >= 3,
      email: (value) => /\S+@\S+\.\S+/.test(value),
      password: (value) => value && value.length >= 6
    };
  }
}

module.exports = UserService;