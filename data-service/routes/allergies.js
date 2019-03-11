/**
 * Router for allergies
 */

var express = require('express');
var router = express.Router();

var datalake = require('../service/datalake');

/* GET list of allergies from Data Lake. */
router.get('/', function(req, res, next) {

  var getAllergyList = datalake.getAllergyList();
  
 	getAllergyList.then(function(allergies) {
    res.send({allergies:allergies});
  }).catch(function(err) {
		res.sendStatus(500);
	})
});

module.exports = router;
