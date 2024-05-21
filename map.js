function addContinuousLegend(svg, colorScale, maxPeople) {
    const legendWidth = 75, legendHeight = 10, margin = {top: 50, left: 50};

    const legend = svg.append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    // Calculate colors for the gradient stops based on the scale
    const numStops = 200;  // More stops can make the gradient smoother
    for (let i = 0; i <= numStops; i++) {
        const offset = i / numStops;
        const value = offset * maxPeople;  // Scale the value
        legend.append("stop")
            .attr("offset", `${offset * 100}%`)
            .attr("stop-color", colorScale(value))
            .attr("stop-opacity", 1);
    }

    // Draw the color gradient bar
    svg.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("x", margin.left - 50)
      .attr("y", margin.top - 95)
      .style("fill", "url(#gradient)")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add text labels for minimum and maximum values
    svg.append("text")
      .attr("x", margin.left - 40)
      .attr("y", margin.top - 35)
      .style("text-anchor", "start")
      .text("Low");

    svg.append("text")
      .attr("x", margin.left + 110)
      .attr("y", margin.top - 35)
      .style("text-anchor", "end")
      .text("High");

    svg.append("text")
      .attr("x", margin.left + 270)
      .attr("y", margin.top - 30)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      // .style("text-decoration", "underline")
      // .style("font-family", "Montserrat, sans-serif")
      .text("BILLIONAIRE POPULATION");
}



function drawMap(data) {
    // Load geographic data within the function
    d3.select("#map").select("svg").remove();
    Promise.all([
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    ]).then(function(files) {
        const geoData = files[0];

        // Mapping object to handle name discrepancies
        const countryNameMapping = {
            "United States": "USA",
            "UK": "United Kingdom",
            // Add other mappings as needed
        };

        // Process data to count people per country using the mapping
        const peopleCountByCountry = {};
        data.forEach(person => {
            let country = person.country; // Ensure this matches your CSV column
            if (countryNameMapping[country]) {
                country = countryNameMapping[country]; // Normalize country name
            }
            peopleCountByCountry[country] = (peopleCountByCountry[country] || 0) + 1;
        });

        // Set dimensions and create SVG
        const width = 600, height = 280;
        const svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height);

        // Create a color scale
        const maxPeople = Math.max(...Object.values(peopleCountByCountry));
        const colorScale = d3.scaleSequentialLog([1, maxPeople], d3.interpolateBlues);

        // Draw the map
        const projection = d3.geoNaturalEarth1().scale(120).translate([width / 3, height / 3 + 100]);
        const path = d3.geoPath().projection(projection);
        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on("zoom", (event) => {
                svg.selectAll("g").attr("transform", event.transform);
            });
        svg.call(zoom);

        const g = svg.append("g");

        g.selectAll("path")
            .data(geoData.features)
            .enter().append("path")
                .attr("fill", d => {
                    const count = peopleCountByCountry[d.properties.name];
                    return count ? colorScale(count) : "#ccc";
                })
                .attr("d", path)
                .attr("stroke", "black")
                .on("click", function(event, d) {
                    g.selectAll("path").attr("fill", d => peopleCountByCountry[d.properties.name] ? colorScale(peopleCountByCountry[d.properties.name]) : "#ccc");
                    d3.select(this).attr("fill", "lightcoral");

                    let selectedCountryName = d.properties.name;
                    let newData = data.filter(person => {
                        let country = person.country;
                        if (countryNameMapping[country]) {
                            country = countryNameMapping[country];
                        }
                        return country === selectedCountryName;
                    });

                    // console.log(newData);
                    drawAll(newData, "map");

                })
                .append("title")
                .text(d => `${d.properties.name}: ${peopleCountByCountry[d.properties.name] || "No data"}`);

        // g.append("text")
        //     .attr("x", width / 2)
        //     .attr("y", 20)
        //     .attr("text-anchor", "middle")
        //     .style("font-size", "24px")
        //     // .style("text-decoration", "underline")
        //     // .style("font-family", "Montserrat, sans-serif")
        //     .text("WORLD MAP");

        addContinuousLegend(svg, colorScale, maxPeople);
        
        d3.select("body").on("keydown", function(event) {
            if (event.key === "=" || event.key === "+") {
                svg.transition().call(zoom.scaleBy, 1.2);
            } else if (event.key === "-") {
                svg.transition().call(zoom.scaleBy, 0.8);
            }
        });
    });
}


d3.csv("Billionaires_Statistics_Dataset.csv").then(function (data) {
    drawMap(data);
});
