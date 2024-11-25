const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// Route to search movies
router.get('/', movieController.searchMovies.bind(movieController));

// Route to get a single movie
router.get('/details', movieController.getMovie.bind(movieController));

module.exports = router;
