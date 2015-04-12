// Do a bar chart of solar days where on the slider transition, you
// do a ease in or something.
function solar_days () {
    var o = new XMLHttpRequest();
    o.open("GET", "planetsdata", false);
    o.send();
    var margin = {top:20, right:30, bottom:30, left:30},
	width = 640 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;
    
    var p_data = JSON.parse(o.responseText).planets,
	maps = p_data.map(function (d) { return d3.map(d);}),
	smallest = d3.min(maps, function (d) {
	    var i = d.entries()[0];
	    if (typeof(i.value.MEAN_SOLAR_DAY) == "undefined")
		return 100;
	    return +i.value.MEAN_SOLAR_DAY.MEAN_SOLAR_DAY;
	}),
	largest = d3.max(maps, function (d) {
	    var i = d.entries()[0];
	    if (typeof(i.value.MEAN_SOLAR_DAY) == "undefined")
		return 0;
	    return +i.value.MEAN_SOLAR_DAY.MEAN_SOLAR_DAY;
	});
    var x = d3.scale.linear().range([0, width]),
	y = d3.scale.ordinal().rangeRoundBands([height, 0], .1),
	x_axis = d3.svg.axis().scale(x).orient("bottom").tickSize(-height),
	y_axis = d3.svg.axis().scale(y).orient("right").tickSize(-width);

    x.domain([0, largest]);
    y.domain(maps.map(function (d) { return d.entries()[0].key; }));
    var chart = d3.select("body")
	    .append("svg")
	    .attr({width:width, height:height})
    	    .style("border-style", "groove");

    chart.append("text")
	.attr("class", "x label")
	.attr("text-anchor", "middle")
	.attr({x:200, y:20})
	.text("Mean Solar Days Relative to Earth");

    chart.append("g")
	.attr("class", "x axis")
	.call(x_axis)
	.select(".tick line")
	.style("stroke", "#000");

    chart.append("g")
	.attr("class", "y axis")
	.call(y_axis);

    chart.selectAll(".bar")
	.data(maps)
	.enter().append("rect")
	.attr("class", "bar")
	.attr("x", function (d) {
	    return 50;
	})
	.attr("width", function (d) {
	    return y(d.entries()[0].key);
	})
	.attr("y", function (d) {
	    return y(d.entries()[0].key);
	})
	.attr("height", function (d) {
	    return y.rangeBand();
	});
}
function chart1 (flat, mass, mass_density, mean_solar_day) {
    var g = d3.select("#planet_stats")
	    .style("border-style", "groove")
	    .append("g");
    var y_spacing = 20,
	x_pos = 30;
    g.append("text")
	.text("Quick Planet Stats")
	.attr({x:5, y:y_spacing += 20});
    g.append("text")
	.text("Flattening: " + (+flat).toFixed(2))
	.attr({x:x_pos, y:y_spacing += 30});
    g.append("text")
	.text("Mass: " + (+mass))
	.attr({x:x_pos, y:y_spacing += 30});
    g.append("text")
	.text("Mass Density: " + (+mass_density).toFixed(2))
	.attr({x:x_pos, y:y_spacing += 30});
    g.append("text")
	.text("Mean Solar Day: " + (+mean_solar_day).toFixed(2))
	.attr({x:x_pos, y:y_spacing += 30});
}
