/**
 * Responsible for getting and handling data
 */

 /**
  * Updates data type in storage and reloads map/charts with data based on the data type
  * 
  * @param {String} newDataType 
  */
function updateDataType(newDataType) {
    if (getSessionStorage("dataType")) {
        var previousSelectedMenuItem = document.getElementById(getSessionStorage("dataType"));
        previousSelectedMenuItem.style.fontWeight = "normal";
    }

    var newSelectedMenuItem = document.getElementById(newDataType);
    newSelectedMenuItem.style.fontWeight = "bold";

    setSessionStorage("dataType", newDataType);
    load();
}

/**
 * Wrapper for getting session storage value
 * 
 * @param {String} key 
 */
function getSessionStorage(key) {
    return sessionStorage.getItem(key);
}

/**
 * Wrapper for setting session storage key/value pair
 * 
 * @param {String} key 
 * @param {*} value 
 */
function setSessionStorage(key,value) {
    sessionStorage.setItem(key, value);
}

/**
  * Gets analytics data to be processed by front end
  * 
  * @param {mapboxgl.Map} map
  * @param {String} dataType
  * @param {String} allergy
  * @param {String} dataValueType
  */
 getData = async(map, dataType, allergy, dataValueType) => { 

    return new Promise(function(resolve, reject) {
        var url = "./data";

        var http = new XMLHttpRequest();

        http.open("GET", url, true);

        http.onreadystatechange = function()
        {
            if(http.readyState == 4 && (http.status == 200 || http.status == 304)) {
                var data = JSON.parse(http.responseText);

                processData(dataType, data, allergy, dataValueType).then(mapData => {
                    updateStats(dataType, data, allergy, dataValueType);
                    resolve(mapData);
                })
            }
        }
        http.send(null);
    })
}

