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
 * Service for interacting with MongoDB data lake
 */

var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

var url = process.env.MONGODB || "mongodb://mongo:27017/examplehealth";

/**
 * Updates and replaces analytics data in data lake
 * See README.md for more information on structure of analytics object for data lake
 * 
 * @param {Object} newAnalytics 
 */
function updateAnalytics(newAnalytics) {
	return new Promise(function(resolve, reject) {
		MongoClient.connect(url).then(function(db) {
		    var dbo = db.db("examplehealth");
		    dbo.collection("analytics").deleteOne({}, function(err, obj){
		    	if (err) reject(err);
		    	dbo.collection("analytics").insertOne(newAnalytics, {upsert: true}, function(err, res) {
			        if (err) reject(err);
			        db.close();
			        resolve(true);
			    });
		    })
		}).catch(function(err) {
			reject(err);
		});
	})
}

/**
 * Gets the total population from data lake
 */
function getTotalPopulation() {
	return new Promise(function(resolve, reject) {
		MongoClient.connect(url).then(function(db) {
			var dbo = db.db("examplehealth");
			dbo.collection("analytics").findOne({}, function(e, result) {
			    if (e) reject(e);
			    db.close();
			    resolve(result.population);
			});
		}).catch(function(err) {
			reject(err);
		})
	})
}

/**
 * Gets cities data from data lake that contains each city's respective allergy analytics data
 */
function getCityList() {
	return new Promise(function(resolve, reject) {
		MongoClient.connect(url).then(function(db) {
			var dbo = db.db("examplehealth");
			dbo.collection("analytics").findOne({}, function(e, result) {
			    if (e) reject(e);
			    db.close();
			    resolve(result.cities);
			});
		}).catch(function(err) {
			reject(err);
		})
	})
}

/**
 * Gets a list of all allergies included in the data lake
 */
function getAllergyList() {
	return new Promise(function(resolve, reject) {
		MongoClient.connect(url).then(function(db) {
			var dbo = db.db("examplehealth");
			dbo.collection("analytics").findOne({}, function(e, result) {
				if (e) reject(e);
				db.close();
				resolve(result.allergies);
			})
		}).catch(function(err) {
			reject(err);
		})
	})
}

module.exports.updateAnalytics = updateAnalytics;
module.exports.getTotalPopulation = getTotalPopulation;
module.exports.getCityList = getCityList;
module.exports.getAllergyList = getAllergyList;
