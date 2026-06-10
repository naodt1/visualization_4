import * as d3 from 'd3';
import { showPlaceholder } from './vizUtils.js';

const PROFIT_CONTAINER = "#profit-container";
const PROFIT_PLACEHOLDER = "Profit visualization goes here.";

export function showProfitPlaceholder(message = PROFIT_PLACEHOLDER) {
    showPlaceholder(PROFIT_CONTAINER, message);
}

export function renderProfitViz(selectedMovies, allMovies) {
    if (!selectedMovies || selectedMovies.length === 0) {
        showProfitPlaceholder();
        return;
    }

    // Compute fixed global scale from all movies so the axis never jumps around
    let globalData = (allMovies || selectedMovies).map(m => ({
        profit: m.revenue - m.budget
    }));
    const globalMaxProfit = d3.max(globalData, d => Math.abs(d.profit)) || 1;

    let data = selectedMovies.map(m => ({
        title: m.title,
        profit: m.revenue - m.budget
    }));

    const container = d3.select(PROFIT_CONTAINER);
    container.selectAll("*").remove();
    
    // Add tooltip div
    const tooltip = container.append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(0, 0, 0, 0.85)")
        .style("color", "#fff")
        .style("padding", "8px 12px")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("font-family", "sans-serif")
        .style("pointer-events", "none")
        .style("z-index", "10");

    const margin = { top: 30, right: 40, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 40; // Height of the gradient bar

    container.style("position", "relative");

    const svg = container.append("svg")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

    const x = d3.scaleLinear()
        .domain([-globalMaxProfit, globalMaxProfit])
        .range([0, width]);

    // Requested Color Scale: Teal (loss), Cream (break even), Terracotta (profit)
    const colorScale = d3.scaleLinear()
        .domain([0, 0.5, 1])
        .range(["#2a7e72", "#f3ecdb", "#c45839"]);

    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", "profit-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");
    
    gradient.append("stop").attr("offset", "0%").attr("stop-color", colorScale(0));
    gradient.append("stop").attr("offset", "50%").attr("stop-color", colorScale(0.5));
    gradient.append("stop").attr("offset", "100%").attr("stop-color", colorScale(1));

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Draw solid gradient bar for the global scale
    g.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "url(#profit-gradient)")
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("stroke", "#ddd");

    // Continuous X Axis
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(8).tickFormat(d => "$" + d3.format("~s")(d)))
        .selectAll("text")
        .style("font-size", "12px")
        .style("font-family", "sans-serif")
        .style("color", "#333");

    // Zero line
    g.append("line")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y1", -5)
        .attr("y2", height + 5)
        .attr("stroke", "#333")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,2");

    // Add movie markers (1D Strip Plot points over the bar)
    // Only plots the selected cluster's movies onto the global scale
    g.selectAll(".movie-marker")
        .data(data)
        .join("circle")
        .attr("class", "movie-marker")
        .attr("cx", d => x(d.profit))
        .attr("cy", height / 2)
        .attr("r", 6)
        .attr("fill", "rgba(255, 255, 255, 0.7)")
        .attr("stroke", "#111827")
        .attr("stroke-width", 1.5)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("r", 9).attr("fill", "#fff").attr("stroke-width", 2.5).raise();
            tooltip.style("visibility", "visible")
                .html(`<strong>${d.title}</strong><br/>Profit: $${d3.format(",.0f")(d.profit)}`);
        })
        .on("mousemove", function(event) {
            const [mx, my] = d3.pointer(event, container.node());
            tooltip.style("top", (my - 45) + "px")
                   .style("left", (mx + 15) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("r", 6).attr("fill", "rgba(255, 255, 255, 0.7)").attr("stroke-width", 1.5);
            tooltip.style("visibility", "hidden");
        });
}
