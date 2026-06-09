import { csv, isoParse, autoType } from "d3";

export async function loadMoviesDataset() {
  return await csv("/data/action_movies.csv", (item) => ({
    imdbId: item.imdbId,
    tmdbId: item.tmdbId,
    title: item.title,
    originalTitle: item.originalTitle,
    releaseDate: isoParse(item.releaseDate), // transform string to date object
    runtime: +item.runtime, // transform string to number
    genres: item.genres.split(","), // transform string to array
    productionCountries: item.productionCountries.split(","),
    originalLanguage: item.originalLanguage,
    spokenLanguages: item.spokenLanguages.split(","),
    budget: +item.budget,
    revenue: +item.revenue,
    imdbRating: +item.imdbRating,
    imdbVotes: +item.imdbVotes,
    tmdbRating: +item.tmdbRating,
    tmdbVotes: +item.tmdbVotes,
    tmdbPopularity: +item.tmdbPopularity,
    collection: item.collection,
    overview: item.overview,
    tagline: item.tagline,
    embedding_x: +item.embedding_x,
    embedding_y: +item.embedding_y
  }));
}
