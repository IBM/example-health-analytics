var express = require('express');
var router = express.Router();

var analytics = require('../service/analytics');

/* GET home page. */
router.get('/', function(req, res, next) {
	
	var getPopulationStats = analytics.getPopulationStats();

	getPopulationStats.then(function(populationStats) {
		console.log(populationStats);

		res.render('index', { title: 'Express' });
	})
});

module.exports = router;
