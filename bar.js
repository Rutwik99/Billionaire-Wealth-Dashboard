function aggregateData(data) {
    const aggregated = data.reduce((acc, d) => {
        acc[d.industries] = (acc[d.industries] || 0) + d.finalWorth;
        return acc;
    }, {});

    // Convert the aggregated object back to an array and sort it
    const aggregatedArray = Object.entries(aggregated).map(([industry, finalWorth]) => ({
        industries: industry,
        finalWorth: finalWorth
    }));

    // Sort the array in descending order of finalWorth
    aggregatedArray.sort((a, b) => b.finalWorth - a.finalWorth);

    return aggregatedArray;
}

function drawBarChart(data) {
    // Assuming 'data' is an array of objects with 'industries' and 'finalWorth' properties
    d3.select("#bar").select("svg").remove();

    data.forEach(function(d) {
        d.finalWorth = +d.finalWorth; 
        d.industries = d.industries;
    });
    
    filteredData = aggregateData(data);

    // console.log(filteredData);
    // Set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 100, left: 65 },
          width = 400 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#bar").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(filteredData.map(d => d.industries))
        .padding(0.2);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.finalWorth)])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -110)
        .attr("y", margin.left - 97)
        .attr("dy", "-1.5em")
        .style("font-size", "14px")
        .style("text-anchor", "middle")
        .text("Final Worth");

    // console.log(filteredData);
    // Bars
    const bars = svg.selectAll("mybar")
        .data(filteredData)
        .enter()
        .append("rect")
        .attr("class", "bars")
        .attr("x", d => x(d.industries))
        .attr("y", d => y(d.finalWorth))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.finalWorth))
        .attr("fill", "#69b3a2")
        .on("click", function(event, d) {
            bars.attr("fill", "#69b3a2");
            d3.select(this).attr("fill", "lightcoral");
            const newData = data.filter(item => item.industries === d.industries);
            // console.log(newData);
            drawAll(newData, "bar");
        });

    svg.append("text")
        .attr("x", width / 2 + 10)
        .attr("y", 20) // Adjust this value to position the title
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        // .style("text-decoration", "underline")
        .text("WHICH INDUSTRY?");
    // Optional: Add labels or tooltips here using `svg.append`
}

// Assuming you have a way to load your CSV data, call this function with that data
d3.csv("Billionaires_Statistics_Dataset.csv").then(function(data) {
    // Convert data if necessary
    drawBarChart(data); // Now draw the chart with the loaded data
});
