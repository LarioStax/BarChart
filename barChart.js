let URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let dataset;




// console.log(dataset);



let drawChart = function() {

	const width = 900;
	const height = 400;
	const padding = 60;
	const barWidth = (width - 2 * padding)/dataset.length;

	let svg = d3.select("svg")
	              .attr("width", width)
	              .attr("height", height)
	              .style("border", "1pt solid black")


	// Get minimum and maximum value for Y axis from dataset[1]
	let yMin = d3.min(dataset.map( (d) => d[1]));
	let yMax = d3.max(dataset.map( (d) => d[1]));

	// Get minimum and maximum date for X axis from dataset[0]
	let xMin = d3.min(dataset.map( (d) => d[0]));
			xMin = new Date(xMin);
	let xMax = d3.max(dataset.map( (d) => d[0]));
			xMax = new Date(xMax);

	//Create y Scale linearly scaled from 0 to yMax and inverted range
	let yScale = d3.scaleLinear()
										.domain([0, yMax])
										.range([height-padding, padding])

	//Create Y axis and extend gridlines to make a grid
	let yAxis = d3.axisLeft(yScale)
									.tickSize(-width + 2*padding)
									.tickSizeOuter(0)

	//Create x Scale linearly scaled from lowest to largest date
	let xScale = d3.scaleTime()
										.domain([xMin, xMax])
										.range([padding, width-padding])

	//Create X axis
	let xAxis = d3.axisBottom(xScale)
									.tickSize(-height + 2 * padding)
									.tickSizeOuter(0)

	// Create tooltop
	let toolTip = d3.select("body")
										.append("div")
											.style("position", "absolute")
											.style("background-color", "#eee")
											.style("color", "black")
											.style("padding", "5px")

	
	//mouse functions to show/adjust tooltip
	function handleMouseOver(el) {
		toolTip.transition().style("opacity", 0.8)
		toolTip.style("left", d3.event.pageX+10 + "px")
							.style("top", d3.event.pageY-10 + "px")
							.html(
								`<p>Date: ${el[0]}</p>
								<p>Billions: ${el[1]}` 
							)
		d3.select(this)
				.style("opacity", 0.5)
	}

	function handleMouseMovement(el) {
		toolTip.style("left", d3.event.pageX+10 + "px")
							.style("top", d3.event.pageY-10 + "px")
	}

	function handleMouseOut(el) {
		toolTip.transition().style("opacity", 0)
		d3.select(this)
			.style("opacity", 1)
	}

	// draw all rects and connect functions to mouse events
	svg
		.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
			.classed("bar", true)
			.attr("x", (d, i) => i*barWidth+padding)
			.attr("y", d => yScale(d[1]))
			.attr("width", barWidth)
			.attr("height", d => (height-padding) - yScale(d[1]))
			.attr("fill", "green")
			// .attr("stroke-width", "1px")
			// .attr("stroke", "#cccccc")
			.on("mouseover", handleMouseOver)
			.on("mousemove", handleMouseMovement)
			.on("mouseout", handleMouseOut)

	svg
		.append("g")
			.attr("id", "y-axis")
		// .attr("transform", "translate(" + height-padding + "," + padding + ")")
			.attr("transform", `translate( ${padding}, 0)`)
			.style("color", "white")
		.call(yAxis)

	svg
		.append("text")
			.attr("transform","rotate(-90)")
			.attr("x", -padding)
			.attr("y", 15)
			.style("text-anchor", "end")
			.attr("fill", "green")
			.text("USD in Billions")

	svg
		.append("g")
			.attr("id", "x-axis")
			.attr("transform", `translate(0, ${height-padding})`)
			.style("color", "white")
		.call(xAxis)
		.selectAll("text")
			.style("text-anchor", "end")
			.attr("transform", "rotate(-45)")
			.attr("dx", "-0.5em")
			.attr("dy", "1em")

	// svg
	// 	.append("text")
	// 		.attr("x", width-padding)
	// 		.attr("y", height-padding/2)
	// 		.style("text-anchor", "end")
	// 		.attr("fill", "white")
	// 		.text("YEAR")
}



//get the info from api and store it into dataset and then draw the chart
document.addEventListener("DOMContentLoaded", function() {
  let XHR = new XMLHttpRequest();
  XHR.onreadystatechange = function() {
    if (XHR.readyState === 4) {
      if (XHR.status === 200) {
        dataset = JSON.parse(XHR.responseText).data;
        console.log(dataset)
        drawChart();
      } else {
        console.log(`Something went wrong. Error: ${XHR.status}`)
      }
    }
  }
  XHR.open("GET", URL);
  XHR.send();
});