/**
 * Router for home page
 */

var express = require('express');
var router = express.Router();

var analytics = require('../service/analytics');

const util = require('util');

router.get('/', function(req, res, next) {
	
	var getPopulationStats = analytics.getPopulationStats();
	var getAllergyStats = analytics.getAllergyStats();

	getPopulationStats.then(function(populationStats) {
		getAllergyStats.then(function(allergyStats) {
			//console.log(util.inspect({populationStats: populationStats, allergyStats: allergyStats}, false, null, true /* enable colors */));

			res.send({populationStats: populationStats, allergyStats: allergyStats});
		})
	})
});

module.exports = router;
