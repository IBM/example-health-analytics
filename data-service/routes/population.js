var express = require('express');
var router = express.Router();

var datalake = require('../service/datalake');

/* GET pupulation from Data Lake. */
router.get('/', function(req, res, next) {

  var getTotalPopulation = datalake.getTotalPopulation();
  
 	getTotalPopulation.then(function(population) {
 		if (population < 0) {
 			res.sendStatus(500);
 		}
    	res.send({population:population});
    })
});

module.exports = router;
