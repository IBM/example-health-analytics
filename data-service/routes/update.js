/**
 * Router for updating data lake from zOS system
 */

var express = require('express');
var router = express.Router();

var zsystem = require('../service/zsystem');
var datalake = require('../service/datalake');

const util = require('util');

/* Updates Data Lake */
router.put('/', function(req, res, next) {

	zsystem.getDataFromZSystem().then(datalakeData => {

		if (!datalakeData) {
			res.sendStatus(502);
		} else {
			var updateAnalytics = datalake.updateAnalytics(datalakeData);

			updateAnalytics.then(function(success) {
				res.sendStatus(200);
			}).catch(function (err) {
				res.sendStatus(500);
			});
		}
	})
	
});

module.exports = router;
