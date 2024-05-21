// Function that draws the scatter plot
function drawScatterPlot(data) {
    d3.select("#scatter").select("svg").remove();

    data.forEach(d => {
        d.age = +d.age;         // Convert age to number
        d.finalWorth = +d.finalWorth; // Convert wealth to number
        d.gender = d.gender; // Convert gender to string
    });
    
    const filteredData = data.filter(d => d.age !== 0);
    
    const margin = { top: 30, right: 20, bottom: 40, left: 70 },
          width = 370 - margin.left - margin.right,
          height = 280 - margin.top - margin.bottom;

    // Append the svg object to the div with the 'plot' class
    const svg = d3.select("#scatter").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.age)])
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    const y_temp = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.finalWorth)])
        .range([height, 0]);

    const y = d3.scaleLog().base(2)
        .domain([d3.min(filteredData, d => d.finalWorth), d3.max(filteredData, d => d.finalWorth)])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y_temp));

    // Add dots
    const dots = svg.append('g')
        .selectAll("dot")
        .data(filteredData)
        .enter()
        .append("circle")
          .attr("cx", d => x(d.age))
          .attr("cy", d => y(d.finalWorth))
          .attr("r", 2)
          .style("fill", d => d.gender === 'M' ? "#4e73df" : "#e83e8c")
          .style("opacity", 1)
          .on("mouseover", function(event, d) {
            // Add your hover effect here
            // For example, you could display a tooltip with the billionaire's details
          })
          .on("mouseout", function(d) {
            // Remove your hover effect here
            // For example, you could hide the tooltip
          });

    const brush = d3.brush()
    .extent([[0, 0], [width, height]])
    .on("start brush", brushed)
    .on("end", brushend);
  
    svg.append("g")
        .call(brush);

    function brushed({selection}) {
        if (selection) {
            const [[x0, y0], [x1, y1]] = selection;
            const brushedData = filteredData.filter(d => x0 <= x(d.age) && x(d.age) <= x1 && y0 <= y(d.finalWorth) && y(d.finalWorth) <= y1);
            dots.style("opacity", d => {
                return x0 <= x(d.age) && x(d.age) <= x1 && y0 <= y(d.finalWorth) && y(d.finalWorth) <= y1 ? 1 : 0.2;
            });
            // console.log(brushedData);
            drawPieChart(brushedData);
            drawBarChart(brushedData);
            // d3.select("#map").select("svg").remove();
            // drawMap(brushedData);
            // drawAll(brushedData, "scatter");
        }
    }
    
    function brushend({selection}) {
        if (!selection) {
            dots.style("opacity", 1);
            drawPieChart(data);
            drawBarChart(data);
            // drawMap(data);
            // drawAll(data);
        }
    }

    // Add X axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Age");

    // Add Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Final Worth");

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 70}, 10)`); // Adjust the position as needed

    // Male legend item
    legend.append("circle")
        .attr("cx", -180)
        .attr("cy", 10)
        .attr("r", 6)
        .style("fill", "#4e73df")
        .on("mouseover", function() {
            dots.style("opacity", d => d.gender === 'M' ? 1 : 0.2);
        })
        .on("mouseout", function() {
            dots.style("opacity", 1);
        });

    legend.append("text")
        .attr("x", -170)
        .attr("y", 14)
        .style("font-size", "12px")
        .text("Male");

    // Female legend item
    legend.append("circle")
        .attr("cx", -180)
        .attr("cy", 30)
        .attr("r", 6)
        .style("fill", "#e83e8c")
        .on("mouseover", function() {
            dots.style("opacity", d => d.gender === 'F' ? 1 : 0.2);
        })
        .on("mouseout", function() {
            dots.style("opacity", 1);
        });

    legend.append("text")
        .attr("x", -170)
        .attr("y", 34)
        .style("font-size", "12px")
        .text("Female");

    svg.append("text")
        .attr("x", width / 2 - 20)
        .attr("y", -5) // Adjust this value to position the title
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        // .style("text-decoration", "underline")
        .text("AGE AND GENDER");
    // Add labels or tooltips here using svg.append, and style them as needed.
}

// Assuming you have a way to load your CSV data, call this function with that data
d3.csv("Billionaires_Statistics_Dataset.csv").then(function(data) {
    // Call the function to draw the scatter plot with the processed data
    drawScatterPlot(data);
});
