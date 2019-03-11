/**
 * Router for population
 */

var express = require('express');
var router = express.Router();

var datalake = require('../service/datalake');

/* GET pupulation from Data Lake. */
router.get('/', function(req, res, next) {

  var getTotalPopulation = datalake.getTotalPopulation();
  
 	getTotalPopulation.then(function(population) {
 		res.send({population:population});
  }).catch(function(err) {
		res.send(500);
	})
});

module.exports = router;
