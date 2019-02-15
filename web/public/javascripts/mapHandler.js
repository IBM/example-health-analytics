
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
                                    "title": data.populationStats.cities[i].city + " (" + data.populationStats.cities[i].popPercentage +")"
                                }
                            })
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
                                            "title": data.allergyStats.cities[i].city + " (" + data.allergyStats.cities[i].allergies[j].developed +")"
                                        }
                                    })
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
                                        "title": data.allergyStats.cities[i].city + " (0)"
                                    }
                                })
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
                                            "title": data.allergyStats.cities[i].city + " (" + data.allergyStats.cities[i].allergies[j].outgrown +")"
                                        }
                                    })
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
                                        "title": data.allergyStats.cities[i].city + " (0)"
                                    }
                                })
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
        style: 'mapbox://styles/mapbox/light-v9',
        center: [-119.4179, 36.7783],
        maxBounds: bounds
    });

    getData(map, dataType, allergy).then(mapData => {
        map.on('load', function () {
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
                }
            });
        });
    });
}
