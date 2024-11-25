const UserService = require('../services/UserService');

class AuthController {
  constructor(dependencies = {}) {
    this.userService = dependencies.userService || new UserService();
    
    // Bind methods to ensure correct context
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.logout = this.logout.bind(this);
    this.profile = this.profile.bind(this);
  }

  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async register(req, res) {
    try {
      const result = await this.userService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ 
        error: 'Registration failed', 
        details: error.message 
      });
    }
  }

  /**
   * Authenticate user login
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      // Log input for debugging
      console.log('Login attempt:', { username });

      const result = await this.userService.authenticate(username, password);
      
      // Set secure HTTP-only cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ 
        error: 'Authentication failed', 
        details: error.message 
      });
    }
  }

  /**
   * Logout user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  logout(req, res) {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  }

  /**
   * Get user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async profile(req, res) {
    try {
      const userId = req.user.id; // Assumes authentication middleware sets this
      const profile = await this.userService.getUserProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error('Profile retrieval error:', error);
      res.status(404).json({ 
        error: 'Profile not found', 
        details: error.message 
      });
    }
  }
}

module.exports = new AuthController();
