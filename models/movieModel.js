const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  genres: {
    type: [String],
    default: []
  },
  plot: {
    type: String,
    trim: true
  },
  poster: {
    type: String,
    trim: true
  },
  ratings: {
    imdbRating: {
      type: Number,
      min: 0,
      max: 10
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', movieSchema);
