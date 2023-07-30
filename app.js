// const API = "https://www.omdbapi.com/?i=tt3896198&apikey=6a0bcf92";
const API_KEY = "6a0bcf92";
var searchInputText = document.getElementById('searchText');

// On every keyPress on search input field fetch movie data
searchInputText.addEventListener('input', fetchMovies);

// Helper routine to call get fetchMovie API
async function fetchMovies(){
  let trimValue = searchInputText.value.trim();
  const url = `https://www.omdbapi.com/?s=${trimValue}&page=1&apikey=${API_KEY}`;

  // get API call using using fetch method and convert response into json format
  const data = await fetch(url).then(res => res.json())
  if (data.Response){ showMovieList(data.Search)}
}

// Helper routine to show movie list
async function showMovieList(movieResults){
  let results = [];
  movieResults && movieResults.map((data)=> {
    // if poster url not available then show the empty string instead of N/A
    const img = (data?.Poster !== 'N/A') ? data?.Poster : '';
    var movieId = data?.imdbID;
    const title = data?.Title;
    const year = data?.Year;

    // using string intrpolition to show the results
    results += `
      <div class="card">
        <a href="movie.html?id=${movieId}">
          <img src=${img} alt="not found" style="width:100%">
          <h1>${title}</h1>
          <p>${year}</p>
        </a>
        <p class="fav-btn"><button onClick="addToFavourite('${movieId}')">Add to Favourite</button></p>
      </div>`;
  })
  // Append the all results in movie page
  document.querySelector('.movie-cards').innerHTML = results;
}

// Fetch single movie details using particular movie id
async function fetchMovieDetails(){
  // Find movie id from URL
  var urlQueryParams = new URLSearchParams(window.location.search)
  var movieId = urlQueryParams.get('id');
  const url = `https://www.omdbapi.com/?i=${movieId}&page=1&apikey=${API_KEY}`;

  // if response is true call the showMovieList method to show the movie list
  const data = await fetch(url).then(res => res.json())
  if(data) showMovieDetails(data)
}

// Helper routine to show movie details
async function showMovieDetails(movieDetails){
    const img = (movieDetails?.Poster !== 'N/A') ? movieDetails?.Poster : '';
    var movieId = movieDetails?.imdbID;
    const title = movieDetails?.Title;
    const boxOffice = movieDetails?.BoxOffice;
    const released = movieDetails?.Released;
    const runtime = movieDetails?.Runtime;
    const plot = movieDetails?.Plot;
    const imdbRating = movieDetails?.imdbRating;
    const awards = movieDetails?.Awards;
    const actors = movieDetails?.Actors;

  const  results = `
    <div class="movie">
      <div class="movie__hero">
        <img src=${img} alt="Rambo" class="movie__img">
      </div>
      <div class="movie__content">
        <div class="movie__title">
          <h1 class="heading__primary">${title}<i class="fas fa-fire"></i></h1>
        </div>
        <p><span class="text-bold">Released : </span>${released}</p>
        <p><span class="text-bold">Actors : </span>${actors}</p>
        <p><span class="text-bold">Awards : </span>${awards}</p>
        <p><span class="text-bold">Runtime : </span>${runtime}</p>
        <p><span class="text-bold">BoxOffice : </span>${boxOffice}</p>
        <p class="movie__description">${plot}</p>
        <div class="movie__title">
          <div class="movie__tag movie__tag--1">${imdbRating}/10</div>
          <div class="movie__tag movie__tag--2"><button onClick="addToFavourite('${movieId}')">Add To Favourite</button></div>
        </div>
      </div>
    </div>`;
  document.querySelector('.movie-container').innerHTML = results;
}

// Helper routine to store favroutie movie id in localStorage
async function addToFavourite(movieId) {
  const keys = Object.keys(localStorage);
  let foundKey = null;

  // Check if movie id already present in localStorage
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (localStorage.getItem(key) === movieId) {
      foundKey = key;
      break;
    }
  }
  
  if (!foundKey) {
    // Store data using setItem method, Use Math.random() for unique key and value pair
    localStorage.setItem(Math.random(), movieId);
    alert('Movie added to favourite')
  }else{
    alert('Movie already added to favourite list')
  }
}

// Helper routine to delete the favroutie movie id in localStorage
async function removeFromFavourite(movieId) {
  const keys = Object.keys(localStorage);
  let foundKey = null;

  // Check if movie id already present in localStorage
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (localStorage.getItem(key) === movieId) {
      foundKey = key;
      break;
    }
  }

  if (foundKey) {
    localStorage.removeItem(foundKey);
    alert('Remove movie from favourite');
    window.location.replace('favourite.html');
  } else {
    alert('Movie not found in favourites');
  }
}

// Fetch all favourite movies using favourite movie id
async function fetchFavouriteMovies(){
  var results = [];
  await Promise.all(
    Object.keys(localStorage).map(async (key) => {
      const movieId = localStorage.getItem(key);
      if(movieId){
        const url = `https://www.omdbapi.com/?i=${movieId}&page=1&apikey=${API_KEY}`;
        const data = await fetch(url).then(res => res.json())
        console.log('fav_movie_data===',data)
        results += `
          <div class="card">
            <a href="movie.html?id=${data?.imdbID}">
              <img src=${data?.Poster} alt="not found" style="width:100%">
              <h1>${data?.Title}</h1>
              <p>${data?.Year}</p>
            </a>
            <p class="fav-btn"><button onClick="removeFromFavourite('${movieId}')">Remove</button></p>
          </div>`;
      }
    })
    );
    document.querySelector('.fav-movie-cards').innerHTML = results;
}
