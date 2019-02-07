var express = require('express');
var router = express.Router();

var datalake = require('../service/datalake');

/* GET city info from Data Lake. */
router.get('/', function(req, res, next) {

  var getCityInfo = datalake.getCityInfo(req.query.city);
  
 	getCityInfo.then(function(city) {
    	if (city < 0) {
 			res.sendStatus(500);
 		}
    	res.send(city);
    })
});

module.exports = router;
