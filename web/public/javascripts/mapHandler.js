
getData = async(map, dataType, allergy) => { 

    return new Promise(function(resolve, reject) {
        var url = "./data";

        var http = new XMLHttpRequest();

        http.open("GET", url, true);

        http.onreadystatechange = function()
        {
            if(http.readyState == 4 && http.status == 200) {
                var data = JSON.parse(http.responseText);

                getDataForMap(dataType, data, allergy).then(mapData => {
                    resolve(mapData);
                })
            }
        }
        http.send(null);
    })
}

getDataForMap = async(dataType, data, allergy) => {

    mapData = [];

    var accessToken = '';

    var chartLabels = [];
    var chartData = [];

    switch (dataType) {
        case "population":
            for (let i = 0; i < data.populationStats.cities.length; i++) {

                var city = data.populationStats.cities[i].city + " California";

                var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + city.replace(/ /g, "%20") + ".json?access_token=";

                fetch(url+accessToken).then(response => {
                    if (response.ok) {
                        response.json().then(coordinateData => {
                            mapData.push({
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": coordinateData.features[0].geometry.coordinates
                                },
                                "properties": {
                                    "title": data.populationStats.cities[i].city + " (" + data.populationStats.cities[i].popPercentage*100 +"%)",
                                    "percentage": data.populationStats.cities[i].popPercentage*100
                                }
                            })
                            chartLabels.push(data.populationStats.cities[i].city);
                            chartData.push(data.populationStats.cities[i].popPercentage*100);
                            if (i == data.populationStats.cities.length - 1) {
                                updateGraph(chartLabels, chartData, "% of population");
                            }
                        })
                    }
                })
            }
            break;
        case "type":
            for (let i = 0; i < data.allergyStats.cities.length; i++) {

                var city = data.allergyStats.cities[i].city + " California";

                var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + city.replace(/ /g, "%20") + ".json?access_token=";

                fetch(url+accessToken).then(response => {
                    if (response.ok) {
                        response.json().then(coordinateData => {
                            var hasAllergy = false;
                            for (let j = 0; j < data.allergyStats.cities[i].allergies.length; j++) {
                                if (allergy == data.allergyStats.cities[i].allergies[j].allergy) {
                                    hasAllergy = true;
                                    mapData.push({
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": coordinateData.features[0].geometry.coordinates
                                        },
                                        "properties": {
                                            "title": data.allergyStats.cities[i].city + " (" + data.allergyStats.cities[i].allergies[j].developed*100 +"%)",
                                            "percentage": data.allergyStats.cities[i].allergies[j].developed*100
                                        }
                                    })
                                    chartLabels.push(data.allergyStats.cities[i].city);
                                    chartData.push(data.allergyStats.cities[i].allergies[j].developed*100);
                                }
                            }

                            if (!hasAllergy) {
                                mapData.push({
                                    "type": "Feature",
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": coordinateData.features[0].geometry.coordinates
                                    },
                                    "properties": {
                                        "title": data.allergyStats.cities[i].city + " (0%)",
                                        "percentage": 0
                                    }
                                })
                                chartLabels.push(data.allergyStats.cities[i].city);
                                chartData.push(0);
                            }

                            if (i == data.allergyStats.cities.length - 1) {
                                updateGraph(chartLabels, chartData, "% of " + allergy + " allergy");
                            }
                        })
                    }
                })
            }
            break;
        case "outgrown":
            for (let i = 0; i < data.allergyStats.cities.length; i++) {

                var city = data.allergyStats.cities[i].city + " California";

                var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + city.replace(/ /g, "%20") + ".json?access_token=";

                fetch(url+accessToken).then(response => {
                    if (response.ok) {
                        response.json().then(coordinateData => {
                            var hasOutgrown = false;
                            for (let j = 0; j < data.allergyStats.cities[i].allergies.length; j++) {
                                if (allergy == data.allergyStats.cities[i].allergies[j].allergy) {
                                    hasOutgrown = true;
                                    mapData.push({
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": coordinateData.features[0].geometry.coordinates
                                        },
                                        "properties": {
                                            "title": data.allergyStats.cities[i].city + " (" + data.allergyStats.cities[i].allergies[j].outgrown*100 +"%)",
                                            "percentage": data.allergyStats.cities[i].allergies[j].outgrown*100
                                        }
                                    })
                                    chartLabels.push(data.allergyStats.cities[i].city);
                                    chartData.push(data.allergyStats.cities[i].allergies[j].outgrown*100);
                                }
                            }

                            if (!hasOutgrown) {
                                mapData.push({
                                    "type": "Feature",
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": coordinateData.features[0].geometry.coordinates
                                    },
                                    "properties": {
                                        "title": data.allergyStats.cities[i].city + " (0%)",
                                        "percentage": 0

                                    }
                                })
                                chartLabels.push(data.allergyStats.cities[i].city);
                                chartData.push(0);
                            }

                            if (i == data.allergyStats.cities.length - 1) {
                                updateGraph(chartLabels, chartData, "% of outgrowing " + allergy + " allergy");
                            }
                        })
                    }
                })
            }
            break;
        default:
    }

    return mapData;
}

function load() {

    var dataTypeElement = document.getElementById("data");
    var dataType = dataTypeElement.options[dataTypeElement.selectedIndex].value;

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

    getData(map, dataType, allergy).then(mapData => {
        map.on('load', function () {

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
                ["get", "percentage"],
                0, 0,
                6, 1
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

function updateGraph(chartLabels, chartData, dataLabel) {
    document.getElementById("myChart").remove();
    var chartDiv = document.getElementById("chart");
    var newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('id','myChart');
    newCanvas.setAttribute('width','500px');
    newCanvas.setAttribute('height','500px');
    chartDiv.appendChild(newCanvas);
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [{
                label: dataLabel,
                data: chartData,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}
