function drawAll(data, current) {
    
    if (data.length > 0) {
        if (current != "map") {
            drawMap(data);
        }
        if (current != "bar") {
            drawBarChart(data);
        }
        if (current != "pie") {
            drawPieChart(data);
        }
        if (current != "scatter") {
            drawScatterPlot(data);
        }
        if (current != "pcp") {
            drawParallelCoordinates(data);
        }
    }
    else {
        // use default data
    }
}

document.getElementById("map-button").addEventListener("click", function() {
    d3.csv("Billionaires_Statistics_Dataset.csv").then(function (data) {
        drawMap(data);
        drawBarChart(data);
        drawPieChart(data);
        drawScatterPlot(data);
        drawParallelCoordinates(data);
    });
});