import * as d3 from "d3";
import { documentToWords, inverseDocumentFrequency, tfidf } from "./wordvector.js";
import { wordcloud } from "./wordcloud.js";

export function renderClusterWordClouds(merge_tree, movies) {
    // The top level children of the merge_tree are the two main clusters
    if (!merge_tree.children || merge_tree.children.length < 2) {
        console.warn("Not enough clusters at the root of the merge tree.");
        return;
    }

    const clusterA = merge_tree.children[0];
    const clusterB = merge_tree.children[1];

    // Helper function to get all words from a cluster's movies
    function getClusterWords(clusterNode) {
        const movieIds = clusterNode.data.movie_ids || [];
        const clusterMovies = movies.filter(m => movieIds.includes(m.imdbId));
        
        let words = [];
        clusterMovies.forEach(m => {
            if (m.overview) {
                words = words.concat(documentToWords(m.overview));
            }
        });
        return words;
    }

    const wordsA = getClusterWords(clusterA);
    const wordsB = getClusterWords(clusterB);

    // Compute global IDF using all movies as documents
    const allDocs = movies.map(m => m.overview ? documentToWords(m.overview) : []);
    const globalIdf = inverseDocumentFrequency(allDocs);

    // Calculate TF-IDF
    const tfidfA = tfidf(wordsA, globalIdf);
    const tfidfB = tfidf(wordsB, globalIdf);

    // Render word clouds
    const svgA = d3.select("#wordcloud-a");
    const svgB = d3.select("#wordcloud-b");

    svgA.selectAll("*").remove();
    svgB.selectAll("*").remove();

    console.log("Rendering Word Cloud A...");
    wordcloud(svgA, tfidfA);

    console.log("Rendering Word Cloud B...");
    wordcloud(svgB, tfidfB);
}
