var express = require('express');
var router = express.Router();

var analytics = require('../service/analytics');

const util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {
	
	var getPopulationStats = analytics.getPopulationStats();
	var getAllergyStats = analytics.getAllergyStats();

	getPopulationStats.then(function(populationStats) {
		console.log(util.inspect(populationStats, false, null, true /* enable colors */))

		getAllergyStats.then(function(allergyStats) {
			console.log(util.inspect(allergyStats, false, null, true /* enable colors */));

			res.send({populationStats: populationStats, allergyStats: allergyStats});
		})
	})
});

module.exports = router;
