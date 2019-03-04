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

function getAllergies() {
	return new Promise(function(resolve, reject) {
		request(API_URL + "allergies", function (error, response, body) {
	 		if (!error && response.statusCode == 200) {
	 			body = JSON.parse(body);
	    		var allergies = body["allergies"];
				return resolve(allergies);
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
						percentage: cities[i].population/population,
						population: cities[i].population});

					if (!populationStats.min.population || populationStats.min.population > cities[i].population) {
						populationStats.min = {city: cities[i].city,
							percentage: cities[i].population/population,
							population: cities[i].population};
					}

					if (!populationStats.max.population || populationStats.max.population < cities[i].population) {
						populationStats.max = {city: cities[i].city,
							percentage: cities[i].population/population,
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

function getAllergyStats() {
	return new Promise(function(resolve, reject) {

		getCities().then(function(cities) {

			getAllergies().then(function(allergies) {

				var allergyStats = {
					cities: [],
					stats: {
						total: {},
						type: [],
						outgrown: [],
						developed: []
					}
				}

				var allergyCityTotals = [];

				for (var i = 0; i < cities.length; i++) {

					var currentCity = {
						city: cities[i].city,
						total: {total:0},
						type: [],
						allergies: []
					};


					for (var j = 0; j < cities[i].allergies.length; j++) {

						// TOTAL

						currentCity.total = {total: currentCity.total.total + cities[i].allergies[j].developed.length};

						// TYPE
					
						var typeInCurrentCityList = false;

						for (var t = 0; t < currentCity.type.length; t++) {
							if (currentCity.type[t].type == cities[i].allergies[j].type) {
								currentCity.type[t].total = currentCity.type[t].total + cities[i].allergies[j].developed.length;
								currentCity.type[t].percentage = currentCity.type[t].percentage + cities[i].allergies[j].developed.length;
								typeInCurrentCityList = true;
							}
						}

						if (!typeInCurrentCityList) {
							currentCity.type.push({type: cities[i].allergies[j].type,
													total: cities[i].allergies[j].developed.length,
													percentage: cities[i].allergies[j].developed.length});
						}

						// DEVELOPED & OUTGROWN

						currentCity.allergies.push({
							allergy: cities[i].allergies[j].allergy,
							type: cities[i].allergies[j].type,
							outgrown: {total: cities[i].allergies[j].outgrown.length,
										percentage: cities[i].allergies[j].outgrown.length / cities[i].allergies[j].developed.length,
										ages: cities[i].allergies[j].outgrown},
							developed: {total: cities[i].allergies[j].developed.length,
										percentage: cities[i].allergies[j].developed.length / cities[i].population,
										ages: cities[i].allergies[j].developed}
						});

					}

					// TOTAL

					currentCity.total.percentage = currentCity.total.total / cities[i].population;

					if (!allergyStats.stats.total.min) {
						allergyStats.stats.total.min = {};
					}

					if (!allergyStats.stats.total.max) {
						allergyStats.stats.total.max = {};
					}

					if (!allergyStats.stats.total.min.total || allergyStats.stats.total.min.total.min > currentCity.total.total) {
						allergyStats.stats.total.min.total = {
							city: currentCity.city,
							min: currentCity.total.total
						};
					}

					if (!allergyStats.stats.total.min.percentage || allergyStats.stats.total.min.percentage.min > currentCity.total.percentage) {
						allergyStats.stats.total.min.percentage = {
							city: currentCity.city,
							min: currentCity.total.percentage
						};
					}

					if (!allergyStats.stats.total.max.total || allergyStats.stats.total.max.total.max < currentCity.total.total) {
						allergyStats.stats.total.max.total = {
							city: currentCity.city,
							max: currentCity.total.total,
						};
					}

					if (!allergyStats.stats.total.max.percentage || allergyStats.stats.total.max.percentage.max < currentCity.total.percentage) {
						allergyStats.stats.total.max.percentage = {
							city: currentCity.city,
							max: currentCity.total.percentage,
						};
					}

					if (!allergyStats.stats.total.mean) {
						allergyStats.stats.total.mean = {total: currentCity.total.total, percentage: currentCity.total.percentage};
					} else {
						allergyStats.stats.total.mean.total = allergyStats.stats.total.mean.total + currentCity.total.total;
						allergyStats.stats.total.mean.percentage = allergyStats.stats.total.mean.percentage + currentCity.total.percentage;
					}

					// TYPE

					for (var t = 0; t < currentCity.type.length; t++) {
						currentCity.type[t].percentage = currentCity.type[t].percentage / cities[i].population;

						var typeInStatsList = false;

						for (var s = 0; s < allergyStats.stats.type.length; s++) {
							if (allergyStats.stats.type[s].type == currentCity.type[t].type) {
								typeInStatsList = true;

								if (allergyStats.stats.type[s].min.total.min > currentCity.type[t].total) {
									allergyStats.stats.type[s].min.total = {city: currentCity.city,
																		min: currentCity.type[t].total};
								}

								if (allergyStats.stats.type[s].min.percentage.min > currentCity.type[t].percentage) {
									allergyStats.stats.type[s].min.percentage = {city: currentCity.city,
																		min: currentCity.type[t].percentage};
								}

								if (allergyStats.stats.type[s].max.total.max < currentCity.type[t].total) {
									allergyStats.stats.type[s].max.total = {city: currentCity.city,
																		max: currentCity.type[t].total};
								}

								if (allergyStats.stats.type[s].max.percentage.max < currentCity.type[t].percentage) {
									allergyStats.stats.type[s].max.percentage = {city: currentCity.city,
																		max: currentCity.type[t].percentage};
								}

								allergyStats.stats.type[s].mean.total = allergyStats.stats.type[s].mean.total + currentCity.type[t].total;
								allergyStats.stats.type[s].mean.percentage = allergyStats.stats.type[s].mean.percentage + currentCity.type[t].percentage;
							}
						}

						if (!typeInStatsList) {
							allergyStats.stats.type.push({
								type: currentCity.type[t].type,
								min: {total: {city: currentCity.city, min: currentCity.type[t].total}, percentage: {city: currentCity.city, min: currentCity.type[t].percentage}},
								max: {total: {city: currentCity.city, max: currentCity.type[t].total}, percentage: {city: currentCity.city, max: currentCity.type[t].percentage}},
								mean: {total: currentCity.type[t].total, percentage: currentCity.type[t].percentage}
							});
						}
					}

					// DEVELOPED

					for (var allergy = 0; allergy < allergies.length; allergy++) {
						var allergyInCity = false;
						var allergyInStats = false;

						for (var cityAllergy = 0; cityAllergy < currentCity.allergies.length; cityAllergy++) {
							if (allergies[allergy] == currentCity.allergies[cityAllergy].allergy) {
								allergyInCity = true;
								break;
							}
						}

						for (var statAllergy = 0; statAllergy < allergyStats.stats.developed.length; statAllergy++) {
							if (allergies[allergy] == allergyStats.stats.developed[statAllergy].allergy) {
								allergyInStats = true;
								break;
							}
						} 

						if (allergyInCity && allergyInStats) {
							if (allergyStats.stats.developed[statAllergy].min.total.min > currentCity.allergies[cityAllergy].developed.total) {
								allergyStats.stats.developed[statAllergy].min.total = {city: currentCity.city, 
																				min: currentCity.allergies[cityAllergy].developed.total};
							}

							if (allergyStats.stats.developed[statAllergy].min.percentage.min > currentCity.allergies[cityAllergy].developed.percentage) {
								allergyStats.stats.developed[statAllergy].min.percentage = {city: currentCity.city, 
																				min: currentCity.allergies[cityAllergy].developed.percentage};
							}

							if (allergyStats.stats.developed[statAllergy].max.total.max < currentCity.allergies[cityAllergy].developed.total) {
								allergyStats.stats.developed[statAllergy].max.total = {city: currentCity.city, 
																				max: currentCity.allergies[cityAllergy].developed.total};
							}

							if (allergyStats.stats.developed[statAllergy].max.percentage.max < currentCity.allergies[cityAllergy].developed.percentage) {
								allergyStats.stats.developed[statAllergy].max.percentage = {city: currentCity.city, 
																				max: currentCity.allergies[cityAllergy].developed.percentage};
							}

							allergyStats.stats.developed[statAllergy].mean.total = allergyStats.stats.developed[statAllergy].mean.total + currentCity.allergies[cityAllergy].developed.total;
							allergyStats.stats.developed[statAllergy].mean.percentage = allergyStats.stats.developed[statAllergy].mean.percentage + currentCity.allergies[cityAllergy].developed.percentage;
						} else if (allergyInCity) {
							allergyStats.stats.developed.push({
								allergy: currentCity.allergies[cityAllergy].allergy,
								min: {total: {city: currentCity.city, min: currentCity.allergies[cityAllergy].developed.total},
									percentage: {city: currentCity.city, min: currentCity.allergies[cityAllergy].developed.percentage}},
								max: {total: {city: currentCity.city, max: currentCity.allergies[cityAllergy].developed.total},
									percentage: {city: currentCity.city, max: currentCity.allergies[cityAllergy].developed.percentage}},
								mean: {total: currentCity.allergies[cityAllergy].developed.total, percentage: currentCity.allergies[cityAllergy].developed.percentage}
							});
						} else if (allergyInStats) {
							allergyStats.stats.developed[statAllergy].min.total = {city: currentCity.city, min: 0};
							allergyStats.stats.developed[statAllergy].min.percentage = {city: currentCity.city, min: 0};
						}
					}

					// OUTGROWN

					for (var allergy = 0; allergy < allergies.length; allergy++) {
						var allergyInCity = false;
						var allergyInStats = false;

						for (var cityAllergy = 0; cityAllergy < currentCity.allergies.length; cityAllergy++) {
							if (allergies[allergy] == currentCity.allergies[cityAllergy].allergy) {
								allergyInCity = true;
								break;
							}
						}

						for (var statAllergy = 0; statAllergy < allergyStats.stats.outgrown.length; statAllergy++) {
							if (allergies[allergy] == allergyStats.stats.outgrown[statAllergy].allergy) {
								allergyInStats = true;
								break;
							}
						} 

						if (allergyInCity && allergyInStats) {
							if (allergyStats.stats.outgrown[statAllergy].min.total.min > currentCity.allergies[cityAllergy].outgrown.total) {
								allergyStats.stats.outgrown[statAllergy].min.total = {city: currentCity.city, 
																				min: currentCity.allergies[cityAllergy].outgrown.total};
							}

							if (allergyStats.stats.outgrown[statAllergy].min.percentage.min > currentCity.allergies[cityAllergy].outgrown.percentage) {
								allergyStats.stats.outgrown[statAllergy].min.percentage = {city: currentCity.city, 
																				min: currentCity.allergies[cityAllergy].outgrown.percentage};
							}

							if (allergyStats.stats.outgrown[statAllergy].max.total.max < currentCity.allergies[cityAllergy].outgrown.total) {
								allergyStats.stats.outgrown[statAllergy].max.total = {city: currentCity.city, 
																				max: currentCity.allergies[cityAllergy].outgrown.total};
							}

							if (allergyStats.stats.outgrown[statAllergy].max.percentage.max < currentCity.allergies[cityAllergy].outgrown.percentage) {
								allergyStats.stats.outgrown[statAllergy].max.percentage = {city: currentCity.city, 
																				max: currentCity.allergies[cityAllergy].outgrown.percentage};
							}

							allergyStats.stats.outgrown[statAllergy].mean.total = allergyStats.stats.outgrown[statAllergy].mean.total + currentCity.allergies[cityAllergy].outgrown.total;
							allergyStats.stats.outgrown[statAllergy].mean.percentage = allergyStats.stats.outgrown[statAllergy].mean.percentage + currentCity.allergies[cityAllergy].outgrown.percentage;

							allergyCityTotals[statAllergy] = allergyCityTotals[statAllergy] + 1;
						} else if (allergyInCity) {
							allergyStats.stats.outgrown.push({
								allergy: currentCity.allergies[cityAllergy].allergy,
								min: {total: {city: currentCity.city, min: currentCity.allergies[cityAllergy].outgrown.total},
									percentage: {city: currentCity.city, min: currentCity.allergies[cityAllergy].outgrown.percentage}},
								max: {total: {city: currentCity.city, max: currentCity.allergies[cityAllergy].outgrown.total},
									percentage: {city: currentCity.city, max: currentCity.allergies[cityAllergy].outgrown.percentage}},
								mean: {total: currentCity.allergies[cityAllergy].outgrown.total, percentage: currentCity.allergies[cityAllergy].outgrown.percentage}
							});

							allergyCityTotals.push(1);
						}
					}

					allergyStats.cities.push(currentCity);
				}

				allergyStats.stats.total.mean.total = allergyStats.stats.total.mean.total / cities.length;
				allergyStats.stats.total.mean.percentage = allergyStats.stats.total.mean.percentage / cities.length;

				for (var t = 0; t < allergyStats.stats.type.length; t++) {
					allergyStats.stats.type[t].mean.total = allergyStats.stats.type[t].mean.total / cities.length;
					allergyStats.stats.type[t].mean.percentage = allergyStats.stats.type[t].mean.percentage / cities.length;
				}

				for (var t = 0; t < allergyStats.stats.developed.length; t++) {
					allergyStats.stats.developed[t].mean.total = allergyStats.stats.developed[t].mean.total / cities.length;
					allergyStats.stats.developed[t].mean.percentage = allergyStats.stats.developed[t].mean.percentage / cities.length;
				}

				for (var t = 0; t < allergyStats.stats.outgrown.length; t++) {
					allergyStats.stats.outgrown[t].mean.total = allergyStats.stats.outgrown[t].mean.total / allergyCityTotals[t];
					allergyStats.stats.outgrown[t].mean.percentage = allergyStats.stats.outgrown[t].mean.percentage / allergyCityTotals[t];
				}

				resolve(allergyStats);
			})
		})
	})
}


module.exports.getPopulationStats = getPopulationStats;
module.exports.getAllergyStats = getAllergyStats;
