### Table of Contents

* [Update](#update)
* [Generate](#generate)
* [Population](#population)
* [Cities](#cities)
* [Allergies](#allergies)


# Update

This works as a data pipeline by handling and updating patient and allergy data from the Patient Records Database from the data source to the MongoDB Data Lake

__Command__

```
curl http://localhost:3000/api/v1/update -X PUT
```

__Response__

Success: The response is a 200 status code.

Data not transferred: When the data is not transferred and updated in the Data Lake (ex. can't access database), the response is a 500 status code.

Data Source error: When there is an error calling the APIs associated with the data source, the response is a 502 status code.

# Generate

This is used as an alternative data pipeline to the data source by using locally generated Synthea data to populate the MongoDB Data Lake

__Command__

```
curl http://localhost:3000/api/v1/generate -H "Content-Type: application/json" -X PUT -d "@apidata.json"
```

__Response__

Success: The response is a 200 status code.

Data not transferred: When the data is not transferred and updated in the Data Lake (ex. can't access database), the response is a 500 status code.

# Population

This returns the total population of the patients in a given state.

```
{
	"population": Int
}
```

__Command__

```
curl http://localhost:3000/api/v1/population -X GET
```

__Response__

Success: The response is a 200 status code. The response body is a JSON object containing the population.

Internal Error: When there is an internal error (ex. can't access database), the response is a 500 status code. The response body is a JSON object containing an error message.

# Cities

This returns a list of cities where there are patients in a given state.

```
{
	"cities": [{
		"city": String,
		"population": Int,
		"allergies": [{
			"allergy": String,
			"type": String,
			"developed": [Int], //age
			"outgrown": [Int] //age
		}]
}
```

__Command__

```
curl http://localhost:3000/api/v1/cities -X GET
```

__Response__

Success: The response is a 200 status code. The response body is a JSON object containing the list of cities.

Internal Error: When there is an internal error (ex. can't access database), the response is a 500 status code. The response body is a JSON object containing an error message.

# Allergies

This returns a list of allergies that are present in the Data Lake.

```
{
	"allergies": [String]
}
```

__Command__

```
curl http://localhost:3000/api/v1/allergies -X GET
```

__Response__

Success: The response is a 200 status code. The response body is a JSON object containing the list of allergies.

Internal Error: When there is an internal error (ex. can't access database), the response is a 500 status code. The response body is a JSON object containing an error message.
