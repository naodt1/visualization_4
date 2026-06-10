import {
    initGenreColorScale,
    renderGenreChart,
    showGenrePlaceholder,
} from './genreChart.js';
import { renderWordCloud, showWordCloudPlaceholder } from './wordcloudViz.js';
import { renderMovieList, showMovieListPlaceholder } from './movieList.js';


export function initTextInsights() {
    showWordCloudPlaceholder();
    showGenrePlaceholder();
    showMovieListPlaceholder();

}

export function updateTextInsights(movieIds, allMovies, globalIdf) {
    initGenreColorScale(allMovies);

    if (!movieIds || movieIds.length === 0) {
        initTextInsights();
        return;
    }

    const selectedMovies = allMovies.filter(m => movieIds.includes(m.imdbId));

    renderWordCloud(selectedMovies, globalIdf);
    renderGenreChart(selectedMovies);
    renderMovieList(selectedMovies);

}
