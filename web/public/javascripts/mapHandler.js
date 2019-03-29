/**
 * Manages and updates Mapbox map with data from the datalake
 */

/**
 * Updates map with data based on parameters
 *
 * @param {String} dataType
 * @param {String} allergy
 * @param {String} dataValueType
 */
function updateMap(dataType, allergy, dataValueType) {

    mapboxgl.accessToken = '';

    getData(dataType, allergy, dataValueType).then(mapData => {

        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/antonmc/cjr27i9iw0wbq2rnwtvkrbgog',
            center: [-119.7871, 36.7378],
            zoom: 5,
            minZoom: 5
        });




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
                0, "rgba(149,214,198,0)",
                0.2, "rgb(252,210,188)",
                0.4, "rgb(253,237,228)",
                0.6, "rgb(253,219,199)",
                0.8, "rgb(239,138,98)",
                1, "rgb(249,143,88)"
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
