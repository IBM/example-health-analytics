var request = require('request');
var API_URL = ""; // Include API URL

function getPatientsCount() {
	return new Promise(function(resolve, reject) {
		request(API_URL + "patients/count", function (error, response, body) {
	 		if (!error && response.statusCode == 200) {
	 			body = JSON.parse(body);
	    		var patientTotal = body["patientCount"];
				return resolve(patientTotal);
	  		} else {
	  			return resolve({});
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
	  			return resolve({});
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
	  			return resolve({});
	  		}
	  	});
	})
}


module.exports.getPatientsCount = getPatientsCount;
module.exports.getCities = getCities;
module.exports.getAllergies = getAllergies;