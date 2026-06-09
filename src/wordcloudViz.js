import { showPlaceholder } from './vizUtils.js';

const WORDCLOUD_CONTAINER = "#wordcloud-container";
const WORDCLOUD_PLACEHOLDER = "Word cloud visualization goes here.";

export function showWordCloudPlaceholder(message = WORDCLOUD_PLACEHOLDER) {
    showPlaceholder(WORDCLOUD_CONTAINER, message);
}

export function renderWordCloud(selectedMovies, globalIdf) {
    showWordCloudPlaceholder();
}
