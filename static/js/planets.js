"use strict";
var planets_data;

// $.get("planetsdata", function (data) {
//     planets_data = data;
// });


// var add_pie_chart = function 

// Need to do some kind of transition in since the request takes some time...
// d3.json("planetsdata", function (data) {
//     var these_planets = data.planets;
//     d3.select("#pie_chart")
// 	.append("rect")
//     	.attr({x:0, y:0, height:100, width:100})
// 	.attr("fill", "blue");
//     console.log("finished");
// });

$(function () {
	'use strict';

	var Planet = Backbone.Model.extend({
		defaults: {
			description: "Bitters put a bird on it banh mi, art party whatever skateboard American Apparel yr vinyl Carles twee listicle. Biodiesel ugh chillwave, migas cornhole four dollar toast PBR. Lo-fi ethical migas mlkshk jean shorts McSweeney's pork belly, Marfa next level lumbersexual 8-bit beard food truck. Hoodie readymade biodiesel cornhole Helvetica drinking vinegar. Whatever 90's flexitarian Blue Bottle, DIY health goth PBR kogi master cleanse farm-to-table fixie locavore cliche four loko. Blog Marfa quinoa Odd Future, Kickstarter church-key Pinterest hoodie bicycle rights Tumblr pork belly gluten-free cold-pressed keytar. Stumptown sriracha next level readymade, lo-fi street art authentic skateboard bespoke slow-carb synth kale chips vinyl DIY single-origin coffee.",
			name: "Planet Name", 
			audio: "/static/audio/sounds.m4r"
		},

		drawGraph: function () {
			// d3 logic
		}
	});
	var SolarSystem = Backbone.Collection.extend({
		model: Planet,

		url: '/planetsdata',
		currentPlanet: 0,

		parse: function (response) {
			_.each(response.planets, function(value, key, list) { 
				_.extend(response.planets[key], { name: _.keys(value).toString() });
			});

			return response.planets;
		}, 

		planetTravel: function (planetNumber) {
			return _.extend(this, { currentPlanet: planetNumber });
		}
	});
	var SolarView = Backbone.View.extend({
		events: {
			'oninput .planet-slider': 'travel'
		},

		el: '._planetApp_', 

		initialize: function () {
			this.collection.fetch({ remove: false });

			this.infoTemplate = _.template(this.$('#planetInfo').html());
			this.listenTo(this.collection, 'sync', this.render);
		}, 

		render: function () {
			this.travel();
			return this;
		}, 

		travel: function () {
			console.log('sup');

			var planetData = this.collection.at(this.collection.currentPlanet).toJSON();
			var $summary = this.$('.dashboard--planet-summary');
			$summary.empty();
			var compiled = this.infoTemplate({ planet: planetData });

			$summary.append(compiled);
		}

	});

	var solarSystem = new SolarSystem();
	var dashboard = new SolarView({
		collection: solarSystem
	});
})

	


