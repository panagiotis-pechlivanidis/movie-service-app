const axios = require('axios');
require('dotenv').config();
const logger = require('../utils/logger');

class OMDBService {
  constructor() {
    this.apiKey = process.env.OMDB_API_KEY;
    if (!this.apiKey) {
      throw new Error('OMDB API Key is not set in environment variables');
    }
    this.baseUrl = 'http://www.omdbapi.com/';
  }

  /**
   * Search movies by title
   * @param {string} query - Movie title to search
   * @param {Object} options - Additional search options
   * @returns {Promise<Array>} List of movies matching the title
   */
  async searchMovies(query, options = {}) {
    try {
      logger.info(`Searching movies with query: ${query}`);

      const response = await axios.get(this.baseUrl, {
        params: {
          apikey: this.apiKey,
          s: query,
          type: options.type || 'movie',
          page: options.page || 1
        }
      });

      if (response.data.Response === 'False') {
        logger.warn(`No movies found for query: ${query}`);
        return [];
      }

      // Transform OMDB search results
      const movies = response.data.Search.map(movie => ({
        id: movie.imdbID,
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster !== 'N/A' ? movie.Poster : null,
        type: movie.Type
      }));

      logger.info(`Found ${movies.length} movies for query: ${query}`);
      return movies;
    } catch (error) {
      logger.error('Error searching movies in OMDB:', error.message);
      throw error;
    }
  }

  /**
   * Get detailed movie information
   * @param {string} id - IMDb ID or title
   * @returns {Promise<Object>} Detailed movie information
   */
  async getMovieDetails(id) {
    try {
      logger.info(`Fetching movie details for: ${id}`);

      const response = await axios.get(this.baseUrl, {
        params: {
          apikey: this.apiKey,
          i: id,  // Prefer IMDb ID
          plot: 'full'
        }
      });

      if (response.data.Response === 'False') {
        logger.warn(`Movie not found: ${id}`);
        return null;
      }

      // Transform detailed movie data
      const movie = {
        id: response.data.imdbID,
        title: response.data.Title,
        year: response.data.Year,
        rated: response.data.Rated,
        released: response.data.Released,
        runtime: response.data.Runtime,
        genres: response.data.Genre.split(', '),
        director: response.data.Director,
        writers: response.data.Writer.split(', '),
        actors: response.data.Actors.split(', '),
        plot: response.data.Plot,
        languages: response.data.Language.split(', '),
        country: response.data.Country,
        awards: response.data.Awards,
        poster: response.data.Poster !== 'N/A' ? response.data.Poster : null,
        ratings: response.data.Ratings,
        metascore: response.data.Metascore,
        imdbRating: response.data.imdbRating,
        imdbVotes: response.data.imdbVotes,
        type: response.data.Type
      };

      logger.info(`Successfully fetched movie details for: ${id}`);
      return movie;
    } catch (error) {
      logger.error('Error fetching movie details:', error.message);
      throw error;
    }
  }
}

module.exports = new OMDBService();
