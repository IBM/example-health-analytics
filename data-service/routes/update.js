/*##############################################################################
# Copyright 2019 IBM Corp. All Rights Reserved.
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
##############################################################################*/
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
