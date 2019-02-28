var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/summithealth"


function updateAnalytics(newAnalytics) {
	return new Promise(function(resolve, reject) {
		MongoClient.connect(url, function(err, db) {
		    if (err) resolve(false);
		    console.log("Database connected!");
		    var dbo = db.db("summithealth");
		    dbo.collection("analytics").deleteOne({}, function(err, obj){
		    	if (err) resolve(false);
		    	console.log("1 document deleted");
		    	dbo.collection("analytics").insertOne(newAnalytics, {upsert: true}, function(err, res) {
			        if (err) resolve(false);
			        console.log("1 document inserted");
			        db.close();
			        resolve(true);
			    });
		    })
		});
	})
}

function getTotalPopulation() {
	return new Promise(function(resolve, reject) {
		MongoClient.connect(url, function(err, db) {
			if (err) resolve(-1);
			console.log("Database connected");
			var dbo = db.db("summithealth");
			dbo.collection("analytics").findOne({}, function(e, result) {
			    if (e) resolve(-1);
			    db.close();
			    resolve(result.population);
			});
		})
	})
}

function getCityList() {
	return new Promise(function(resolve, reject) {
		MongoClient.connect(url, function(err, db) {
			if (err) resolve(-1);
			console.log("Database connected");
			var dbo = db.db("summithealth");
			dbo.collection("analytics").findOne({}, function(e, result) {
			    if (e) resolve(-1);

			    db.close();
			    resolve(result.cities);
			});
		})
	})
}

function getAllergyList() {
	return new Promise(function(resolve, reject) {
		MongoClient.connect(url, function(err, db) {
			if (err) resolve(-1);
			console.log("Database connected");
			var dbo = db.db("summithealth");
			dbo.collection("analytics").findOne({}, function(e, result) {
				if (e) resolve(-1);

				db.close();
				resolve(result.allergies);
			})
		})
	})
}

module.exports.updateAnalytics = updateAnalytics;
module.exports.getTotalPopulation = getTotalPopulation;
module.exports.getCityList = getCityList;
module.exports.getAllergyList = getAllergyList;
