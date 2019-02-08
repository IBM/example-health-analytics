### Table of Contents

* [Update](#update)
* [Population](#population)
* [Cities](#cities)


# Update

This works as a data pipeline by handling and updating patient and allergy data from the Patient Records Database on the Z System to the Data Lake on the Cloud

__Command__

```
curl http://localhost:3000/api/v1/update -X PUT
```

__Response__

Success: The response is a 200 status code. The response body is a JSON object containing a success message.

Data not transferred: When the data is not transferred and updated in the Data Lake, the response is a 500 status code. The response body is a JSON object containing an error message.

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

Success: The response is a 200 status code. The response body is a JSON object containing a success message.

Internal Error: When there is an internal errror (ex. can't access database), the response is a 500 status code. The response body is a JSON object containing an error message.

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

Success: The response is a 200 status code. The response body is a JSON object containing a success message.

Internal Error: When there is an internal errror (ex. can't access database), the response is a 500 status code. The response body is a JSON object containing an error message.
