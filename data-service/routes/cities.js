var express = require('express');
var router = express.Router();

var datalake = require('../service/datalake');

/* GET list of cities from Data Lake. */
router.get('/', function(req, res, next) {

  var getCityList = datalake.getCityList();
  
 	getCityList.then(function(cities) {
    	if (cities < 0) {
 			res.sendStatus(500);
 		}
    	res.send({cities:cities});
    })
});

module.exports = router;
