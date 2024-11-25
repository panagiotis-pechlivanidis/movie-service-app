async function searchMovies() {
  const query = document.getElementById('searchInput').value;
  const response = await fetch(`/api/movies?query=${query}`);
  const data = await response.json();

  const moviesContainer = document.getElementById('movies');
  moviesContainer.innerHTML = '';

  if (data.Response === "False") {
    moviesContainer.innerHTML = `<p>No movies found.</p>`;
  } else {
    data.Search.forEach((movie) => {
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie');
      movieElement.innerHTML = `
        <h2>${movie.Title} (${movie.Year})</h2>
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200x300?text=No+Image"}" alt="${movie.Title}">
      `;
      moviesContainer.appendChild(movieElement);
    });
  }
  // Register function
document.getElementById('registerForm').onsubmit = async (event) => {
  event.preventDefault();
  const username = document.getElementById('newUsername').value;
  const password = document.getElementById('newPassword').value;
  const email = document.getElementById('email').value;

  await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email })
  });
};

// Login function
document.getElementById('loginForm').onsubmit = async (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
};

}
