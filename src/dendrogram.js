import * as d3 from 'd3';

export function createDendrogram(rootNode, containerSelector, onNodeSelect) {
    // 1. Clear out container placeholder
    const container = d3.select(containerSelector).html("");

    // 2. Dimensions Setup
    const margin = { top: 60, right: 85, bottom: 95, left: 50 };
    const width = 530 - margin.left - margin.right;
    const height = 480 - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 3. Compute Horizontal Distributions
    const clusterLayout = d3.cluster().size([width, height]);
    clusterLayout(rootNode);

    // 4. Distance Processing for Vertical Mapping
    const distances = rootNode.descendants().map(d => d.data.distance || 0);
    const maxDistance = d3.max(distances);

    // Vertical Y Scale: Early merges near bottom baseline, wide-gapped later merges higher up
    const yScale = d3.scaleLinear()
        .domain([0, maxDistance * 1.05]) // 5% top buffer safety padding
        .range([height, 0]);

    // Align all leaf nodes perfectly flat on the X-Axis baseline
    function getY(d) {
        if (!d.children) {
            return yScale(0);
        }
        return yScale(d.data.distance || 0);
    }

    // 5. Clean, Fixed Sequential Color Scale
    const sequentialScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([-0.5, maxDistance]);

    // Color Legend Generation
    const defs = svg.append("defs");
    const linearGradient = defs.append("linearGradient")
        .attr("id", "dendrogram-sequential-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    // Build multi-stop samples to perfectly mirror the color interpolator curve
    const numStops = 10;
    for (let i = 0; i <= numStops; i++) {
        const pct = i / numStops;
        const distanceVal = pct * maxDistance;
        linearGradient.append("stop")
            .attr("offset", `${pct * 100}%`)
            .attr("stop-color", sequentialScale(distanceVal));
    }

    // Legend Container Group (Positioned at the top right)
    const legendG = svg.append("g")
        .attr("class", "color-legend")
        .attr("transform", `translate(${width - 140}, -45)`);

    // Draw the Legend Color Bar Rect
    legendG.append("rect")
        .attr("width", 140)
        .attr("height", 10)
        .style("fill", "url(#dendrogram-sequential-gradient)")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 0.5);

    // Legend Header Title
    legendG.append("text")
        .attr("x", 0)
        .attr("y", -6)
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("fill", "#444")
        .style("font-weight", "bold")
        .text("Merge Distance (Euclidean)");

    // Min boundary indicator label
    legendG.append("text")
        .attr("x", 0)
        .attr("y", 22)
        .style("font-family", "sans-serif")
        .style("font-size", "9px")
        .style("fill", "#666")
        .text("0.0 (Similar)");

    // Max boundary indicator label
    legendG.append("text")
        .attr("x", 140)
        .attr("y", 22)
        .attr("text-anchor", "end")
        .style("font-family", "sans-serif")
        .style("font-size", "9px")
        .style("fill", "#666")
        .text(`${maxDistance.toFixed(1)} (Distant)`);

    // 6. Vertical Right-Angled Orthogonal Elbow Link Generator
    function drawVerticalElbow(d) {
        const sourceX = d.source.x;
        const sourceY = getY(d.source);
        const targetX = d.target.x;
        const targetY = getY(d.target);

        return `M ${sourceX} ${sourceY} H ${targetX} V ${targetY}`;
    }

    // Draw lines with direct sequential styling
    svg.append("g")
        .attr("class", "links")
      .selectAll(".link")
        .data(rootNode.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", drawVerticalElbow)
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", d => sequentialScale(d.target.data.distance || 0));

    // 7. Render Interactive Cluster Node Checkpoints
    const nodes = svg.append("g")
        .attr("class", "nodes")
      .selectAll(".node")
        .data(rootNode.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${getY(d)})`);

    nodes.append("circle")
        .attr("r", d => d.children ? 5 : 3.5)
        .attr("fill", d => d.children ? "#fff" : "#777")
        .attr("stroke", "#333")
        .attr("stroke-width", 1.5)
        .style("cursor", d => d.children ? "pointer" : "default")
        .on("click", function(event, d) {
            event.stopPropagation();
            if (!d.children) return; 

            d3.selectAll(".node circle")
                .attr("r", n => n.children ? 5 : 3.5)
                .attr("fill", n => n.children ? "#fff" : "#777");

            d3.select(this)
                .attr("r", 8)
                .attr("fill", "#ffcc00");

            if (onNodeSelect) {
                onNodeSelect(d.data.movie_ids, d.data);
            }
        })
        .on("mouseenter", function(event, d) {
            if (d.children) {
                d3.select(this).transition().duration(100).attr("r", 7.5);
            }
        })
        .on("mouseleave", function(event, d) {
            if (d3.select(this).attr("fill") !== "#ffcc00") {
                d3.select(this).transition().duration(100).attr("r", d.children ? 5 : 3.5);
            }
        });

    // Append angled leaf text descriptors below baseline
    nodes.filter(d => !d.children)
        .append("text")
        .attr("transform", "rotate(45)")
        .attr("text-anchor", "start")
        .attr("dx", "7")
        .attr("dy", "5")
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("fill", "#555")
        .style("font-weight", "500")
        .text(d => `ID: ${d.data.id} (${d.data.movie_ids ? d.data.movie_ids.length : 0} titles)`);

    // 8. Draw the Left Axes
    const yAxis = d3.axisLeft(yScale).ticks(6);
    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 18)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "11px")
        .style("fill", "#555")
        .text("Euclidean Cluster Merge Distance");

    // Structural baseline line running directly under the leaves
    svg.append("line")
        .attr("x1", 0)
        .attr("y1", height)
        .attr("x2", width)
        .attr("y2", height)
        .attr("stroke", "#aaa")
        .attr("stroke-width", 1);
}