/**
 * Manages and updates Mapbox map with data from the datalake
 */

 /**
  * Processes analytics data for mapbox map and updates charts with processed data
  * 
  * @param {Stirng} dataType
  * @param {Stirng} data
  * @param {Stirng} allergy
  * @param {Stirng} dataValueType
  */
processDataForMap = async(dataType, data, allergy, dataValueType) => {

    mapData = [];

    var mapChartLabels = [];
    var mapChartData = [];
    var ageChartData = [];

    switch (dataType) {
        case "population":
            for (let city = 0; city < data.populationStats.cities.length; city++) {

                getCoordinates(data.populationStats.cities[city].city, data.populationStats.cities[city].state).then(coordinateData => {
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

                            mapChartLabels.push(data.populationStats.cities[city].city);
                            mapChartData.push(data.populationStats.cities[city].population);

                            if (city == data.populationStats.cities.length - 1) {
                                updateMapChart(mapChartLabels, mapChartData, "population");
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

                            mapChartLabels.push(data.populationStats.cities[city].city);
                            mapChartData.push(data.populationStats.cities[city].percentage*100);

                            if (city == data.populationStats.cities.length - 1) {
                                updateMapChart(mapChartLabels, mapChartData, "% of population");
                                removeAgeChart();
                            }

                            break;
                        default:
                    }
                })
            }
            break;
        case "developed":
            for (let city = 0; city < data.allergyStats.cities.length; city++) {

                getCoordinates(data.allergyStats.cities[city].city, data.allergyStats.cities[city].state).then(coordinateData => {
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

                                    mapChartLabels.push(data.allergyStats.cities[city].city);
                                    mapChartData.push(data.allergyStats.cities[city].allergies[allergyIndex].developed.total);
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

                                mapChartLabels.push(data.allergyStats.cities[city].city);
                                mapChartData.push(0);
                            }
        
                            if (city == data.allergyStats.cities.length - 1) {
                                updateMapChart(mapChartLabels, mapChartData, "Total number of " + allergy + " allergy");
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

                                    mapChartLabels.push(data.allergyStats.cities[city].city);
                                    mapChartData.push(data.allergyStats.cities[city].allergies[allergyIndex].developed.percentage*100);
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

                                mapChartLabels.push(data.allergyStats.cities[city].city);
                                mapChartData.push(0);
                            }
        
                            if (city == data.allergyStats.cities.length - 1) {
                                updateMapChart(mapChartLabels, mapChartData, "% of " + allergy + " allergy");
                                updateAgeChart(ageChartData, "Frequency of age developed " + allergy + " allergy");
                            }

                            break;
                        default:
                    }
                })
            }
            break;
        case "outgrown":
            for (let city = 0; city < data.allergyStats.cities.length; city++) {

                getCoordinates(data.allergyStats.cities[city].city, data.allergyStats.cities[city].state).then(coordinateData => {
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

                                    mapChartLabels.push(data.allergyStats.cities[city].city);
                                    mapChartData.push(data.allergyStats.cities[city].allergies[allergyIndex].outgrown.total);
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

                                mapChartLabels.push(data.allergyStats.cities[city].city);
                                mapChartData.push(0);
                            }
        
                            if (city == data.allergyStats.cities.length - 1) {
                                updateMapChart(mapChartLabels, mapChartData, "Total number of outgrowing " + allergy + " allergy");
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

                                    mapChartLabels.push(data.allergyStats.cities[city].city);
                                    mapChartData.push(data.allergyStats.cities[city].allergies[allergyIndex].outgrown.percentage*100);
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

                                mapChartLabels.push(data.allergyStats.cities[city].city);
                                mapChartData.push(0);
                            }
        
                            if (city == data.allergyStats.cities.length - 1) {
                                updateMapChart(mapChartLabels, mapmapChartData, "% of outgrowing " + allergy + " allergy");
                                updateAgeChart(ageChartData, "Frequency of age outgrowing " + allergy + " allergy");
                            }

                            break;
                        default:
                    }
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
        if (getSessionStorage(city)) {
            var coordinateArray = getSessionStorage(city).split(",");
            resolve(coordinateArray);
        } else {
            var updatedCity = city + " " + state;

            var accessToken = '';
            var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + updatedCity.replace(/ /g, "%20") + ".json?access_token=";

            fetch(url+accessToken).then(response => {
                if (response.ok) {
                    response.json().then(coordinateData => {
                        setSessionStorage(city,coordinateData.features[0].geometry.coordinates);
                        resolve(coordinateData.features[0].geometry.coordinates);
                    })
                }
            })
        }
    })
}

/**
 * Updates map with data based on parameters
 * 
 * @param {String} dataType 
 * @param {String} allergy 
 * @param {String} dataValueType 
 */
function updateMap(dataType, allergy, dataValueType) {

    mapboxgl.accessToken = '';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v9',
        center: [-100.5467, 46.0731],
        zoom: 2,
        minZoom: 2
    });

    getData(map, dataType, allergy, dataValueType).then(mapData => {
        map.on('load', function () {

            var heatmapMin = 1;
            var heatmapMax = 1;

            switch (dataValueType) {
                case "total":
                    for (var data = 0; data < mapData.length; data++) {
                        if (heatmapMax < mapData[data].properties.data) {
                            heatmapMax = mapData[data].properties.data;
                        }
                    }

                    break;
                case "percentage":
                    heatmapMax = 100;
                    break;
                default:
            }

            map.addLayer({
                "id": "heat",
                "type": "heatmap",
                "source": {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": mapData
                    }
                },
                "maxzoom": 9,
                "paint": {
                // Increase the heatmap weight based on frequency and property magnitude
                "heatmap-weight": [
                "interpolate",
                ["linear"],
                ["get", "data"],
                0, 0,
                heatmapMax, heatmapMin
                ],
                // Increase the heatmap color weight weight by zoom level
                // heatmap-intensity is a multiplier on top of heatmap-weight
                "heatmap-intensity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0, 1,
                9, 3
                ],
                // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                // Begin color ramp at 0-stop with a 0-transparancy color
                // to create a blur-like effect.
                "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0, "rgba(33,102,172,0)",
                0.2, "rgb(103,169,207)",
                0.4, "rgb(209,229,240)",
                0.6, "rgb(253,219,199)",
                0.8, "rgb(239,138,98)",
                1, "rgb(178,24,43)"
                ],
                // Adjust the heatmap radius by zoom level
                "heatmap-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0, 2,
                9, 100
                ],
                }
                }, 'waterway-label');

            map.addLayer({
                "id": "points",
                "type": "symbol",
                "source": {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": mapData
                    }
                },
                "layout": {
                    "text-field": "{title}",
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-anchor": "top"
                },
                "paint": {
                    "icon-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, 0,
                        8, 1
                        ]
                }
            });
        });
    });
}
