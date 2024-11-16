# movie-service-app
Documentation for Movie Service

This documentation outlines the functionality of the Movie Service application, which allows users to register, log in, view movies, and interact with movie-related data. The service is built with a Node.js backend, MongoDB for data storage, and a front-end that includes registration, login, and a dashboard for movie exploration.

Table of Contents

    Overview
    Features
    Project Structure
    API Endpoints
    Static Pages
        Register Page
    Installation and Usage
    Error Handling

Overview

The Movie Service provides an interactive platform for users to:

    Register and create accounts.
    Log in securely using JWT authentication.
    Search for movies using a database of movie information.
    View details about movies, including title, poster, genres, and plot.

Features

    User Authentication: Secure registration and login using hashed passwords and JWT.
    Movie Search: Fetch movies from the database with filters and display results.
    Profile Management: Update user profiles with preferences like favorite movies.
    Responsive Frontend: A clean and intuitive UI for interacting with the application.

Project Structure

/project-root
├── public
│   ├── register.html
│   ├── login.html
|   └── dashboard.html
│   └── assets
├── models
│   └── userModel.js
├── routes
│   ├── authRoutes.js
│   └── movieRoutes.js
├── app.js
└── package.json

API Endpoints
User Authentication

    POST /api/register
    Registers a new user.
        Request Body:

{
  "username": "example",
  "email": "example@example.com",
  "password": "securepassword"
}

Response:

    { "message": "User registered successfully" }

POST /api/login
Authenticates a user and returns a JWT token.

    Request Body:

{
  "username": "example",
  "password": "securepassword"
}

Response:

        { "message": "Login successful", "token": "jwt-token" }

Movie Management

    GET /api/movies?title=<title>
    Fetches a list of movies matching the title query.
        Response:

        [
          {
            "title": "Inception",
            "poster": "URL",
            "genres": "Sci-Fi, Action",
            "year": 2010,
            "plot": "A thief who steals corporate secrets..."
          }
        ]

Static Pages
Register Page
File: /public/register.html

This is the user registration page, allowing users to sign up for the service.
HTML Code

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register Page</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .container {
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 100%;
      text-align: center;
    }
    h1 {
      margin-bottom: 20px;
      color: #333;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
      color: #555;
    }
    input {
      width: calc(100% - 22px);
      padding: 10px;
      margin-bottom: 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 4px;
      background-color: #5cb85c;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
    }
    button:hover {
      background-color: #4cae4c;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Register</h1>
    <form id="registerForm">
      <label for="username">Username:</label>
      <input type="text" id="username" required><br>
      <label for="email">Email:</label>
      <input type="email" id="email" required><br>
      <label for="password">Password:</label>
      <input type="password" id="password" required><br>
      <button type="submit">Register</button>
    </form>
  </div>

  <script>
    document.getElementById("registerForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok) {
          alert('Registration successful');
          window.location.href = '/'; // Redirect to login page after registration
        } else {
          alert(data.message || 'Registration failed');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
      }
    });
  </script>
</body>
</html>

Installation and Usage

    Clone the repository.
    Install dependencies:

npm install

Set up a .env file with the following:

MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>

Start the server:

    npm start

    Visit the application at http://localhost:<PORT>.

Error Handling

Errors are handled with appropriate HTTP status codes:

    400: Bad requests (e.g., missing fields, invalid data).
    401: Unauthorized access (e.g., missing/invalid JWT token).
    500: Internal server errors.
