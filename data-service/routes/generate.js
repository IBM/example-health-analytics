var express = require('express');
var router = express.Router();

var synthea = require('../service/synthea');
var datalake = require('../service/datalake');

/* Updates Data Lake */
router.put('/', function(req, res, next) {

	var datalakeData = synthea.generateFromSynthea(req.body);

	var updateAnalytics = datalake.updateAnalytics(datalakeData);

	updateAnalytics.then(function(success) {
      	if (success) {
      		res.sendStatus(200);
      	} else {
      		res.sendStatus(500);
      	}
      })
});

module.exports = router;
