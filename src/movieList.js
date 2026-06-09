import { showPlaceholder } from './vizUtils.js';

const MOVIE_LIST_CONTAINER = "#movie-list-container";
const MOVIE_LIST_PLACEHOLDER = "Movie list visualization goes here.";

export function showMovieListPlaceholder(message = MOVIE_LIST_PLACEHOLDER) {
    showPlaceholder(MOVIE_LIST_CONTAINER, message);
}

export function renderMovieList(selectedMovies) {
    showMovieListPlaceholder();
}
