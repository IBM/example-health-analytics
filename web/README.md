### Summit Health Analytics Front End

* [About](#about)
* [Analytics](#analytics)
* [Visuals](#visuals)

# About

This part of Summit Health Analytics is responsible for calculating and displaying analytics on the paitent/allergy data stored in the MongoDB datalake.

# Analytics

There are two main groups of analytics being calculated from the datalake: Population and Allergy statistics.

## Population

The population statistics are looked at from a city level and include both people with and without allergies.

__Data Structure__

```
{
    cities: [{
        city: String,
        percentage: Float,
        population: Int
    }],
    min: {
        city: String,
        percentage: Float,
        population: Int
    },
    max: {
        city: String,
        percentage: Float,
        population: Int
    },
    mean: Float
}
```

* **cities**: A list of cities where each city includes:
    * **city**: The name of the city
    * **percentage**: The percentage of the state's population that represents a city's population
    * **population**: The total population for a city
* **min**: The city with the minimum population
* **max**: The city with the maximum population
* **mean**: The average population of cities in a state

## Allergy

The allergy statistics are looked at from a city level. The statisitcs focus on total alelrgies for a city, types of allergies (food, outdoor, other), and specific allergies (developed and outgrown).

__Data Structure__

```
{
    cities: [{
        city: String,
        total: {
            total: Int,
            percentage: Float
        },
        type: [{
            type: String,
            total: Int,
            percentage: Float
        }],
        allergies: [{
            allergy: String,
            type: String,
            outgrown: {
                total: Int,
                percentage: Float,
                ages: [Int]
            },
            developed: {
                total: Int,
                percentage: Float,
                ages: [Int]
            }
        }]
    }],
    stats: {
        total: {
            min: {
                total: {
                    city: String, 
                    min: Int
                },
                percentage: {
                    city: String, 
                    min: Float
                }
            },
            max: {
                total: {
                    city: String, 
                    max: Int
                },
                percentage: {
                    city: String, 
                    max: Float
                }
            },
            mean: {
                total: Float,
                percentage: Float
            }
        },
        type: [{
            type: String,
            min: {
                total: {
                    city: String, 
                    min: Int
                },
                percentage: {
                    city: String, 
                    min: Float
                }
            },
            max: {
                total: {
                    city: String, 
                    max: Int
                },
                percentage: {
                    city: String, 
                    max: Float
                }
            },
            mean: {
                total: Float,
                percentage: Float
            }
        }],
        outgrown: [{
            allergy: String,
            min: {
                total: {
                    city: String, 
                    min: Int
                },
                percentage: {
                    city: String, 
                    min: Float
                }
            },
            max: {
                total: {
                    city: String, 
                    max: Int
                },
                percentage: {
                    city: String, 
                    max: Float
                }
            },
            mean: {
                total: Float,
                percentage: Float
            }
        }],
        developed: [{
            allergy: String,
            min: {
                total: {
                    city: String, 
                    min: Int
                },
                percentage: {
                    city: String, 
                    min: Float
                }
            },
            max: {
                total: {
                    city: String, 
                    max: Int
                },
                percentage: {
                    city: String, 
                    max: Float
                }
            },
            mean: {
                total: Float,
                percentage: Float
            }
        }]
    }
}
```

* **cities**: A list of cities where each city includes:
    * **city**: The name of a city
    * **total**: Total allergies for a city that includes: 
        > NOTE: Currently incorrect and will need more data to fix

        * **total**: The total city population that has allergies
        * **percentage**: The percentage of a city population that has allergies
    * **type**: A list of allergy types (food, outdoor, other) for a city that includes:
        * **type**: The name of the allergy type
        * **total**: The total city population that has an allergy type
        * **percentage**: The percentage of a city population that has an allergy type
    * **allergies**: A list of alleriges for a city that includes:
        * **allergy**: The name of the allergy
        * **type**: The type of the allergy
        * **outgrown**: City population that have outgrown an allergy that includes:
            * **total**: The total city population that has outgrown an allergy
            * **percentage**: The percentage of a city population that has an allergy that outgrew the allergy
            * **ages**: A list of the ages of a city population that outgrew an allergy
        * **developed**: City population that have developed an allergy that includes:
            * **total**: The total city population that has developed an allergy
            * **percentage**: The percentage of a city population that has developed an allergy
            * **ages**: A list of the ages of a city population that has developed an allergy
* **stats**: Minimum, maximum, and Mean stats for the following:
    > NOTE: Stats are broken down by total and percentage, because they may not both refer to the same city

    * **total**: Total allergies for a city
        > NOTE: Currently incorrect and will need more data to fix

    * **type**: A list of different allergy types and their respective stats
    * **outgrown**: A list of different allergies outgrown and their respective stats
    * **developed**: A list of different allergies developed and their respective stats

# Visuals
