import * as d3 from 'd3';
import { containerWidth, showPlaceholder, VIZ_HEIGHT } from './vizUtils.js';

const GENRE_CONTAINER = "#genre-container";

const GENRE_COLORS = {
    "Adventure": "#4e79a7",
    "Animation": "#f28e2b",
    "Comedy": "#edc948",
    "Crime": "#e15759",
    "Documentary": "#bab0ac",
    "Drama": "#76b7b2",
    "Family": "#59a14f",
    "Fantasy": "#b07aa1",
    "History": "#9c755f",
    "Horror": "#7b2cbf",
    "Music": "#ff9da7",
    "Mystery": "#1b9e77",
    "Romance": "#d95f02",
    "Science Fiction": "#7570b3",
    "Thriller": "#e7298a",
    "TV Movie": "#17becf",
    "War": "#66a61e",
    "Western": "#e6ab02",
};

let genreColorScale = null;

export function initGenreColorScale(allMovies) {
    if (genreColorScale) return genreColorScale;

    const genres = new Set();
    allMovies.forEach(m => {
        m.genres.forEach(g => {
            const genre = g.trim();
            if (genre.toLowerCase() !== "action") genres.add(genre);
        });
    });

    const genreList = [...genres].sort();
    const overflowPalette = ["#8c564b", "#c49c94", "#c7c7c7", "#dbdb8d", "#9edae5"];
    let overflowIndex = 0;

    const colorByGenre = new Map(
        genreList.map(genre => [
            genre,
            GENRE_COLORS[genre] ?? overflowPalette[overflowIndex++ % overflowPalette.length],
        ])
    );

    genreColorScale = (genre) => colorByGenre.get(genre) ?? "#999";
    return genreColorScale;
}

export function showGenrePlaceholder(message) {
    showPlaceholder(GENRE_CONTAINER, message);
}

export function renderGenreChart(selectedMovies) {
    const container = d3.select(GENRE_CONTAINER).html("");

    const genreCounts = new Map();
    selectedMovies.forEach(m => {
        const genresList = Array.isArray(m.genres)
            ? m.genres
            : (m.genres ? m.genres.split(',').map(g => g.trim()) : []);

        genresList.forEach(g => {
            if (g.toLowerCase() === "action") return;
            genreCounts.set(g, (genreCounts.get(g) || 0) + 1);
        });
    });

    const totalMovies = selectedMovies.length || 1;
    const genreData = Array.from(genreCounts.entries())
        .map(([genre, count]) => ({
            genre,
            count,
            percentage: (count / totalMovies) * 100,
        }))
        .sort((a, b) => b.percentage - a.percentage);

    const genreWidth = containerWidth(GENRE_CONTAINER);
    const margin = { top: 10, right: 20, bottom: 90, left: 70 };
    const width = genreWidth - margin.left - margin.right;
    const height = VIZ_HEIGHT - margin.top - margin.bottom;

    const genreSvg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(genreData.map(d => d.genre))
        .range([0, width])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    const tooltip = container.append("div")
        .attr("class", "genre-tooltip")
        .style("opacity", 0);

    function showBarTooltip(event, d) {
        tooltip
            .style("opacity", 1)
            .html(
                `<strong>${d.genre}</strong><br>` +
                `Percentage: ${d.percentage.toFixed(1)}%<br>` +
                `Movies: ${d.count}`
            );
        moveBarTooltip(event);
    }

    function moveBarTooltip(event) {
        const [mx, my] = d3.pointer(event, container.node());
        tooltip
            .style("left", `${mx + 12}px`)
            .style("top", `${my - 10}px`);
    }

    function hideBarTooltip() {
        tooltip.style("opacity", 0);
    }

    genreSvg.selectAll(".bar")
        .data(genreData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.genre))
        .attr("y", d => yScale(d.percentage))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.percentage))
        .attr("fill", d => genreColorScale(d.genre))
        .style("cursor", "pointer")
        .on("mouseenter", showBarTooltip)
        .on("mousemove", moveBarTooltip)
        .on("mouseleave", hideBarTooltip);

    genreSvg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-40)")
        .attr("dx", "-0.6em")
        .attr("dy", "0.15em")
        .style("text-anchor", "end");

    genreSvg.append("g")
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => `${d}%`));

    genreSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -52)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "11px")
        .style("fill", "#555")
        .text("Percentage of movies in cluster");

    genreSvg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 62)
        .attr("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "11px")
        .style("fill", "#555")
        .text("Genre");
}
