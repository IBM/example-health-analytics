var express = require('express');
var router = express.Router();

var datalake = require('../service/datalake');

/* GET list of cities from Data Lake. */
router.get('/', function(req, res, next) {

  var getAllergyList = datalake.getAllergyList();
  
 	getAllergyList.then(function(allergies) {
    	if (allergies < 0) {
 			res.sendStatus(500);
 		}
    	res.send({allergies:allergies});
    })
});

module.exports = router;
