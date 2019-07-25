# Example Health Analytics Data Service

* [About](#about)
* [Datalake](#datalake)

# About

This part of Example Health Analytics is responsible for using APIs to:
* Act as a data pipeline between the data warehouse (either from a data source or generated Synthea data) and the MongoDB data lake 
* Retrieve data from MongoDB data lake to be used for analytical analysis

# Datalake

The data lake is a MongoDB database that updates and overwrites itself from data passed through the data pipeline from the data warehouse. 

__Structure__

```
{
    "_id": ObjectID,
    "population": Integer,
    "allergies": [String],
    "cities": [{
        "city": String,
        "state": String,
        "population": Integer,
        "allergies": [{
            "allergy": String,
            "type": String,
            "developed": [Integer],
            "outgrown": [Integer]
        }]
    }] 
}
```

* **_id**: ObjectID for the document in the database
* **population**: Total population for all cities in the database
* **allergies**: A list of all allergies present in the database
* **cities**: A list of cities where each city includes:
    * **city**: The name of a city
    * **state**: The name of a state a city is in
    * **population**: Population for a city
    * **allergies**: A list of allergies for a city that includes:
        * **allergy**: The name of the allergy
        * **type**: The name of the type of allergy
        * **developed**: A list of ages of people in a city that have developed an allergy
        * **outgrown**: A list of ages of people in a city that have outgrown an allergy
