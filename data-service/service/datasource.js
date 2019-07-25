/**
 * Service for handling and processing data from data source
 */

var request = require('request');
const fetch = require("node-fetch");
var API_URL = process.env.DATA_SOURCE_API || "";

var allergyTypes = [
	{synthea: "Allergy to peanuts",
		analytics: "Peanut",
		type: "Food"},
	{synthea: "Allergy to nut",
		analytics: "Tree nut",
		type: "Food"},
	{synthea: "Allergy to fish",
		analytics: "Fish",
		type: "Food"},
	{synthea: "Shellfish allergy",
		analytics: "Shellfish",
		type: "Food"},
	{synthea: "Allergy to wheat",
		analytics: "Wheat",
		type: "Food"},
	{synthea: "Allergy to eggs",
		analytics: "Egg",
		type: "Food"},
	{synthea: "Allergy to soya",
		analytics: "Soy",
		type: "Food"},
	{synthea: "Allergy to dairy product",
		analytics: "Dairy",
		type: "Food"},
	{synthea: "Allergy to tree pollen",
		analytics: "Tree Pollen",
		type: "Outdoor"},
	{synthea: "Allergy to grass pollen",
		analytics: "Grass Pollen",
		type: "Outdoor"},
	{synthea: "Dander (animal) allergy",
		analytics: "Pet Dander",
		type: "Outdoor"},
	{synthea: "House dust mite allergy",
		analytics: "Dust Mite",
		type: "Outdoor"},
	{synthea: "Allergy to mould",
		analytics: "Mold",
		type: "Outdoor"},
	{synthea: "Allergy to bee venom",
		analytics: "Bee Sting",
		type: "Outdoor"},
	{synthea: "Latex allergy",
		analytics: "Latex",
		type: "Other"}
]

/**
 * Gets the city population from data source API
 */
function getCityPopulation() {
	return new Promise(function(resolve, reject) {
		request(API_URL + "countCities/", function (error, response, body) {
	 		if (!error && response.statusCode == 200) {
	 			body = JSON.parse(body);
				var cities = body["ResultSet Output"];
				return resolve(cities);
	  		} else {
	  			return resolve(null);
	  		}
	  	});
	})
}

/**
 * Gets the allergy data from data source API
 */
function getAllergies() {
	return new Promise(function(resolve, reject) {
		request(API_URL + "showAllergies/", function (error, response, body) {
	 		if (!error && response.statusCode == 200) {
	 			body = JSON.parse(body);
				var allergies = body["ResultSet Output"];
				return resolve(allergies);
	  		} else {
	  			return resolve(null);
	  		}
	  	});
	})
}

/**
 * Gets the state for a city based on zip code
 * 
 * @param {String} zipcode 
 * @param {Number} city 
 */
function getState(zipcode, city) {
	return new Promise(function(resolve, reject) {
		var accessToken = process.env.MAPBOX_ACCESS_TOKEN || "";
		var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + zipcode + "%20United States.json?access_token=";

		fetch(url+accessToken)
			.then(response => response.json())
			.then(zipcodeData => {
				if (zipcodeData && zipcodeData.features && zipcodeData.features.length > 0 && zipcodeData.features[0].context.length == 3 && zipcodeData.features[0].context[2].text == "United States") {
					resolve([zipcodeData.features[0].context[1].text,city]);
				}
				resolve([null,city]);
			})
	})
}

/**
 * Processes and returns data from data source
 */
function getDataFromSource() {
	
	return new Promise(function(resolve, reject) {

		var datalakeData = {
			population: 0,
			allergies: [],
			cities: []
		};

		var allergies = [];

		getCityPopulation().then(cities => {
			getAllergies().then(allergies => {

				if (!cities || !allergies) {
					resolve(null);
				}

				var nullCities = 0;
				var duplicateCities = 0;
				
				for (var city = 0; city < cities.length; city++) {
					if (cities[city].CITY == null) {
						nullCities = nullCities + 1;
						continue;
					}

					getState(cities[city].POSTCODE.trim(), city).then(stateData => {

						var state = stateData[0];
						var city = stateData[1];

						if (state) {

							datalakeData.population = datalakeData.population + cities[city].NUM_IN_CITY;

							var currentCity = {
								city: cities[city].CITY.trim(),
								state: state,
								population: cities[city].NUM_IN_CITY,
								allergies: []
							}

							for (var datalakeCity = 0; datalakeCity < datalakeData.cities.length; datalakeCity++) {
								if (datalakeData.cities[datalakeCity].city == cities[city].CITY.trim() && datalakeData.cities[datalakeCity].state == state) {
									duplicateCities = duplicateCities + 1;
									currentCity.population = currentCity.population + datalakeData.cities[datalakeCity].population;
									currentCity.allergies = datalakeData.cities[datalakeCity].allergies;
									datalakeData.cities.splice(datalakeCity, 1);
									break;
								}
							}

							for (var allergy = 0; allergy < allergies.length; allergy++) {
								if (allergies[allergy].CITY.trim() == currentCity.city && allergies[allergy].POSTCODE.trim() == cities[city].POSTCODE.trim()) {
									for (var allergyType = 0; allergyType < allergyTypes.length; allergyType++) {
										if (allergyTypes[allergyType].synthea == allergies[allergy].DESCRIPTION) {
											if (datalakeData.allergies.indexOf(allergyTypes[allergyType].analytics) == -1) {
												datalakeData.allergies.push(allergyTypes[allergyType].analytics);
											}

											var allergyInCity = false;

											for (var cityAllergy = 0; cityAllergy < currentCity.allergies.length; cityAllergy++) {
												if (currentCity.allergies[cityAllergy].allergy == allergyTypes[allergyType].analytics) {
													allergyInCity = true;
													break;
												}
											}

											if (!allergyInCity) {
												currentCity.allergies.push({
													allergy: allergyTypes[allergyType].analytics,
													type: allergyTypes[allergyType].type,
													developed: [],
													outgrown: []
												})
											}

											var developedDate = new Date(allergies[allergy].ALLERGY_START);
											var birthDate = new Date(allergies[allergy].BIRTHDATE);

											currentCity.allergies[cityAllergy].developed.push(developedDate.getFullYear()-birthDate.getFullYear());

											if (allergies[allergy].ALLERGY_STOP != null && allergies[allergy].ALLERGY_STOP.trim().length > 0) {
												var outgrownDate = new Date(allergies[allergy].ALLERGY_STOP);
												currentCity.allergies[cityAllergy].outgrown.push(outgrownDate.getFullYear()-birthDate.getFullYear());
											}
										}
									}
								}
							}
							datalakeData.cities.push(currentCity);
						} else {
							nullCities = nullCities + 1;
						}

						if (datalakeData.cities.length == cities.length - nullCities - duplicateCities) {
							resolve(datalakeData);
						}
					})
				}
			}).catch(function (err) { 
				resolve(datalakeData);
			})
		}).catch(function (err) { 
			resolve(datalakeData);
		})

	})
}

module.exports.getDataFromSource = getDataFromSource;
