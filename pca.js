// Function to draw PCA plot
function drawPCA(data) {
    const margin = { top: 20, right: 20, bottom: 50, left: 40 },
          width = 350 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3.select("#pca").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales within the inner dimensions
    const xScale = d3.scaleLinear()
        .range([0, width])
        .domain(d3.extent(data.components, d => d[0])).nice();

    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain(d3.extent(data.components, d => d[1])).nice();

    // Add X axis
    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    // Add Y axis
    const yAxis = svg.append("g")
        .call(d3.axisLeft(yScale));

    // console.log(data.components);
    // Draw points
    svg.selectAll(".point")
        .data(data.components)
        .enter().append("circle")
        .attr("class", "point")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => yScale(d[1]))
        .attr("r", 2)
        .style("fill", "blue");

    // Draw loading vectors
    // svg.selectAll(".vector")
    //     .data(data.loadings)
    //     .enter().append("line")
    //     .attr("x1", xScale(0))
    //     .attr("y1", yScale(0))
    //     .attr("x2", d => xScale(d.PC1))
    //     .attr("y2", d => yScale(d.PC2))
    //     .attr("stroke", "red")
    //     .attr("stroke-width", 2);

    // Add labels for each vector
    // svg.selectAll(".label")
    //     .data(data.loadings)
    //     .enter().append("text")
    //     .attr("x", d => xScale(d.PC1))
    //     .attr("y", d => yScale(d.PC2))
    //     .attr("dy", "0.35em") // Center align text vertically
    //     .text(d => d.variable)
    //     .style("text-anchor", "middle")
    //     .attr("fill", "green");

    // Label Axes
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width / 2 + margin.left)
        .attr("y", height + margin.top + 20)
        .text("Principal Component 1");

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top - height / 2 + 100)
        .text("Principal Component 2");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0) // Adjust this value to position the title
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("PCA Plot");
}

// Load data and call drawPCA
d3.json('pca_results.json').then(data => {
    drawPCA(data);
});
