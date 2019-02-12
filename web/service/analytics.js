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

					populationStats.cities.push({city: cities[i].city,
						popPercentage: cities[i].population/population});

					if (!populationStats.min.population || populationStats.min.population > cities[i].population) {
						populationStats.min = {city: cities[i].city,
							population: cities[i].population};
					}

					if (!populationStats.max.population || populationStats.max.population < cities[i].population) {
						populationStats.max = {city: cities[i].city,
							population: cities[i].population};
					}

					populationStats.mean = populationStats.mean + cities[i].population/population;
				}

				populationStats.mean = populationStats.mean / cities.length;

				resolve(populationStats);
			})
		})
	})
}

function getAllergyStats() {
	return new Promise(function(resolve, reject) {

		getCities().then(function(cities) {

			var allergyStats = {
				cities: [],
				stats: {
					total: {},
					type: [],
					outgrown: [],
					developed: []
				}
			}

			for (var i = 0; i < cities.length; i++) {

				var currentCity = {
					city: cities[i].city,
					total: 0,
					type: [],
					allergies: []
				};


				for (var j = 0; j < cities[i].allergies.length; j++) {

					// TOTAL

					currentCity.total = currentCity.total + cities[i].allergies[j].developed.length;

					// TYPE
				
					var typeInCurrentCityList = false;

					for (var t = 0; t < currentCity.type.length; t++) {
						if (currentCity.type[t].type == cities[i].allergies[j].type) {
							currentCity.type[t].percentage = currentCity.type[t].percentage + cities[i].allergies[j].developed.length;
							typeInCurrentCityList = true;
						}
					}

					if (!typeInCurrentCityList) {
						currentCity.type.push({type: cities[i].allergies[j].type,
												percentage: cities[i].allergies[j].developed.length});
					}

					// DEVELOPED & OUTGROWN

					currentCity.allergies.push({
						allergy: cities[i].allergies[j].allergy,
						type: cities[i].allergies[j].type,
						outgrown: cities[i].allergies[j].outgrown.length / cities[i].allergies[j].developed.length,
						developed: cities[i].allergies[j].developed.length / cities[i].population
					});

				}

				// TOTAL

				currentCity.total = currentCity.total / cities[i].population;

				if (!allergyStats.stats.total.min || allergyStats.stats.total.min.min > currentCity.total) {
					allergyStats.stats.total.min = {
						city: currentCity.city,
						min: currentCity.total
					};
				}

				if (!allergyStats.stats.total.max || allergyStats.stats.total.max.max < currentCity.total) {
					allergyStats.stats.total.max = {
						city: currentCity.city,
						max: currentCity.total
					};
				}

				if (!allergyStats.stats.total.mean) {
					allergyStats.stats.total.mean = currentCity.total;
				} else {
					allergyStats.stats.total.mean = allergyStats.stats.total.mean + currentCity.total;
				}

				// TYPE

				for (var t = 0; t < currentCity.type.length; t++) {
					currentCity.type[t].percentage = currentCity.type[t].percentage / cities[i].population;

					var typeInStatsList = false;

					for (var s = 0; s < allergyStats.stats.type.length; s++) {
						if (allergyStats.stats.type[s].type == currentCity.type[t].type) {
							typeInStatsList = true;

							if (allergyStats.stats.type[s].min.min > currentCity.type[t].percentage) {
								allergyStats.stats.type[s].min = {city: currentCity.city, min: currentCity.type[t].percentage};
							}

							if (allergyStats.stats.type[s].max.max < currentCity.type[t].percentage) {
								allergyStats.stats.type[s].max = {city: currentCity.city, max: currentCity.type[t].percentage};
							}

							allergyStats.stats.type[s].mean = allergyStats.stats.type[s].mean + currentCity.type[t].percentage;
						}
					}

					if (!typeInStatsList) {
						allergyStats.stats.type.push({
							type: currentCity.type[t].type,
							min: {city: currentCity.city, min: currentCity.type[t].percentage},
							max: {city: currentCity.city, max: currentCity.type[t].percentage},
							mean: currentCity.type[t].percentage
						});
					}
				}

				// DEVELOPED & OUTGROWN

				for (var t = 0; t < currentCity.allergies.length; t++) {

					var allergyInDevelopedList = false;

					for (var s = 0; s < allergyStats.stats.developed.length; s++) {
						if (allergyStats.stats.developed[s].allergy == currentCity.allergies[t].allergy) {
							allergyInDevelopedList = true;

							if (allergyStats.stats.developed[s].min.min > currentCity.allergies[t].developed) {
								allergyStats.stats.developed[s].min = {city: currentCity.city, min: currentCity.allergies[t].developed};
							}

							if (allergyStats.stats.developed[s].max.max < currentCity.allergies[t].developed) {
								allergyStats.stats.developed[s].max = {city: currentCity.city, max: currentCity.allergies[t].developed};
							}

							allergyStats.stats.developed[s].mean = allergyStats.stats.developed[s].mean + currentCity.allergies[t].developed;
						}
					}

					if (!allergyInDevelopedList) {
						allergyStats.stats.developed.push({
							allergy: currentCity.allergies[t].allergy,
							min: {city: currentCity.city, min: currentCity.allergies[t].developed},
							max: {city: currentCity.city, max: currentCity.allergies[t].developed},
							mean: currentCity.allergies[t].developed
						});
					}

					var allergyInOutgrownList = false;

					for (var s = 0; s < allergyStats.stats.outgrown.length; s++) {
						if (allergyStats.stats.outgrown[s].allergy == currentCity.allergies[t].allergy) {
							allergyInDevelopedList = true;

							if (allergyStats.stats.outgrown[s].min.min > currentCity.allergies[t].outgrown) {
								allergyStats.stats.outgrown[s].min = {city: currentCity.city, min: currentCity.allergies[t].outgrown};
							}

							if (allergyStats.stats.outgrown[s].max.max < currentCity.allergies[t].outgrown) {
								allergyStats.stats.outgrown[s].max = {city: currentCity.city, max: currentCity.allergies[t].outgrown};
							}

							allergyStats.stats.outgrown[s].mean = allergyStats.stats.outgrown[s].mean + currentCity.allergies[t].outgrown;
						}
					}

					if (!allergyInOutgrownList) {
						allergyStats.stats.outgrown.push({
							allergy: currentCity.allergies[t].allergy,
							min: {city: currentCity.city, min: currentCity.allergies[t].outgrown},
							max: {city: currentCity.city, max: currentCity.allergies[t].outgrown},
							mean: currentCity.allergies[t].outgrown
						});
					}
				}


				allergyStats.cities.push(currentCity);
			}

			allergyStats.stats.total.mean = allergyStats.stats.total.mean / cities.length;

			for (var t = 0; t < allergyStats.stats.type.length; t++) {
				allergyStats.stats.type[t].mean = allergyStats.stats.type[t].mean / cities.length;
			}

			for (var t = 0; t < allergyStats.stats.developed.length; t++) {
				allergyStats.stats.developed[t].mean = allergyStats.stats.developed[t].mean / cities.length;
			}

			for (var t = 0; t < allergyStats.stats.outgrown.length; t++) {
				allergyStats.stats.outgrown[t].mean = allergyStats.stats.outgrown[t].mean / cities.length;
			}

			resolve(allergyStats);
		})
	})
}


module.exports.getPopulationStats = getPopulationStats;
module.exports.getAllergyStats = getAllergyStats;
