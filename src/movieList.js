import * as d3 from 'd3';
import { showPlaceholder } from './vizUtils.js';

const MOVIE_LIST_CONTAINER = "#movie-list-container";
const MOVIE_LIST_PLACEHOLDER = "Movie list visualization goes here.";

export function showMovieListPlaceholder(message = MOVIE_LIST_PLACEHOLDER) {
    showPlaceholder(MOVIE_LIST_CONTAINER, message);
}

export function renderMovieList(selectedMovies) {
    if (!selectedMovies || selectedMovies.length === 0) {
        showMovieListPlaceholder();
        return;
    }

    const container = d3.select(MOVIE_LIST_CONTAINER);

    // Keep the scrollable container if it exists, otherwise create it
    let list = container.select(".movie-list-wrapper");
    if (list.empty()) {
        container.selectAll("*").remove(); // Remove placeholder
        list = container.append("div")
            .attr("class", "movie-list-wrapper")
            .style("max-height", "450px")
            .style("overflow-y", "auto")
            .style("padding", "10px")
            .style("font-family", "sans-serif");
    }

    // Sort movies alphabetically to maintain consistent ordering
    selectedMovies.sort((a, b) => d3.ascending(a.title, b.title));

    const t = container.transition().duration(600);

    // Reset scroll position so new, smaller clusters don't appear "empty" if the user was scrolled down
    list.node().scrollTop = 0;

    list.selectAll(".movie-item")
        .data(selectedMovies, d => d.imdbId)
        .join(
            enter => {
                const item = enter.append("div")
                    .attr("class", "movie-item")
                    .style("margin-bottom", "10px")
                    .style("padding", "12px")
                    .style("border", "1px solid #eee")
                    .style("border-radius", "6px")
                    .style("background", "#fafafa")
                    .style("opacity", 0)
                    .style("transform", "translateY(10px)");
                
                item.append("h4")
                    .style("margin", "0 0 6px 0")
                    .style("color", "#333")
                    .text(d => d.title);
                    
                item.append("div")
                    .style("font-size", "0.85em")
                    .style("color", "#666")
                    .text(d => Array.isArray(d.genres) ? d.genres.join(" • ") : d.genres);

                item.style("cursor", "pointer")
                    .on("click", function() {
                        const overviewDiv = d3.select(this).select(".overview-text");
                        const isClamped = overviewDiv.style("-webkit-line-clamp") === "2";
                        
                        if (isClamped) {
                            overviewDiv.style("-webkit-line-clamp", "unset");
                        } else {
                            overviewDiv.style("-webkit-line-clamp", "2");
                        }
                    });

                item.append("div")
                    .attr("class", "overview-text")
                    .style("font-size", "0.9em")
                    .style("color", "#444")
                    .style("margin-top", "8px")
                    .style("line-height", "1.4")
                    .style("display", "-webkit-box")
                    .style("-webkit-line-clamp", "2")
                    .style("-webkit-box-orient", "vertical")
                    .style("overflow", "hidden")
                    .attr("title", "Click to expand/collapse")
                    .text(d => d.overview);

                item.call(enter => enter.transition(t)
                    .style("opacity", 1)
                    .style("transform", "translateY(0)"));
                    
                return item;
            },
            update => update, // movies that stay keep their current state
            exit => exit.call(exit => exit.transition(t)
                .style("opacity", 0)
                .style("transform", "translateY(-10px)")
                .remove())
        )
        .order();
}
