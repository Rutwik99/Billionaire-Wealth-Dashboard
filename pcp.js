const categoricalVariables = ["selfMade", "gender"];
const numericalVariables = ["age", "cpi_country", "life_expectancy_country", "total_tax_rate_country", "gross_primary_education_enrollment_country"];

// Custom labels mapping
const customLabels = {
    "age": "Age",
    "selfMade": "Self Made",
    "gender": "Gender",
    "cpi_country": "CPI",
    "life_expectancy_country": "Life Expectancy",
    "total_tax_rate_country": "Total Tax Rate",
    "gross_primary_education_enrollment_country": "Primary Education Enrollment"
};

function drawParallelCoordinates(data) {
    const margin = { top: 50, right: 10, bottom: 20, left: 10 },
        width = 800 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // Clear any existing SVG to redraw
    d3.select("#pcp").select("svg").remove();

    const svg = d3.select("#pcp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales for each dimension
    const x = d3.scaleBand()
        .range([0, width])
        .padding(1);

    let y = {};
    const dimensions = Object.keys(data[0]).filter(d => (categoricalVariables.includes(d) || numericalVariables.includes(d)));

    dimensions.forEach(d => {
        y[d] = categoricalVariables.includes(d) ?
            d3.scalePoint()
                .domain(Array.from(new Set(data.map(p => p[d]))).sort())
                .range([height, 0])
                .padding(1) :
            d3.scaleLinear()
                .domain(d3.extent(data, p => +p[d]))
                .range([height, 0]);
    });

    x.domain(dimensions);

    // Function to draw the path for each data point
    function path(d) {
        return d3.line().curve(d3.curveCardinal)(dimensions.map(p => [x(p), y[p](d[p])]));
    }

    // Draw the lines
    svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path)
        .attr("stroke", "steelblue")
        .attr("fill", "none")
        .attr("opacity", 0.5);

    // Add a group element for each dimension
    const g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", d => `translate(${x(d)})`);

    // Add an axis and title
    g.append("g")
        .attr("class", "axis")
        .each(function (d) { d3.select(this).call(d3.axisLeft(y[d])); })
        .append("text")
        .attr("y", -9)
        .attr("style", "text-anchor: middle")
        .attr("fill", "black")
        .attr("transform", "rotate(-10)")
        .text(d => customLabels[d]); // Use custom labels

    // Add and store a brush for each axis
    g.append("g")
        .attr("class", "brush")
        .each(function (d) {
            d3.select(this).call(d3.brushY()
                .extent([[-8, 0], [8, height]])
                .on("brush", function (event) {
                    const actives = [];
                    svg.selectAll(".brush")
                        .filter(function (d) { return d3.brushSelection(this); })
                        .each(function (d) { actives.push({ dimension: d, extent: d3.brushSelection(this) }); });

                    const brushedData = data.filter(d => {
                        return actives.every(p => {
                            const dim = p.dimension, extent = p.extent;
                            return extent[0] <= y[dim](d[dim]) && y[dim](d[dim]) <= extent[1];
                        });
                    });

                    svg.selectAll("path")
                        .attr("stroke", function (d) {
                            return brushedData.includes(d) ? "lightcoral" : "lightgrey";
                        });

                    drawPieChart(brushedData);
                }));
        });

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -27) // Adjust this value to position the title
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        // .style("text-decoration", "underline")
        .text("PARALLEL COORDINATES PLOT");
}

// Load data and initialize the plot
d3.csv('Billionaires_Statistics_Dataset.csv').then(drawParallelCoordinates);
