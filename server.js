const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userModel'); // Import User model
const path = require('path');
const jwt = require('jsonwebtoken');
const axios = require('axios');

require('dotenv').config();

const app = express();
app.use(express.json());

const JWT_SECRET = '\nMIHcAgEBBEIBRXmfQ1B0idHUvQDK5M3lnHrsJ1P8NX6FVA7LWxV/cl76Q6DsLLva\nYyWRYEGISHvu3dyAHX4OlDOuKe5UybB9++KgBwYFK4EEACOhgYkDgYYABAD5+SYn\n4aSiR9RDjR5Oub3f2DtAqx+0klzaVEcj8F3tMf3/+H9H2eSkI4czhZkqtvzbiljJ\nJBEaryFGrt0IGMglRwFEJMGyhK6dmHy1ytZIgiW/YfCUkLV4Q6DMEtjwOiew7I4U\n6xR7ZqInTd0L+kg0bC0qhLoOj/HD220vGABm0oDJ3w==\n-----END EC PRIVATE KEY-----\n","publicKey":"-----BEGIN PUBLIC KEY-----\nMIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQA+fkmJ+GkokfUQ40eTrm939g7QKsf\ntJJc2lRHI/Bd7TH9//h/R9nkpCOHM4WZKrb824pYySQRGq8hRq7dCBjIJUcBRCTB\nsoSunZh8tcrWSIIlv2HwlJC1eEOgzBLY8DonsOyOFOsUe2aiJ03dC/pINGwtKoS6\nDo/xw9ttLxgAZtKAyd8=\n-----END PUBLIC KEY-----\n","algorithm":"ES512","openssl":"OpenSSL 3.3.2 3 Sep 2024 (Library: OpenSSL 3.3.2 3 Sep 2024)","curve":"secp521r1"}' || 'your_secret_key';

// Authentication middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
}

// Protected route for logged-in users
app.get('/dashboard', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'protected', 'dashboard.html'));
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://panagiotispech:kcTTX8K0xGbEj3pH@cluster0.tgump.mongodb.net/', {
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Serve static files from "public" folder
app.use(express.static('public'));
 
// Registration route to create a new user
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already in use' });
    }

    
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Ensure both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find the user by username
    const user = await User.findOne({ username });
    console.log("User found:", user); // Log the user object for debugging
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Ensure the stored hashed password is defined
    if (!user.password) {
      return res.status(500).json({ message: 'User has no password saved' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch); // Add this log for debugging
    
    // If the password matches, proceed with login
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// API endpoint to fetch movies by title


const movieSchema = new mongoose.Schema({
  title: String,
  poster: String,
  plot: String,
  genres: [String],  // assuming genres is an array of strings
  year: Number
});

const Movie = mongoose.model('Movie', movieSchema);

// Middleware to parse JSON
app.use(express.json());

// Route to get an array of movies
app.get('/api/movies', async (req, res) => {
  try {
    const title = req.query.title;
    if (!title) {
      return res.status(400).json({ message: "Title query parameter is required" });
    }

    const movies = await Movie.find({ title: { $regex: title, $options: "i" } });

    // Map movies to include only the necessary fields
    const movieData = movies.map(movie => ({
      title: movie.title,
      poster: movie.poster,
      plot: movie.plot || "No plot available.",
      genres: movie.genres && movie.genres.length ? movie.genres.join(", ") : "Unknown",
      year: movie.year || "Unknown"
    }));

    res.json(movieData);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ message: "Error fetching movies" });
  }
});


// Route to get a single movie
app.get('/api/movie', async (req, res) => {
  try {
    const title = req.query.title;
    if (!title) {
      return res.status(400).json({ message: "Title query parameter is required" });
    }

    const movie = await Movie.findOne({ title: { $regex: title, $options: "i" } });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const movieData = {
      title: movie.title,
      poster: movie.poster,
      description: movie.description || "No description available.",
      genres: movie.genre || "Unknown",
      year: movie.year || "Unknown"
    };

    res.json(movieData);
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ message: "Error fetching movie" });
  }
});



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.use((req, res, next) => {
  console.log(`Received request on ${req.method} ${req.url}`);
  res.on('finish', () => {
    console.log(`Response status for ${req.method} ${req.url}: ${res.statusCode}`);
  });
  next();
});


app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Serve static files after defining API routes
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
