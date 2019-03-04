
getData = async(map, dataType, allergy, dataValueType) => { 

    return new Promise(function(resolve, reject) {
        var url = "./data";

        var http = new XMLHttpRequest();

        http.open("GET", url, true);

        http.onreadystatechange = function()
        {
            if(http.readyState == 4 && http.status == 200) {
                var data = JSON.parse(http.responseText);

                getDataForMap(dataType, data, allergy, dataValueType).then(mapData => {
                    updateStats(dataType, data, allergy, dataValueType);
                    resolve(mapData);
                })
            }
        }
        http.send(null);
    })
}

getDataForMap = async(dataType, data, allergy, dataValueType) => {

    mapData = [];

    var mapChartLabels = [];
    var mapChartData = [];
    var ageChartData = [];

    switch (dataType) {
        case "population":
            for (let i = 0; i < data.populationStats.cities.length; i++) {

                getCoordinates(data.allergyStats.cities[i].city).then(coordinateData => {
                    switch (dataValueType) {
                        case "total":
                            mapData.push({
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": coordinateData
                                },
                                "properties": {
                                    "title": data.populationStats.cities[i].city + " (" + data.populationStats.cities[i].population + ")",
                                    "data": data.populationStats.cities[i].population
                                }
                            })
                            mapChartLabels.push(data.populationStats.cities[i].city);
                            mapChartData.push(data.populationStats.cities[i].population);
                            if (i == data.populationStats.cities.length - 1) {
                                updateMapGraph(mapChartLabels, mapChartData, "population");
                                removeAgeGraph();
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
                                    "title": data.populationStats.cities[i].city + " (" + data.populationStats.cities[i].percentage*100 + "%)",
                                    "data": data.populationStats.cities[i].percentage*100
                                }
                            })
                            mapChartLabels.push(data.populationStats.cities[i].city);
                            mapChartData.push(data.populationStats.cities[i].percentage*100);
                            if (i == data.populationStats.cities.length - 1) {
                                updateMapGraph(mapChartLabels, mapChartData, "% of population");
                                removeAgeGraph();
                            }
                            break;
                        default:
                    }
                })
            }
            break;
        case "developed":
            for (let i = 0; i < data.allergyStats.cities.length; i++) {

                getCoordinates(data.allergyStats.cities[i].city).then(coordinateData => {
                    var hasAllergy = false;

                    switch (dataValueType) {
                        case "total":
                            for (let j = 0; j < data.allergyStats.cities[i].allergies.length; j++) {
                                if (allergy == data.allergyStats.cities[i].allergies[j].allergy) {
                                    hasAllergy = true;
                                    mapData.push({
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": coordinateData
                                        },
                                        "properties": {
                                            "title": data.allergyStats.cities[i].city + " (" + data.allergyStats.cities[i].allergies[j].developed.total +")",
                                            "data": data.allergyStats.cities[i].allergies[j].developed.total
                                        }
                                    })
                                    mapChartLabels.push(data.allergyStats.cities[i].city);
                                    mapChartData.push(data.allergyStats.cities[i].allergies[j].developed.total);
                                    ageChartData.push.apply(ageChartData,data.allergyStats.cities[i].allergies[j].developed.ages);
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
                                        "title": data.allergyStats.cities[i].city + " (0)",
                                        "data": 0
                                    }
                                })
                                mapChartLabels.push(data.allergyStats.cities[i].city);
                                mapChartData.push(0);
                            }
        
                            if (i == data.allergyStats.cities.length - 1) {
                                updateMapGraph(mapChartLabels, mapChartData, "Total number of " + allergy + " allergy");
                                updateAgeGraph(ageChartData, "Frequency of age developed " + allergy + " allergy");
                            }
                            break;
                        case "percentage":
                            for (let j = 0; j < data.allergyStats.cities[i].allergies.length; j++) {
                                if (allergy == data.allergyStats.cities[i].allergies[j].allergy) {
                                    hasAllergy = true;
                                    mapData.push({
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": coordinateData
                                        },
                                        "properties": {
                                            "title": data.allergyStats.cities[i].city + " (" + data.allergyStats.cities[i].allergies[j].developed.percentage*100 +"%)",
                                            "data": data.allergyStats.cities[i].allergies[j].developed.percentage*100
                                        }
                                    })
                                    mapChartLabels.push(data.allergyStats.cities[i].city);
                                    mapChartData.push(data.allergyStats.cities[i].allergies[j].developed.percentage*100);
                                    ageChartData.push.apply(ageChartData,data.allergyStats.cities[i].allergies[j].developed.ages);
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
                                        "title": data.allergyStats.cities[i].city + " (0%)",
                                        "data": 0
                                    }
                                })
                                mapChartLabels.push(data.allergyStats.cities[i].city);
                                mapChartData.push(0);
                            }
        
                            if (i == data.allergyStats.cities.length - 1) {
                                updateMapGraph(mapChartLabels, mapChartData, "% of " + allergy + " allergy");
                                updateAgeGraph(ageChartData, "Frequency of age developed " + allergy + " allergy");
                            }
                            break;
                        default:
                    }
                })
            }
            break;
        case "outgrown":
            for (let i = 0; i < data.allergyStats.cities.length; i++) {

                getCoordinates(data.allergyStats.cities[i].city).then(coordinateData => {
                    var hasOutgrown = false;

                    switch (dataValueType) {
                        case "total":
                            for (let j = 0; j < data.allergyStats.cities[i].allergies.length; j++) {
                                if (allergy == data.allergyStats.cities[i].allergies[j].allergy) {
                                    hasOutgrown = true;
                                    mapData.push({
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": coordinateData
                                        },
                                        "properties": {
                                            "title": data.allergyStats.cities[i].city + " (" + data.allergyStats.cities[i].allergies[j].outgrown.total +")",
                                            "data": data.allergyStats.cities[i].allergies[j].outgrown.total
                                        }
                                    })
                                    mapChartLabels.push(data.allergyStats.cities[i].city);
                                    mapChartData.push(data.allergyStats.cities[i].allergies[j].outgrown.total);
                                    ageChartData.push.apply(ageChartData,data.allergyStats.cities[i].allergies[j].outgrown.ages);
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
                                        "title": data.allergyStats.cities[i].city + " (0)",
                                        "data": 0
        
                                    }
                                })
                                mapChartLabels.push(data.allergyStats.cities[i].city);
                                mapChartData.push(0);
                            }
        
                            if (i == data.allergyStats.cities.length - 1) {
                                updateMapGraph(mapChartLabels, mapChartData, "Total number of outgrowing " + allergy + " allergy");
                                updateAgeGraph(ageChartData, "Frequency of age outgrowing " + allergy + " allergy");
                            }

                            break;
                        case "percentage":
                            for (let j = 0; j < data.allergyStats.cities[i].allergies.length; j++) {
                                if (allergy == data.allergyStats.cities[i].allergies[j].allergy) {
                                    hasOutgrown = true;
                                    mapData.push({
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": coordinateData
                                        },
                                        "properties": {
                                            "title": data.allergyStats.cities[i].city + " (" + data.allergyStats.cities[i].allergies[j].outgrown.percentage*100 +"%)",
                                            "data": data.allergyStats.cities[i].allergies[j].outgrown.percentage*100
                                        }
                                    })
                                    mapChartLabels.push(data.allergyStats.cities[i].city);
                                    mapChartData.push(data.allergyStats.cities[i].allergies[j].outgrown.percentage*100);
                                    ageChartData.push.apply(ageChartData,data.allergyStats.cities[i].allergies[j].outgrown.ages);
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
                                        "title": data.allergyStats.cities[i].city + " (0%)",
                                        "data": 0
        
                                    }
                                })
                                mapChartLabels.push(data.allergyStats.cities[i].city);
                                mapChartData.push(0);
                            }
        
                            if (i == data.allergyStats.cities.length - 1) {
                                updateMapGraph(mapChartLabels, mapmapChartData, "% of outgrowing " + allergy + " allergy");
                                updateAgeGraph(ageChartData, "Frequency of age outgrowing " + allergy + " allergy");
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

getCoordinates = async(city) => {
    return new Promise(function(resolve, reject) {
        if (getSessionStorage(city)) {
            var coordinateArray = getSessionStorage(city).split(",");
            resolve(coordinateArray);
        } else {
            var updatedCity = city + " California";

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

function load() {

    if (!sessionStorage.getItem("dataType")) {
        sessionStorage.setItem("dataType", "population"); // Default
    }

    var dataType = sessionStorage.getItem("dataType");

    var dataValueTypeElement = document.getElementById("dataValueType");
    var dataValueType = dataValueTypeElement.options[dataValueTypeElement.selectedIndex].value;

    var allergyElement = document.getElementById("allergy");
    var allergy = allergyElement.options[allergyElement.selectedIndex].value;

    if (dataType == "population") {
        allergyElement.style.visibility = "hidden";
    } else {
        allergyElement.style.visibility = "visible";
    }

    mapboxgl.accessToken = '';

    var bounds = [
        [-125.284370, 31.842101],
        [-114.091281, 42.484264],
    ]

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v9',
        center: [-119.4179, 36.7783],
        maxBounds: bounds
    });

    getData(map, dataType, allergy, dataValueType).then(mapData => {
        map.on('load', function () {

            var heatmapMin = 1;
            var heatmapMax = 1;

            switch (dataValueType) {
                case "total":
                    for (var i = 0; i < mapData.length; i++) {
                        if (heatmapMax < mapData[i].properties.data) {
                            heatmapMax = mapData[i].properties.data;
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
