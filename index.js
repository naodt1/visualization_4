import * as d3 from "d3"

import { loadMoviesDataset } from "./src/movies.js";

import {
    documentToWords,
    inverseDocumentFrequency,
    tfidf,
  } from "./src/wordvector.js";
import { wordcloud } from "./src/wordcloud.js";
import "./src/q1.js";
import "./src/q2.js";
import "./src/q3.js";
import "./src/q4.js";


loadMoviesDataset().then((movies) => {
  d3.json('data/merge_tree.json').then(merge_tree => {
    // create a d3 hierarchy out of it
    merge_tree = d3.hierarchy(merge_tree);
    console.log(movies);
    console.log(merge_tree);

    // add your code here
  }); 
});
