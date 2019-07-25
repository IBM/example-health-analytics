/**
 * Router for updating data lake from data source
 */

var express = require('express');
var router = express.Router();

var datasource = require('../service/datasource');
var datalake = require('../service/datalake');

const util = require('util');

/* Updates Data Lake */
router.put('/', function(req, res, next) {

	datasource.getDataFromSource().then(datalakeData => {

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
