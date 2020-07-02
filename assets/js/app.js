// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 900;
var svgHeight = 600;

var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
}

// Set the dimensions of the area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select the area the SVG will added to, append it, and set its dimensions
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append a group area, then set its dimensions
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from the data csv
d3.csv("/assets/data/data.csv").then(function(smokerData) {

    // Format the data we are interested in for the smoker v age data
    smokerData.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
    });

    // Configure a time scale with a range between 0 and the chartWidth
    // Set the domain for the xTimeScale function
    var xLinearScale = d3.scaleLinear()
        .range([0, chartWidth])
        .domain([28, d3.max(smokerData, d => d.age)]);

    // Configure a linear scale with a range between the chartHeight and 0
    var yLinearScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([8, d3.max(smokerData, d => d.smokes)]);

    // Create two functions ro pass the scales in as arguments
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append axis to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create cirlces
    var circlesGroup = chartGroup.selectAll("circle")
      .data(smokerData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.age))
      .attr("cy", d => yLinearScale(d.smokes))
      .attr("r", "15")
      .attr("fill", "lightblue")
      .attr("opacity", ".5");

    var textsGroup = chartGroup.selectAll("g")
      .select("circle")
      .data(smokerData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d.age))
      .attr("y", d => yLinearScale(d.smokes-.2))
      .attr("text-anchor", "middle")
      .text(function(d) {
        return  d.abbr;
      });

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 10)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Number of Smokers");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top - 10})`)
      .attr("class", "axisText")
      .text("Avg Age of Smoker");

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
          return (`${d.state}<br>Avg Age: ${d.age}<br>Percent Smoke: ${d.smoke}%`);
      });

    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

}).catch(function(error) {
    console.log(error);
  });