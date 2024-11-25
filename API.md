# Movie Service API Reference

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": "string"
}
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "string"
}
```

**Note:** Token is also set as an HTTP-only cookie

### Logout
```http
POST /api/auth/logout
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

## Movie Endpoints

### Search Movies
```http
GET /api/movies?query=movie_title
```

**Query Parameters:**
- `query` (string, required): Movie title to search for

**Response:**
```json
{
  "count": 0,
  "movies": [
    {
      "id": "string",
      "title": "string",
      "year": "string",
      "type": "string",
      "poster": "string"
    }
  ]
}
```

### Get Movie Details
```http
GET /api/movies/details?id=imdb_id
```

**Query Parameters:**
- `id` (string, required): IMDB ID of the movie

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "year": "string",
  "rated": "string",
  "released": "string",
  "runtime": "string",
  "genres": ["string"],
  "director": "string",
  "actors": ["string"],
  "plot": "string",
  "poster": "string",
  "imdbRating": "string",
  "type": "string"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request parameters",
  "details": "Specific error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required",
  "details": "Please login to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found",
  "details": "The requested resource could not be found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "An unexpected error occurred"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per minute per IP address
- 1000 requests per hour per IP address

## CORS Policy

The API allows requests from the following origins:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

## Authentication

All authenticated endpoints require a valid JWT token which can be provided in one of two ways:
1. As an HTTP-only cookie (recommended)
2. In the Authorization header: `Authorization: Bearer <token>`

## Data Models

### User
```typescript
{
  username: string;     // Required, unique
  email: string;        // Required, unique
  password: string;     // Required, hashed
  createdAt: Date;      // Automatically set
  updatedAt: Date;      // Automatically updated
}
```

### Movie Search Result
```typescript
{
  id: string;          // IMDB ID
  title: string;       // Movie title
  year: string;        // Release year
  type: string;        // Type (movie, series, episode)
  poster: string;      // URL to poster image
}
```

### Movie Details
```typescript
{
  id: string;          // IMDB ID
  title: string;       // Movie title
  year: string;        // Release year
  rated: string;       // Rating (PG, R, etc.)
  released: string;    // Release date
  runtime: string;     // Duration
  genres: string[];    // List of genres
  director: string;    // Director name
  actors: string[];    // List of actors
  plot: string;        // Movie plot
  poster: string;      // URL to poster image
  imdbRating: string;  // IMDB rating
  type: string;        // Type (movie, series, episode)
}
```
