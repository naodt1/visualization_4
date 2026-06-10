import * as d3 from 'd3';
import { showPlaceholder } from './vizUtils.js';
import { documentToWords, tfidf } from './wordvector.js';
import { wordcloud } from './wordcloud.js';

const WORDCLOUD_CONTAINER = "#wordcloud-container";
const WORDCLOUD_PLACEHOLDER = "Word cloud visualization goes here.";

let wordcloudUpdater = null;

export function showWordCloudPlaceholder(message = WORDCLOUD_PLACEHOLDER) {
    showPlaceholder(WORDCLOUD_CONTAINER, message);
}

export function renderWordCloud(selectedMovies, globalIdf) {
    if (!selectedMovies || selectedMovies.length === 0) {
        showWordCloudPlaceholder();
        wordcloudUpdater = null;
        return;
    }

    let words = [];
    selectedMovies.forEach(m => {
        if (m.overview) {
            words = words.concat(documentToWords(m.overview));
        }
    });

    const tfidfScores = tfidf(words, globalIdf);

    const container = d3.select(WORDCLOUD_CONTAINER);
    let svg = container.select("svg");
    
    if (svg.empty()) {
        container.selectAll("*").remove();

        // Add legend container
        const legend = container.append("div")
            .style("display", "flex")
            .style("align-items", "center")
            .style("justify-content", "center")
            .style("margin-bottom", "10px")
            .style("font-family", "sans-serif")
            .style("font-size", "12px")
            .style("color", "#555");
            
        legend.append("span").text("Lower Frequency");
        
        // Gradient bar
        const gradientId = "wc-legend-gradient";
        const legendSvg = legend.append("svg")
            .attr("width", 150)
            .attr("height", 12)
            .style("margin", "0 10px")
            .style("border-radius", "6px");
            
        const defs = legendSvg.append("defs");
        const linearGradient = defs.append("linearGradient")
            .attr("id", gradientId);
            
        // Custom vibrant scale: Teal (Low), Cream (Mid), Terracotta (High)
        linearGradient.append("stop").attr("offset", "0%").attr("stop-color", "#2a7e72");
        linearGradient.append("stop").attr("offset", "50%").attr("stop-color", "#f3ecdb");
        linearGradient.append("stop").attr("offset", "100%").attr("stop-color", "#c45839");
        
        legendSvg.append("rect")
            .attr("width", 150)
            .attr("height", 12)
            .attr("fill", `url(#${gradientId})`);
            
        legend.append("span").text("Higher Frequency");

        svg = container.append("svg")
            .attr("width", 600)
            .attr("height", 600)
            .style("width", "100%")
            .style("height", "auto");
        wordcloudUpdater = wordcloud(svg, tfidfScores);
    } else {
        if (wordcloudUpdater) {
            wordcloudUpdater(tfidfScores);
        } else {
            wordcloudUpdater = wordcloud(svg, tfidfScores);
        }
    }
}
