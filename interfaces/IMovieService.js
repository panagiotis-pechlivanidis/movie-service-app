// Interface for Movie Service
class IMovieService {
  /**
   * Retrieve movies by title
   * @param {string} title - Movie title to search
   * @returns {Promise<Array>} List of movies matching the title
   */
  async getMoviesByTitle(title) {
    throw new Error('Method must be implemented');
  }

  /**
   * Get detailed information for a specific movie
   * @param {string} title - Movie title
   * @returns {Promise<Object>} Detailed movie information
   */
  async getMovieDetails(title) {
    throw new Error('Method must be implemented');
  }

  /**
   * Create a new movie entry
   * @param {Object} movieData - Movie data to create
   * @returns {Promise<Object>} Created movie details
   */
  async createMovie(movieData) {
    throw new Error('Method must be implemented');
  }
}

module.exports = IMovieService;
