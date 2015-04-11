"use strict";

// d3.json("planetsdata", function (data) {
//     var these_planets = data.planets;
//     d3.select("#pie_chart")
// 	.append("rect")
//     	.attr({x:0, y:0, height:100, width:100})
// 	.attr("fill", "blue");
//     console.log("finished");
// });

var painter = (function () {
    var p_data = function () {
	// Yes its sync, yes I know.
	var o = new XMLHttpRequest();
	o.open("GET", "planetsdata", false);
	o.send();
	return o.responseText;
    };
    var pie_chart = function (planet_name) {
	console.log(p_data.responseText);
    };
    console.log(p_data());
    return {add_pie_chart:pie_chart};
})();
