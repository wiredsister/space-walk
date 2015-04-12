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
				_.extend(response.planets[key], { 
					name: _.keys(value).toString(),
					planetClass: '-' + _.keys(value).toString()
				});
			});

			return response.planets;
		}, 

		planetTravel: function (planetNumber) {
			return _.extend(this, { currentPlanet: planetNumber });
		}
	});

	var SolarView = Backbone.View.extend({
		events: {
			'change #planetSlider': 'planetSlider'
		},

		el: '._planetApp_', 

		initialize: function () {
			this.collection.fetch({ remove: false });

			this.infoTemplate = _.template(this.$('#planetInfo').html());
			this.listenToOnce(this.collection, 'sync', this.render);
		}, 

		render: function () {
			this.listenTo(this.collection, 'change', this.render);
			this.travel();

			return this;
		}, 

		planetSlider: function (event) {
			var nextPlanet = event.currentTarget.valueAsNumber - 1;
			_.extend(this.collection, { currentPlanet: nextPlanet });

			this.travel();
		},

		travel: function () {
			this.backdrop();

		    var planetData = this.collection.at(
			this.collection.currentPlanet).toJSON();
			var $summary = this.$('.dashboard--planet-summary');
			$summary.empty();
			var compiled = this.infoTemplate({ planet: planetData });

			$summary.append(compiled);
		}, 

		backdrop: function () {
			this.$('.planet').removeClass(function (index, css) {
				return css[1];
			});

			var newPlanet = this.collection.at(this.collection.currentPlanet).get('planetClass');
			this.$('.planet').addClass(newPlanet);
		}

	});

	var solarSystem = new SolarSystem();
	var dashboard = new SolarView({
		collection: solarSystem
	});
});
