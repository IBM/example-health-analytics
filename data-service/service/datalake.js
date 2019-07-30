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
