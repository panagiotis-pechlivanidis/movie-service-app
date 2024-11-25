const OMDBService = require('../services/omdbService');
const logger = require('../utils/logger');

class MovieController {
  constructor(dependencies = {}) {
    this.omdbService = dependencies.omdbService || OMDBService;
    this.logger = dependencies.logger || logger;
  }

  /**
   * Search movies by title
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchMovies(req, res) {
    try {
      this.logger.debug('FULL REQUEST DETAILS:', {
        query: req.query,
        headers: req.headers,
        method: req.method,
      });

      const { query } = req.query;
      this.logger.info('Movie search request received:', { query });

      if (!query) {
        return res.status(400).json({ 
          message: 'Search query is required',
          count: 0,
          movies: [] 
        });
      }

      const movies = await this.omdbService.searchMovies(query);
      
      this.logger.info('Movie search results:', {
        count: movies.length,
        movies
      });

      res.json({
        count: movies.length,
        movies
      });
    } catch (error) {
      this.logger.error('Movie search error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });

      this.logger.error('Movie search error:', error);
      res.status(500).json({ 
        message: 'Error searching movies', 
        error: {
          name: error.name,
          message: process.env.NODE_ENV !== 'production' ? error.message : 'An unexpected error occurred'
        }
      });
    }
  }

  /**
   * Get details for a single movie
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMovie(req, res) {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ 
          message: 'Movie ID is required' 
        });
      }

      const movie = await this.omdbService.getMovieDetails(id);
      
      if (!movie) {
        return res.status(404).json({ 
          message: 'Movie not found' 
        });
      }

      res.json(movie);
    } catch (error) {
      this.logger.error('Get movie error:', error);
      res.status(500).json({ 
        message: 'Error retrieving movie details', 
        error: error.message 
      });
    }
  }
}

module.exports = new MovieController();
