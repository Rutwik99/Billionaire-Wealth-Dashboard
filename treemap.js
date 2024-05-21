function drawTreeMap(data) {
    const margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 445 - margin.left - margin.right,
    height = 445 - margin.top - margin.bottom;
    
    // append the svg object to the body of the page
    const svg = d3.select("#treemap")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
    `translate(${margin.left}, ${margin.top})`);
    
    // Read data
    // d3.csv('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_hierarchy_1level.csv').then(function(data) {
        
        // stratify the data: reformatting for d3.js
        const root = d3.stratify()
        .id(function(d) { return d.country; })   // Name of the entity (column name is name in csv)
        // .parentId(function(d) { return d.parent; })   // Name of the parent (column name is parent in csv)
        (data);
        root.sum(function(d) { return +d.gdp_country })   // Compute the numeric value for each entity
        
        // Then d3.treemap computes the position of each element of the hierarchy
        // The coordinates are added to the root object above
        d3.treemap()
        .size([width, height])
        .padding(4)
        (root)
        
        // use this information to add rectangles:
        svg
        .selectAll("rect")
        .data(root.leaves())
        .join("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", "#69b3a2");
        
        // and to add the text labels
        svg
        .selectAll("text")
        .data(root.leaves())
        .join("text")
        .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
        .text(function(d){ return d.data.name})
        .attr("font-size", "15px")
        .attr("fill", "white")
        // }
        // )
        
}
// function drawTreeMap(data) {
//     // Aggregate GDP values for each country
//     const nestedData = Array.from(d3.rollup(
//         data,
//         v => d3.sum(v, d => d.gdp_country),
//         d => d.country
//     ), ([key, value]) => ({ country: key, gdp: value }));

//     // Set up the dimensions and margins for the treemap
//     const margin = { top: 40, right: 10, bottom: 10, left: 10 },
//           width = 960 - margin.left - margin.right,
//           height = 600 - margin.top - margin.bottom;

//     // Append the svg object to the div with id 'treemap'
//     const svg = d3.select("#treemap").append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);

//     // Stratify the data
//     const root = d3.stratify()
//         .id(d => d.country)
//         .parentId(d => null)
//         (nestedData);

//     root.sum(d => d.gdp);

//     // Create the treemap layout
//     d3.treemap()
//         .size([width, height])
//         .padding(4)
//         (root);

//     // Add rectangles for each node
//     const nodes = svg.selectAll("g")
//         .data(root.leaves())
//         .enter()
//         .append("g")
//         .attr("transform", d => `translate(${d.x0},${d.y0})`);

//     nodes.append("rect")
//         .attr("width", d => d.x1 - d.x0)
//         .attr("height", d => d.y1 - d.y0)
//         .style("stroke", "black")
//         .style("fill", "#69b3a2");

//     // Add labels for each rectangle
//     nodes.append("text")
//         .attr("x", 5)
//         .attr("y", 20)
//         .text(d => d.data.id)
//         .attr("font-size", "12px")
//         .attr("fill", "white");

//     nodes.append("text")
//         .attr("x", 5)
//         .attr("y", 35)
//         .text(d => `$${d.value.toFixed(0)}B`)
//         .attr("font-size", "12px")
//         .attr("fill", "white");

//     // Add a title for the treemap
//     svg.append("text")
//         .attr("x", width / 2)
//         .attr("y", -10)
//         .attr("text-anchor", "middle")
//         .style("font-size", "24px")
//         .style("font-weight", "bold")
//         .text("Countries and their GDP ($B)");
// }

// Load the CSV data and call the drawTreeMap function
d3.csv("Billionaires_Statistics_Dataset.csv").then(function(data) {
    // Convert GDP values to numbers
    data.forEach(d => {
        d.gdp_country = +d.gdp_country;
    });
    // Call the function to draw the treemap with the processed data
    drawTreeMap(data);
});
