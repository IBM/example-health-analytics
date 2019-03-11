/**
 * Router for cities
 */

var express = require('express');
var router = express.Router();

var datalake = require('../service/datalake');

/* GET list of cities from Data Lake. */
router.get('/', function(req, res, next) {

  var getCityList = datalake.getCityList();
  
 	getCityList.then(function(cities) {
  	res.send({cities:cities});
  }).catch(function(err) {
		res.sendStatus(500);
	})
});

module.exports = router;
