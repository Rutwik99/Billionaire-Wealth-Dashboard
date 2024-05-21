// Function that draws the pie chart
function drawPieChart(data) {
    d3.select("#pie").select("svg").remove();

    // Assuming 'data' is an array of objects with 'selfMade' property
    const width = 250,
          height = 250,
          margin = 10;

    const radius = Math.min(width, height) / 2 - margin - 10;

    // Append the svg object to the div with the 'plot' class
    const svg = d3.select("#pie").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${(height / 2) + 10})`);

    const counts = { "Self-Made": 0, "Inherited": 0 };

    data.forEach(d => {
        if(d.selfMade === "TRUE") {
            counts["Self-Made"] += 1;
        } else {
            counts["Inherited"] += 1;
        }
    });

    // Now convert this counts to a percentage
    const total = counts["Self-Made"] + counts["Inherited"];
    const dataForPie = {
        "Self-Made": (counts["Self-Made"] / total * 100).toFixed(2),
        "Inherited": (counts["Inherited"] / total * 100).toFixed(2)
    };
    
    const dataForPieChart = Object.keys(dataForPie).map(key => ({ key: key, value: dataForPie[key] }));

    // Set the color scale
    const color = d3.scaleOrdinal()
        .domain(dataForPieChart.map(d => d.key)) // This ensures that the color scale domain is based on the data keys
        .range(["#4e73df", "#1cc88a"]);

    // Compute the position of each group on the pie
    const pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(d => d.value);


    const data_ready = pie(dataForPieChart);

    // Shape helper to build arcs
    const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
    
    const arcHover = d3.arc()
        .innerRadius(0)
        .outerRadius(radius + 10);  // Increased radius for hover

    // Build the pie chart
    svg.selectAll('slices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', d => color(d.data.key))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        .on("mouseover", function(event, d) {
            d3.select(this)
              .transition()
              .duration(100)
              .attr('d', arcHover(d));
        })
        .on("mouseout", function(event, d) {
            d3.select(this)
              .transition()
              .duration(100)
              .attr('d', arcGenerator(d));
        })
        .on("click", function(event, d) {
            // svg.selectAll('path').attr('fill', d => color(d.data.key));
            
            // d3.select(this).attr('fill', 'lightcoral');
            
            // const newData = data.filter(x => (x.selfMade === "TRUE" && d.data.key === "Self-Made") || (x.selfMade !== "TRUE" && d.data.key === "Inherited"));
            
            // drawAll(newData);
        });

    // Now add the annotation. Use central angle to determine position for labels
    // svg.selectAll('slices')
    //     .data(data_ready)
    //     .enter()
    //     .append('text')
    //     .text(d => `${d.data.key} (${d.data.value}%)`)
    //     .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
    //     .style("text-anchor", "middle")
    //     .style("font-size", 14);

    svg.selectAll('textLabels')
        .data(data_ready)
        .enter()
        .append('text')
        .text(d => `${d.data.key} (${d.data.value}%)`)
        .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", 14);

    svg.append("text")
        .attr("x", 0)
        .attr("y", -110) // Adjust this value to position the title
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        // .style("text-decoration", "underline")
        .text("SELF MADE?");
    // Optional: Add click event handlers or tooltips here
}

// Assuming you have a way to load your CSV data, call this function with that data
d3.csv("Billionaires_Statistics_Dataset.csv").then(function(data) {
    drawPieChart(data); // Now draw the chart with the prepared data
});