/**
  * Processes analytics data for mapbox map and updates charts with processed data
  * 
  * @param {Stirng} dataType
  * @param {Stirng} data
  * @param {Stirng} allergy
  * @param {Stirng} dataValueType
  */
 processData = async(dataType, data, allergy, dataValueType) => {

    mapData = [];

    var mapChartLabels = ['Location', 'Parent'];
    var mapChartData = [];
    var ageChartData = [];

    switch (dataType) {
        case "population":
            for (let city = 0; city < data.populationStats.cities.length; city++) {

                getCoordinates(data.populationStats.cities[city].city, data.populationStats.cities[city].state).then(coordinateData => {
                    getCounty(data.populationStats.cities[city].city, coordinateData).then(county => {
                        
                        switch (dataValueType) {
                            case "total":
                                mapData.push({
                                    "type": "Feature",
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": coordinateData
                                    },
                                    "properties": {
                                        "title": data.populationStats.cities[city].city + " (" + data.populationStats.cities[city].population + ")",
                                        "data": data.populationStats.cities[city].population
                                    }
                                })
    
                                mapChartData.push([data.populationStats.cities[city].city,
                                                    county,
                                                    data.populationStats.cities[city].state,
                                                    data.populationStats.cities[city].population]);
    
                                if (city == data.populationStats.cities.length - 1) {
                                    mapChartLabels.push("population");
                                    updateMapChart(mapChartLabels, mapChartData, dataValueType);
                                    removeAgeChart();
                                }
    
                                break;
                            case "percentage":
                                mapData.push({
                                    "type": "Feature",
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": coordinateData
                                    },
                                    "properties": {
                                        "title": data.populationStats.cities[city].city + " (" + data.populationStats.cities[city].percentage*100 + "%)",
                                        "data": data.populationStats.cities[city].percentage*100
                                    }
                                })
    
                                mapChartData.push([data.populationStats.cities[city].city,
                                                    county,
                                                    data.populationStats.cities[city].state,
                                                    data.populationStats.cities[city].percentage*100]);
    
                                if (city == data.populationStats.cities.length - 1) {
                                    mapChartLabels.push("% of population");
                                    updateMapChart(mapChartLabels, mapChartData, dataValueType);
                                    removeAgeChart();
                                }
    
                                break;
                            default:
                        }
                    })
                })
            }
            break;
        case "developed":
            for (let city = 0; city < data.allergyStats.cities.length; city++) {

                getCoordinates(data.allergyStats.cities[city].city, data.allergyStats.cities[city].state).then(coordinateData => {
                    getCounty(data.allergyStats.cities[city].city, coordinateData).then(county => {

                        var hasAllergy = false;

                        switch (dataValueType) {
                            case "total":
                                for (let allergyIndex = 0; allergyIndex < data.allergyStats.cities[city].allergies.length; allergyIndex++) {
                                    if (allergy == data.allergyStats.cities[city].allergies[allergyIndex].allergy) {
                                        hasAllergy = true;

                                        mapData.push({
                                            "type": "Feature",
                                            "geometry": {
                                                "type": "Point",
                                                "coordinates": coordinateData
                                            },
                                            "properties": {
                                                "title": data.allergyStats.cities[city].city + " (" + data.allergyStats.cities[city].allergies[allergyIndex].developed.total +")",
                                                "data": data.allergyStats.cities[city].allergies[allergyIndex].developed.total
                                            }
                                        })

                                        mapChartData.push([data.allergyStats.cities[city].city,
                                                            county,
                                                            data.allergyStats.cities[city].state,
                                                            data.allergyStats.cities[city].allergies[allergyIndex].developed.total]);
                                        ageChartData.push.apply(ageChartData,data.allergyStats.cities[city].allergies[allergyIndex].developed.ages);
                                    }
                                }
            
                                if (!hasAllergy) {
                                    mapData.push({
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": coordinateData
                                        },
                                        "properties": {
                                            "title": data.allergyStats.cities[city].city + " (0)",
                                            "data": 0
                                        }
                                    })

                                    mapChartData.push([data.allergyStats.cities[city].city,
                                        county,
                                        data.allergyStats.cities[city].state,
                                        0]);
                                }
            
                                if (city == data.allergyStats.cities.length - 1) {
                                    mapChartLabels.push("Total number of " + allergy + " allergy");
                                    updateMapChart(mapChartLabels, mapChartData, dataValueType);
                                    updateAgeChart(ageChartData, "Frequency of age developed " + allergy + " allergy");
                                }

                                break;
                            case "percentage":
                                for (let allergyIndex = 0; allergyIndex < data.allergyStats.cities[city].allergies.length; allergyIndex++) {
                                    if (allergy == data.allergyStats.cities[city].allergies[allergyIndex].allergy) {
                                        hasAllergy = true;

                                        mapData.push({
                                            "type": "Feature",
                                            "geometry": {
                                                "type": "Point",
                                                "coordinates": coordinateData
                                            },
                                            "properties": {
                                                "title": data.allergyStats.cities[city].city + " (" + data.allergyStats.cities[city].allergies[allergyIndex].developed.percentage*100 +"%)",
                                                "data": data.allergyStats.cities[city].allergies[allergyIndex].developed.percentage*100
                                            }
                                        })

                                        mapChartData.push([data.allergyStats.cities[city].city,
                                                            county,
                                                            data.allergyStats.cities[city].state,
                                                            data.allergyStats.cities[city].allergies[allergyIndex].developed.percentage*100]);
                                        ageChartData.push.apply(ageChartData,data.allergyStats.cities[city].allergies[allergyIndex].developed.ages);
                                    }
                                }
            
                                if (!hasAllergy) {
                                    mapData.push({
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": coordinateData
                                        },
                                        "properties": {
                                            "title": data.allergyStats.cities[city].city + " (0%)",
                                            "data": 0
                                        }
                                    })

                                    mapChartData.push([data.allergyStats.cities[city].city,
                                                        county,
                                                        data.allergyStats.cities[city].state,
                                                        0]);
                                }
            
                                if (city == data.allergyStats.cities.length - 1) {
                                    mapChartLabels.push("% of " + allergy + " allergy");
                                    updateMapChart(mapChartLabels, mapChartData, dataValueType);
                                    updateAgeChart(ageChartData, "Frequency of age developed " + allergy + " allergy");
                                }

                                break;
                            default:
                        }
                    })
                })
            }
            break;
        case "outgrown":
            for (let city = 0; city < data.allergyStats.cities.length; city++) {

                getCoordinates(data.allergyStats.cities[city].city, data.allergyStats.cities[city].state).then(coordinateData => {
                    getCounty(data.allergyStats.cities[city].city, coordinateData).then(county => {

                        var hasOutgrown = false;

                        switch (dataValueType) {
                            case "total":
                                for (let allergyIndex = 0; allergyIndex < data.allergyStats.cities[city].allergies.length; allergyIndex++) {
                                    if (allergy == data.allergyStats.cities[city].allergies[allergyIndex].allergy) {
                                        hasOutgrown = true;

                                        mapData.push({
                                            "type": "Feature",
                                            "geometry": {
                                                "type": "Point",
                                                "coordinates": coordinateData
                                            },
                                            "properties": {
                                                "title": data.allergyStats.cities[city].city + " (" + data.allergyStats.cities[city].allergies[allergyIndex].outgrown.total +")",
                                                "data": data.allergyStats.cities[city].allergies[allergyIndex].outgrown.total
                                            }
                                        })

                                        mapChartData.push([data.allergyStats.cities[city].city,
                                                            county,
                                                            data.allergyStats.cities[city].state,
                                                            data.allergyStats.cities[city].allergies[allergyIndex].outgrown.total]);
                                        ageChartData.push.apply(ageChartData,data.allergyStats.cities[city].allergies[allergyIndex].outgrown.ages);
                                    }
                                }
            
                                if (!hasOutgrown) {
                                    mapData.push({
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": coordinateData
                                        },
                                        "properties": {
                                            "title": data.allergyStats.cities[city].city + " (0)",
                                            "data": 0
            
                                        }
                                    })

                                    mapChartData.push([data.allergyStats.cities[city].city,
                                                        county,
                                                        data.allergyStats.cities[city].state,
                                                        0]);
                                }
            
                                if (city == data.allergyStats.cities.length - 1) {
                                    mapChartLabels.push("Total number of outgrowing " + allergy + " allergy");
                                    updateMapChart(mapChartLabels, mapChartData, dataValueType);
                                    updateAgeChart(ageChartData, "Frequency of age outgrowing " + allergy + " allergy");
                                }

                                break;
                            case "percentage":
                                for (let allergyIndex = 0; allergyIndex < data.allergyStats.cities[city].allergies.length; allergyIndex++) {
                                    if (allergy == data.allergyStats.cities[city].allergies[allergyIndex].allergy) {
                                        hasOutgrown = true;

                                        mapData.push({
                                            "type": "Feature",
                                            "geometry": {
                                                "type": "Point",
                                                "coordinates": coordinateData
                                            },
                                            "properties": {
                                                "title": data.allergyStats.cities[city].city + " (" + data.allergyStats.cities[city].allergies[allergyIndex].outgrown.percentage*100 +"%)",
                                                "data": data.allergyStats.cities[city].allergies[allergyIndex].outgrown.percentage*100
                                            }
                                        })

                                        mapChartData.push([data.allergyStats.cities[city].city,
                                                            county,
                                                            data.allergyStats.cities[city].state,
                                                            data.allergyStats.cities[city].allergies[allergyIndex].outgrown.percentage*100]);
                                        ageChartData.push.apply(ageChartData,data.allergyStats.cities[city].allergies[allergyIndex].outgrown.ages);
                                    }
                                }
            
                                if (!hasOutgrown) {
                                    mapData.push({
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": coordinateData
                                        },
                                        "properties": {
                                            "title": data.allergyStats.cities[city].city + " (0%)",
                                            "data": 0
            
                                        }
                                    })

                                    mapChartData.push([data.allergyStats.cities[city].city,
                                        county,
                                        data.allergyStats.cities[city].state,
                                        0]);
                                }
            
                                if (city == data.allergyStats.cities.length - 1) {
                                    mapChartLabels.push("% of outgrowing " + allergy + " allergy");
                                    updateMapChart(mapChartLabels, mapmapChartData, dataValueType);
                                    updateAgeChart(ageChartData, "Frequency of age outgrowing " + allergy + " allergy");
                                }

                                break;
                            default:
                        }
                    })
                })
            }

            break;
        default:
    }

    return mapData;
}

