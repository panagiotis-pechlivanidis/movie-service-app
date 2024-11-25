const jwt = require('jsonwebtoken');
const AppConfig = require('../config/AppConfig');

class AuthMiddleware {
  constructor(dependencies = {}) {
    this.jwtSecret = dependencies.jwtSecret || process.env.JWT_SECRET;
    this.logger = dependencies.logger || console;

    // Bind methods to ensure correct context
    this.authenticate = this.authenticate.bind(this);
    this.extractToken = this.extractToken.bind(this);
    this.generateToken = this.generateToken.bind(this);
    this.checkRoles = this.checkRoles.bind(this);
  }

  /**
   * Authenticate token middleware
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Next middleware function
   */
  authenticate(req, res, next) {
    // Skip authentication for certain routes if needed
    const publicRoutes = ['/api/auth/login', '/api/auth/register'];
    if (publicRoutes.includes(req.path)) {
      return next();
    }

    const token = this.extractToken(req);

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      req.user = decoded;
      next();
    } catch (error) {
      this.logger.error('Token verification error:', error);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
  }

  /**
   * Extract token from request
   * @param {Object} req - Express request object
   * @returns {string|null} Extracted token or null
   */
  extractToken(req) {
    // Check Authorization header
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      return authHeader.split(' ')[1];
    }

    // Check cookies
    return req.cookies?.token;
  }

  /**
   * Create a new token
   * @param {Object} payload - Token payload
   * @returns {string} Generated JWT token
   */
  generateToken(payload) {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: '1h', // Token expires in 1 hour
      algorithm: 'HS256'
    });
  }

  /**
   * Middleware to check user roles/permissions
   * @param {string[]} allowedRoles - Roles allowed to access the route
   */
  checkRoles(allowedRoles) {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    };
  }
}

module.exports = new AuthMiddleware();
