var request = require('request');
var API_URL = "http://localhost:3000/"; // Include API URL

function getPopulation() {
	return new Promise(function(resolve, reject) {
		request(API_URL + "population", function (error, response, body) {
	 		if (!error && response.statusCode == 200) {
	 			body = JSON.parse(body);
	    		var population = body["population"];
				return resolve(population);
	  		} else {
	  			return resolve(0);
	  		}
	  	});
	})
}

function getCities() {
	return new Promise(function(resolve, reject) {
		request(API_URL + "cities", function (error, response, body) {
	 		if (!error && response.statusCode == 200) {
	 			body = JSON.parse(body);
	    		var cities = body["cities"];
				return resolve(cities);
	  		} else {
	  			return resolve(0);
	  		}
	  	});
	})
}

function getPopulationStats() {
	return new Promise(function(resolve, reject) {

		getPopulation().then(function(population) {

			getCities().then(function(cities) {

				var populationStats = {
					cities: [],
					min: {},
					max: {},
					mean: 0
				}

				for (var i = 0; i < cities.length; i++) {
					cities[i]

					populationStats.cities.push({city: cities[i].city,
						popPercentage: cities[i].population/population});

					if (!populationStats.min.population || populationStats.min.population > cities[i].population) {
						populationStats.min = {city: cities[i].city,
							population: cities[i].population};
					}

					if (!populationStats.max.population || populationStats.min.population < cities[i].population) {
						populationStats.max = {city: cities[i].city,
							population: cities[i].population};
					}

					populationStats.mean = populationStats.mean + cities[i].population;
				}

				populationStats.mean = populationStats.mean / cities.length;

				resolve(populationStats);
			})
		})
	})
}


module.exports.getPopulationStats = getPopulationStats;
