var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/summithealth"


function updateAnalytics(newAnalytics) {
	return new Promise(function(resolve, reject) {
		MongoClient.connect(url, function(err, db) {
		    if (err) resolve(false);
		    console.log("Database connected!");
		    var dbo = db.db("summithealth");
		    dbo.collection("analytics").insertOne(newAnalytics, {upsert: true}, function(err, res) {
		        if (err) resolve(false);
		        console.log("1 document inserted");
		        db.close();
		        resolve(true);
		    });
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

function getCityInfo(city) {
	return new Promise(function(resolve, reject) {
		MongoClient.connect(url, function(err, db) {
			if (err) resolve(-1);
			console.log("Database connected");
			var dbo = db.db("summithealth");
			dbo.collection("analytics").findOne({}, function(e, result) {
			    if (e) resolve(-1);

			    for (var i = 0; i < result.cities.length; i++) {
			    	if (result.cities[i].city == city) {
			    		db.close();
			    		resolve(result.cities[i]);
			    	}
			    }
			    resolve(-1);
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

			    cities = [];

			    for (var i = 0; i < result.cities.length; i++) {
			    	cities.push(result.cities[i].city);
			    }
			    
			    db.close();
			    resolve(cities);
			});
		})
	})
}

module.exports.updateAnalytics = updateAnalytics;
module.exports.getTotalPopulation = getTotalPopulation;
module.exports.getCityInfo = getCityInfo;
module.exports.getCityList = getCityList;