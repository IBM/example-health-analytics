var express = require('express');
var router = express.Router();

var zsystem = require('../service/zsystem');
var datalake = require('../service/datalake');

/* Updates Data Lake */
router.put('/', function(req, res, next) {

	var datalakeData = {
		population: 1,
		cities: [{
			city: "Thousand Oaks",
			population: 1,
			allergies: [{
				allergy: "Dairy",
				type: "Food",
				developed: [1],
				outgrown: []
			}]
		}]
	}

	var updateAnalytics = datalake.updateAnalytics(datalakeData);

	updateAnalytics.then(function(success) {
      	if (success) {
      		res.sendStatus(200);
      	} else {
      		res.sendStatus(500);
      	}
      })

	/*var getPatientCount = zsystem.getPatientsCount();
	var getCities = zsystem.getCities();
	var getAllergies = zsystem.getAllergies();
  
 	getPatientCount.then(function(patientCount) {
    	var datalakeData.population = patientCount;

    	getCities.then(function(cities) {
      		datalakeData.cities = cities;

      		getAllergies.then(function(allergies) {

      			var updateAnalytics = datalake.updateAnalytics(datalakeData);

      			updateAnalytics.then(function(success) {
      				if (success) {
      					res.send(200);
      				} else {
      					res.send(500);
      				}
      			})
      		})
    	})
  	})*/
});

module.exports = router;
