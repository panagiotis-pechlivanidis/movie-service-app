const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

// Configuration
const appConfig = require('./config/AppConfig');

// Middleware
const authMiddleware = require('./middlewares/AuthMiddleware');

// Routes
const movieRoutes = require('./routes/MovieRoutes');
const authRoutes = require('./routes/AuthRoutes');

// Services
const movieService = require('./services/movieService');
const userService = require('./services/UserService');

// Models
const User = require('./models/userModel');
const Movie = require('./models/movieModel');

class MovieServiceApp {
    constructor() {
        this.app = express();
        this.config = appConfig;
        this.initializeMiddleware();
        this.connectDatabase();
        this.initializeRoutes();
    }

    initializeMiddleware() {
        this.app.use(cors());
        this.app.use(cookieParser());
        this.app.use(bodyParser.json());
        this.app.use(express.urlencoded({ extended: true }));
        
        // Static file serving before authentication
        this.app.use(express.static(this.config.publicPath));
        
        // Authentication middleware (with exclusions)
        this.app.use((req, res, next) => {
            // Exclude authentication for static files, root, and auth routes
            const publicPaths = [
                '/',
                '/login.html',
                '/index.html',
                '/favicon.ico',
                '/css/',
                '/js/',
                '/images/',
                '/api/auth/login',
                '/api/auth/register'
            ];

            const isPublicPath = publicPaths.some(path => 
                req.path === path || req.path.startsWith(path)
            );

            if (isPublicPath) {
                return next();
            }

            // Apply authentication for other routes
            return authMiddleware.authenticate(req, res, next);
        });
    }

    async connectDatabase() {
        try {
            // Use local MongoDB if no URI is provided
            const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/movieservice';
            
            console.log(`Attempting to connect to MongoDB: ${mongoUri}`);
            
            // Updated connection options for MongoDB Driver 4.0.0+
            await mongoose.connect(mongoUri, {
                serverSelectionTimeoutMS: 15000, // 15 seconds
                socketTimeoutMS: 45000, // 45 seconds
                dbName: 'movieservice',
                
                // Removed deprecated options
                maxPoolSize: 10,  // Adjust based on your needs
                minPoolSize: 5
            });
            
            console.log('Successfully connected to MongoDB');

            // Optional: Log connection details
            mongoose.connection.on('connected', () => {
                console.log('Mongoose default connection open');
            });

            mongoose.connection.on('error', (err) => {
                console.error('Mongoose default connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.log('Mongoose default connection disconnected');
            });
        } catch (error) {
            console.error('MongoDB connection error:', error);
            
            // Log detailed connection error
            console.error('Detailed error:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            
            // Exit the process if database connection fails
            process.exit(1);
        }
    }

    initializeRoutes() {
        // Authentication routes
        this.app.use('/api/auth', authRoutes);

        // Movie routes
        this.app.use('/api/movies', movieRoutes);

        // Root route
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(this.config.publicPath, 'login.html'));
        });

        // Protected dashboard route
        this.app.get('/dashboard', (req, res) => {
            res.sendFile(path.join(this.config.protectedPath, 'dashboard.html'));
        });

        // Catch-all route for single-page applications
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(this.config.publicPath, 'login.html'));
        });

        // Global error handling middleware
        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({
                message: 'An unexpected error occurred',
                error: process.env.NODE_ENV === 'production' ? {} : err.message
            });
        });
    }

    start() {
        const PORT = this.config.port;
        this.app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
}

const movieServiceApp = new MovieServiceApp();
movieServiceApp.start();
