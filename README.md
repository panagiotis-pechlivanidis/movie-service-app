# Movie Service API Documentation

## Overview
Movie Service is a RESTful API service that provides movie information by integrating with the OMDB (Open Movie Database) API. It offers user authentication, movie search capabilities, and detailed movie information retrieval.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Architecture](#architecture)
- [Error Handling](#error-handling)
- [Authentication](#authentication)

## Prerequisites
- Node.js (v20.17.0 or higher)
- MongoDB (local or remote instance)
- OMDB API Key (obtain from [OMDB API](http://www.omdbapi.com/))

## Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd movie-service
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/movieservice
OMDB_API_KEY=your_omdb_api_key_here
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=1h
```

4. Start the server:
```bash
node server.js
```

## Configuration
The application uses environment variables for configuration. Here's what each variable means:

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port number | 3000 |
| NODE_ENV | Environment (development/production) | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/movieservice |
| OMDB_API_KEY | OMDB API key | Required |
| JWT_SECRET | Secret key for JWT tokens | Required |
| JWT_EXPIRATION | JWT token expiration time | 1h |

## API Endpoints

### Authentication
- **POST** `/api/auth/register`
  - Register a new user
  - Body: `{ "username": "string", "password": "string", "email": "string" }`

- **POST** `/api/auth/login`
  - Authenticate user and get token
  - Body: `{ "username": "string", "password": "string" }`

### Movies
- **GET** `/api/movies`
  - Search movies by title
  - Query Parameters: 
    - `query`: Movie title to search for
  - Authentication: Not required

- **GET** `/api/movies/details`
  - Get detailed information about a specific movie
  - Query Parameters:
    - `id`: IMDB ID of the movie
  - Authentication: Not required

## Architecture

### Project Structure
```
movie-service/
├── config/
│   └── AppConfig.js         # Application configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── movieController.js   # Movie-related operations
│   └── userController.js    # User management
├── interfaces/
│   └── IUserService.js      # User service interface
├── middlewares/
│   └── authMiddleware.js    # Authentication middleware
├── models/
│   └── userModel.js        # User database model
├── public/
│   └── dashboard.html      # Frontend dashboard
├── routes/
│   ├── authRoutes.js       # Authentication routes
│   ├── movieRoutes.js      # Movie-related routes
│   └── userRoutes.js       # User management routes
├── services/
│   ├── BaseService.js      # Base service class
│   ├── movieService.js     # Movie service implementation
│   ├── omdbService.js      # OMDB API integration
│   └── userService.js      # User service implementation
├── utils/
│   └── logger.js           # Logging utility
├── .env                    # Environment variables
├── package.json           # Project dependencies
└── server.js             # Application entry point
```

### Design Patterns
- **Service Layer Pattern**: Separates business logic from controllers
- **Dependency Injection**: Used in services and controllers for better testability
- **Interface Segregation**: Defined interfaces for services
- **Repository Pattern**: Used for database operations
- **Middleware Pattern**: For authentication and request processing

## Error Handling
The application implements comprehensive error handling:

- **HTTP Status Codes**:
  - 200: Success
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found
  - 500: Internal Server Error

- **Error Response Format**:
```json
{
  "error": "Error message",
  "details": "Detailed error information (development only)"
}
```

## Authentication
The application uses JWT (JSON Web Tokens) for authentication:

1. **Token Generation**: Upon successful login
2. **Token Storage**: HTTP-only cookies
3. **Token Verification**: Through authMiddleware
4. **Security Features**:
   - HTTP-only cookies
   - CORS protection
   - Rate limiting
   - Secure password hashing

## Development

### Adding New Features
1. Create necessary interfaces in `/interfaces`
2. Implement service in `/services`
3. Create controller in `/controllers`
4. Add routes in `/routes`
5. Update documentation

### Testing
```bash
# Run tests (when implemented)
npm test
```

### Logging
The application uses a custom logger (`utils/logger.js`) with different log levels:
- ERROR: For error conditions
- WARN: For warning conditions
- INFO: For informational messages
- DEBUG: For debugging messages

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License
[MIT License](LICENSE)
