import "../sass/main.scss";
import { API_KEY, IMG_URL, URL, LANGUAGE } from "./setup";
import { UserMovies } from "./local-storage";
import { genres } from "./genres";

const userMovies = new UserMovies();

const SEARCH_API = `${URL}/search/movie?api_key=${API_KEY}&query=`;
const API_URL = `${URL}/discover/movie?include_adult=false&include_video=false&language=${LANGUAGE}&page=1&sort_by=popularity.desc&api_key=${API_KEY}`;

const form = document.querySelector("#form");
const search = document.querySelector("#search");
const moviesContainerEl = document.querySelector(".movies-container");

getMovies(API_URL);

async function getMovies(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await res.json();
    showMovies(data.results);
  } catch (error) {
    console.error(error);
  }
}

function showMovies(movies) {
  moviesContainerEl.innerHTML = "";

  movies.forEach(movie => {
    const {
      original_title,
      poster_path,
      vote_average,
      release_date,
      genre_ids,
    } = movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("card");

    const movieGenres = genre_ids
      .map(genreId => genres.find(genre => genre.id === genreId).name)
      .join(", ");

    // Sprawdź, czy poster_path istnieje
    const posterSrc = poster_path
      ? `${IMG_URL}${poster_path}`
      : "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png";
    const posterAlt = poster_path ? original_title : "Poster Not Found";

    movieEl.innerHTML = `
  <div id="card" class="card">
    <img class="card__poster" src="${posterSrc}" alt="${posterAlt}" title="${original_title}" />
    <div class="card__content">
      <div class="card__info">
        <div class="card__title">${original_title}</div>
        <div class="card__genre">${movieGenres} |</div>
        <div class="card__release">${release_date.slice(0, 4)} </div>
      </div>
    </div>
  </div>`;

    moviesContainerEl.appendChild(movieEl);

    // ================================ SHOW MODAL ================================

    movieEl.addEventListener("click", () => {
      modalBoxShow(movie);
    });

    const modalBoxShow = movie => {
      const popupEl = document.querySelector(".backdrop");
      const closeBtnEl = document.querySelector(".modal__btn-close");
      const imageEl = document.querySelector(".modal__photo");
      const titleEl = document.querySelector(".modal__title");
      const voteEl = document.querySelector(".modal__stats-vote");
      const votesEl = document.querySelector(".modal__stats-votes");
      const popularityEl = document.querySelector(".modal__popularity");
      const originalTitleEl = document.querySelector(".modal__film-title");
      const genreEl = document.querySelector(".modal__genre");
      const aboutEl = document.querySelector(".modal__about-text");

      popupEl.classList.remove("is-hidden");
      const posterSrc = movie.poster_path
        ? `${IMG_URL}${movie.poster_path}`
        : "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png";
      const posterAlt = movie.poster_path
        ? movie.original_title
        : "Poster Not Found";
      imageEl.innerHTML = `<img class="posters__img" src="${posterSrc}" alt="${posterAlt}"/>`;
      titleEl.innerHTML = `${movie.original_title}`;
      voteEl.innerHTML = `${movie.vote_average}`;
      votesEl.innerHTML = `${movie.vote_count}`;
      popularityEl.innerHTML = `${movie.popularity}`;
      originalTitleEl.innerHTML = `${movie.original_title}`;
      genreEl.innerHTML = `${movieGenres}`;
      aboutEl.innerHTML = `${movie.overview}`;

      const addWatchBtnEl = document.querySelector("#modal__button-watched");
      const addQueueBtnEl = document.querySelector("#modal__button-queue");

      addWatchBtnEl.addEventListener("click", () =>
        userMovies.addToWatch(movie)
      );

      addQueueBtnEl.addEventListener("click", () =>
        userMovies.addToQueue(movie)
      );

      // ================================ HIDE MODAL ================================

      closeBtnEl.addEventListener("click", () => {
        popupEl.classList.add("is-hidden");
      });

      window.addEventListener("keyup", e => {
        if (e.key === "Escape") {
          popupEl.classList.add("is-hidden");
        }
      });

      window.addEventListener("keyup", e => {
        if (e.key === "Escape") {
          popupEl.classList.add("is-hidden");
        }
      });

      window.addEventListener("click", e => {
        if (e.target.classList.contains("backdrop")) {
          popupEl.classList.add("is-hidden");
        }
      });
    };
  });
}

form.addEventListener("input", () => {
  const searchTerm = search.value;

  if (searchTerm && searchTerm !== "") {
    const searchUrl = SEARCH_API + searchTerm;
    getMovies(searchUrl);
  } else {
    window.location.reload();
  }
});
