const Movie = require('../models/movieModel');
const IMovieService = require('../interfaces/IMovieService');
const BaseService = require('./BaseService');

class MovieService extends BaseService {
  constructor(dependencies = {}) {
    super(dependencies);
    this.movieModel = dependencies.movieModel || Movie;
    this.logger = dependencies.logger || console;
    
    // Use an async IIFE to handle initialization
    (async () => {
      try {
        console.log('Attempting to initialize movies...');
        await this.initializeMovies();
        console.log('Movie initialization complete');
      } catch (error) {
        console.error('Movie initialization failed:', error);
      }
    })();
  }

  /**
   * Initialize movies if no movies exist
   */
  async initializeMovies() {
    try {
      console.log('Checking movie count in database...');
      const movieCount = await this.movieModel.countDocuments();
      console.log(`Current movie count: ${movieCount}`);
      
      if (movieCount === 0) {
        console.log('No movies found. Inserting initial movies...');
        const initialMovies = [
          {
            title: 'The Shawshank Redemption',
            year: 1994,
            genres: ['Drama'],
            plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
            poster: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg'
          },
          {
            title: 'The Godfather',
            year: 1972,
            genres: ['Crime', 'Drama'],
            plot: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
            poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg'
          },
          {
            title: 'The Dark Knight',
            year: 2008,
            genres: ['Action', 'Crime', 'Drama'],
            plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
            poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg'
          }
        ];

        const insertResult = await this.movieModel.insertMany(initialMovies);
        console.log('Inserted movies:', insertResult);
        console.log('Initialized movie database with sample movies');
      }
    } catch (error) {
      console.error(`CRITICAL ERROR initializing movies: ${error.message}`, error);
      // Rethrow to ensure the error is not silently ignored
      throw error;
    }
  }

  /**
   * Retrieve movies by title
   * @param {string} query - Movie title to search
   * @returns {Promise<Array>} List of movies matching the title
   */
  async getMoviesByTitle(query) {
    try {
      console.log('Movie search query:', query);  // Log search query

      if (!query) {
        // If no query provided, return all movies
        const movies = await this.movieModel.find({});
        console.log('Raw movies before transformation:', movies);
        const transformedMovies = movies.map(movie => {
          const transformed = this.transformMovieData(movie);
          console.log('Transformed movie:', transformed);
          return transformed;
        });
        console.log('Transformed movies:', transformedMovies);
        return transformedMovies;
      }

      const movies = await this.movieModel.find({ 
        title: { $regex: query, $options: 'i' } 
      });

      console.log('Raw movies matching query:', movies);
      const transformedMovies = movies.map(movie => {
        const transformed = this.transformMovieData(movie);
        console.log('Transformed movie:', transformed);
        return transformed;
      });
      console.log('Transformed movies:', transformedMovies);
      return transformedMovies;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  }

  /**
   * Get detailed information for a specific movie
   * @param {string} title - Movie title
   * @returns {Promise<Object>} Detailed movie information
   */
  async getMovieDetails(title) {
    try {
      if (!title) {
        throw new Error('Title query parameter is required');
      }

      const movie = await this.movieModel.findOne({ 
        title: { $regex: title, $options: 'i' } 
      });

      if (!movie) {
        throw new Error('Movie not found');
      }

      return this.transformMovieData(movie);
    } catch (error) {
      this.logger.error(`Error fetching movie details: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a new movie entry
   * @param {Object} movieData - Movie data to create
   * @returns {Promise<Object>} Created movie details
   */
  async createMovie(movieData) {
    try {
      // Validate input
      if (!this.validate(movieData, this.movieSchema)) {
        throw new Error('Invalid movie data');
      }

      const newMovie = new this.movieModel(movieData);
      await newMovie.save();

      return this.transformMovieData(newMovie);
    } catch (error) {
      this.logger.error(`Error creating movie: ${error.message}`);
      throw error;
    }
  }

  /**
   * Transform movie data to a consistent format
   * @param {Object} movie - Movie document
   * @returns {Object} Transformed movie data
   */
  transformMovieData(movie) {
    return {
      id: movie._id,
      title: movie.title,
      poster: movie.poster || 'No poster available',
      genres: movie.genres?.join(', ') || 'Unknown',
      year: movie.year || 'Unknown',
      plot: movie.plot || 'No plot available.',
    };
  }

  /**
   * Movie data validation schema
   */
  get movieSchema() {
    return {
      title: (value) => value && value.length > 0,
      year: (value) => value && value > 0,
      genres: (value) => Array.isArray(value)
    };
  }
}

module.exports = new MovieService();