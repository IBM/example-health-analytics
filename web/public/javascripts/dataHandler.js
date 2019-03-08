/**
 * Responsible for getting and handling data
 */

 /**
  * Updates data type in storage and reloads map/charts with data based on the data type
  * 
  * @param {String} newDataType 
  */
function updateDataType(newDataType) {
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

                processDataForMap(dataType, data, allergy, dataValueType).then(mapData => {
                    updateStats(dataType, data, allergy, dataValueType);
                    resolve(mapData);
                })
            }
        }
        http.send(null);
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
    var dataValueType = dataValueTypeElement.options[dataValueTypeElement.selectedIndex].value;

    var allergyElement = document.getElementById("allergy");
    var allergy = allergyElement.options[allergyElement.selectedIndex].value;

    if (dataType == "population") {
        allergyElement.style.visibility = "hidden";
    } else {
        allergyElement.style.visibility = "visible";
    }

    updateMap(dataType, allergy, dataValueType);
}