/**
 * Gets longitude,latitude coordinates for a city
 * 
 * @param {Stirng} city
 * @param {Stirng} state
 */
getCoordinates = async(city, state) => {
    return new Promise(function(resolve, reject) {
        if (getSessionStorage(city+"Coords")) {
            var coordinateArray = getSessionStorage(city+"Coords").split(",");
            resolve(coordinateArray);
        } else {
            var updatedCity = city + " " + state;

            var accessToken = '';
            var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + updatedCity.replace(/ /g, "%20") + ".json?access_token=";

            fetch(url+accessToken).then(response => {
                if (response.ok) {
                    response.json().then(coordinateData => {
                        setSessionStorage(city+"Coords",coordinateData.features[0].geometry.coordinates);
                        resolve(coordinateData.features[0].geometry.coordinates);
                    })
                }
            })
        }
    })
}

/**
 * Gets county for a city
 * 
 * @param {Stirng} city
 * @param {[Number,Number]} coordinateData
 */
getCounty = async(city, coordinateData) => {
    return new Promise(function(resolve,reject) {
        if (getSessionStorage(city+"County")) {
            var county = getSessionStorage(city+"County");
            resolve(county);
        } else {
            var url = "https://geo.fcc.gov/api/census/area?lat=" + coordinateData[1] + "&lon=" + coordinateData[0] + "&format=json";

            fetch(url).then(response => {
                if (response.ok) {
                    response.json().then(countyData => {
                        setSessionStorage(city+"County",countyData.results[0].county_name + " County");
                        resolve(countyData.results[0].county_name);
                    })
                }
            })
        }
    })
}

/**
 * Initial function that loads data and renders web page
 */
function load() {

    if (!sessionStorage.getItem("dataType")) {
        sessionStorage.setItem("dataType", "population"); // Default
    }

    var dataType = sessionStorage.getItem("dataType");

    var dataValueTypeElement = document.getElementById("dataValueType");
    var dataValueType = "total";
    if (dataValueTypeElement.checked) {
        dataValueType = "percentage";
    }

    var allergySelectDiv = document.getElementById("allergySelect");
    var allergyElement = document.getElementById("allergy");
    var allergy = allergyElement.options[allergyElement.selectedIndex].value;

    if (dataType == "population") {
        allergySelectDiv.style.visibility = "hidden";
    } else {
        allergySelectDiv.style.visibility = "visible";
    }

    updateMap(dataType, allergy, dataValueType);
}