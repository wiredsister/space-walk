$(function () {
	'use strict';

	// STATIC DATA ================================================================
	var planetDescriptions = {
		mercury: "Sun-scorched Mercury is only slightly larger than Earth's moon. Like the moon, Mercury has very little atmosphere to stop impacts and it is covered with craters. Mercury's dayside is super-heated by the sun, but at night temperatures drop hundreds of degrees below freezing. Ice may even exist in craters. Mercury's egg-shaped orbit takes it around the sun every 88 days.", 
		venus: "Venus is a dim world of intense heat and volcanic activity. Similar in structure and size to Earth, Venus' thick, toxic atmosphere traps heat in a runaway 'greenhouse effect.' The scorched world has temperatures hot enough to melt lead. Glimpses below the clouds reveal volcanoes and deformed mountains. Venus spins slowly in the opposite direction of most planets.",
		earth: "Earth, our home planet, is the only planet in our solar system known to harbor life - life that is incredibly diverse. All the things we need to survive exist under a thin layer of atmosphere that separates us from the cold, airless void of space.",
		mars: "Mars is a cold desert world. It is half the diameter of Earth and has the same amount of dry land. Like Earth, Mars has seasons, polar ice caps, volcanoes, canyons and weather, but its atmosphere is too thin for liquid water to exist for long on the surface. There are signs of ancient floods on Mars, but evidence for water now exists mainly in icy soil and thin clouds.",
		jupiter: "The most massive planet in our solar system -- with dozens of moons and an enormous magnetic field -- Jupiter forms a kind of miniature solar system. It resembles a star in composition, but did not grow big enough to ignite. The planet's swirling cloud stripes are punctuated by massive storms such as the Great Red Spot, which has raged for hundreds of years.",
		saturn: "Adorned with thousands of beautiful ringlets, Saturn is unique among the planets. All four gas giant planets have rings -- made of chunks of ice and rock -- but none are as spectacular or as complicated as Saturn's. Like the other gas giants, Saturn is mostly a massive ball of hydrogen and helium.",
		uranus: "Uranus is the only giant planet whose equator is nearly at right angles to its orbit. A collision with an Earth-sized object may explain the unique tilt. Nearly a twin in size to Neptune, Uranus has more methane in its mainly hydrogen and helium atmosphere than Jupiter or Saturn. Methane gives Uranus its blue tint.",
		neptune: "Dark, cold and whipped by supersonic winds, Neptune is the last of the hydrogen and helium gas giants in our solar system. More than 30 times as far from the sun as Earth, the planet takes almost 165 Earth years to orbit our sun. In 2011 Neptune completed its first orbit since its discovery in 1846."
	}

	var planetFunFacts = {
		mercury: "Mercury is the smallest planet in our solar system -- only slightly larger than the Earth's moon. Mercury has no moons or rings. Standing on Mercury's surface at its closest point to the sun, the sun would appear more than three times larger than it does on Earth.",
		venus: "Venus is only a little smaller than Earth. Venus is a rocky planet, also known as a terrestrial planet. Venus' solid surface is a cratered and volcanic landscape. Venus spins backwards (retrograde rotation) when compared to the other planets. This means that the sun rises in the west and sets in the east on Venus.",
		earth: "Earth is the perfect place for life! Earth's atmosphere protects us from incoming meteoroids, most of which break up in our atmosphere before they can strike the surface as meteorites.",
		mars: "Mars is a rocky planet, also known as a terrestrial planet. Mars' solid surface has been altered by volcanoes, impacts, crustal movement, and atmospheric effects such as dust storms. Mars has two moons named Phobos and Deimos. There are no rings around Mars.",
		jupiter: "Jupiter's Great Red Spot is a gigantic storm (bigger than Earth) that has been raging for hundreds of years. Jupiter is a gas-giant planet and therefore does not have a solid surface. However, it is predicted that Jupiter has an inner, solid core about the size of the Earth.",
		saturn: "Saturn is a gas-giant planet and does not have a solid surface. When Galileo Galilei looked at Saturn through a telescope in the 1600s, he noticed strange objects on each side of the planet and drew in his notes a triple-bodied planet system and then later a planet with arms or handles. The handles turned out to be the rings of Saturn.",
		uranus: "Uranus has faint rings. Like Venus, Uranus has a retrograde rotation (east to west). Unlike any of the other planets, Uranus rotates on its side, which means it spins horizontally. The inner rings are narrow and dark and the outer rings are brightly colored. Uranus has 27 moons. Uranus' moons are named after characters from the works of William Shakespeare and Alexander Pope.",
		neptune: "Like Uranus, Neptune cannot support life as we know it. Neptune has six rings. Neptune has 13 confirmed moons (and 1 more awaiting official confirmation of discovery). Neptune's moons are named after various sea gods and nymphs in Greek mythology."
	}

	// D3 UTILS ================================================================
	var chartHelper = function (chart_data) {
		// TROLL CODE
		var mass = chart_data.mass || "Not Available";
		var mass_density = chart_data.mass_density || "Not Available";
		var mean_solar_day = chart_data.mean_solar_day || "Not Available";
		var flat = chart_data.flat || "Not Available";

	    var g = d3.select("#planet_stats")
		    .append("g");
	    var y_spacing = 20,
		x_pos = 30;
	    g.append("text")
		.text("Quick Planet Stats:")
		.attr({x:5, y:y_spacing += 20});
		g.append("text")
		.text("================")
		.attr({x:5, y:y_spacing += 20});
	    g.append("text")
		.text("Flattening: " + Number(flat).toFixed(2))
		.attr({x:x_pos, y:y_spacing += 30});
	    g.append("text")
		.text("Mass: " + Number(mass).toFixed())
		.attr({x:x_pos, y:y_spacing += 30});
	    g.append("text")
		.text("Mass Density: " + Number(mass_density).toFixed(2))
		.attr({x:x_pos, y:y_spacing += 30});
	    g.append("text")
		.text("Mean Solar Day: " + Number(mean_solar_day).toFixed(2))
		.attr({x:x_pos, y:y_spacing += 30});
	};

	// BACKBONE OBJS ================================================================
	var Planet = Backbone.Model.extend({});

	var SolarSystem = Backbone.Collection.extend({
		model: Planet,

		url: '/planetsdata',
		currentPlanet: 0,

		parse: function (response) {
			_.each(response.planets, function(value, key, list) { 
				_.extend(response.planets[key], { 
					name: _.keys(value).toString(),
					planetClass: '-' + _.keys(value).toString(),
					description: planetDescriptions[_.keys(value).toString()],
					funFacts: planetFunFacts[_.keys(value).toString()],
				});
			});

			return response.planets;
		}, 

		planetTravel: function (planetNumber) {
			return _.extend(this, { currentPlanet: planetNumber });
		}
	});

	// BACKBONE VIEWS ================================================================
	var SolarView = Backbone.View.extend({
		events: {
			'change #planetSlider': 'planetSlider',
			'mousedown .dashboard--planet-slider': 'startLaunchSound',
			'mouseup .dashboard--planet-slider': 'endLaunchSound'
		},

		el: '._planetApp_', 

		initialize: function () {
			this.collection.fetch({ remove: false });

			this.infoTemplate = _.template(this.$('#planetInfo').html());
			this.labelsTemplate = _.template(this.$('#labelsForSlider').html());

			this.listenToOnce(this.collection, 'sync', this.render);
		}, 

		render: function () {
			var compiledLables = this.labelsTemplate({ planets: this.collection.toJSON() });
			this.$('.dashboard--planet-slider').append(compiledLables);
			this.travel();

			return this;
		}, 

		startLaunchSound: function (event) {
			document.getElementById('launchSound').play();
		}, 

		endLaunchSound: function (event) {
			document.getElementById('launchSound').pause();
		},

		planetSlider: function (event) {
			var nextPlanet = event.currentTarget.valueAsNumber - 1; //non zero indexed list
			if (nextPlanet < 0 || nextPlanet > 7) { return; }
			_.extend(this.collection, { currentPlanet: nextPlanet });

			this.travel();
		},

		travel: function () {
			this.backdrop();

			var thisPlanet = this.collection.at(this.collection.currentPlanet);
		    var planetData = thisPlanet.toJSON();
		    var byName = planetData[planetData['name']];

		    var chartData = {
		    	mass: byName.MASS.MASS, 
		    	mass_density: byName.MASS_DENSITY.MASS_DENSITY,
		    	flat: byName.FLATTENING.FLATTENING,
		    	mean_solar_day: byName.MEAN_SOLAR_DAY.MEAN_SOLAR_DAY
		    }

		    this.$('#planet_stats').empty();
		    chartHelper(chartData);

			var $summary = this.$('.dashboard--planet-summary');
			$summary.empty();
			var compiled = this.infoTemplate({ planet: planetData });

			$summary.append(compiled);
		}, 

		backdrop: function () {
			var classesToRemove = _.rest(this.$('.planet').attr('class').split(' '));
			_.each(classesToRemove, function(klass) {
				this.$('.planet').removeClass(klass);
				this.$('._solarDays_').removeClass(klass);
			}, this);

			this.$('.planet').addClass(this.collection.at(this.collection.currentPlanet).get('planetClass'));
			this.$('._solarDays_').addClass(this.collection.at(this.collection.currentPlanet).get('planetClass'));
		}

	});

	// BACKBONE CONSTRUCTORS ================================================================
	var solarSystem = new SolarSystem();
	var dashboard = new SolarView({
		collection: solarSystem
	});

	// MISC ================================================================
	$('#countdown').animate({
		volume: 0
	}, 5000);

	// MOAR D3 ================================================================
	(function solar_days () {
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
		y = d3.scale.ordinal().rangeRoundBands([height, 0], .8),
		x_axis = d3.svg.axis().scale(x).orient("bottom").tickSize(-height),
		y_axis = d3.svg.axis().scale(y).orient("right").tickSize(-width);

		x.domain([0, largest]);
		y.domain(maps.map(function (d) { return d.entries()[0].key; }));
		var chart = d3.select("._solarDays_")
		    .append("svg")
		    .attr({width:width, height:height});

		chart.append("text")
		.attr("class", "x label")
		.attr("text-anchor", "middle")
		.attr({x:300, y:50})
		.text("Mean Solar Days Relative to Earth");

		chart.append("g")
		.attr("class", "x axis")
		.style('transform', 'translateX(70px)')
		.call(x_axis)
		.select(".tick line");

		chart.append("g")
		.attr("class", "y axis")
		.call(y_axis);

		chart.selectAll(".bar")
		.data(maps)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function (d) {
		    return 70;
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
	})();
});

