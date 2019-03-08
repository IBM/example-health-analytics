/**
 * Manages and updates Chart.js charts with data from the datalake
 */

/**
 * Updates Bar Chart with the data that is associated with the map
 * 
 * @param {[String]} chartLabels 
 * @param {[Number]} chartData 
 * @param {String} dataLabel 
 */
function updateMapChart(chartLabels, chartData, dataLabel) {
    document.getElementById("mapChart").remove();

    var chartDiv = document.getElementById("chart");
    var newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('id','mapChart');
    newCanvas.setAttribute('width','1000px');
    newCanvas.setAttribute('height','500px');
    chartDiv.appendChild(newCanvas);
    var ctx = document.getElementById("mapChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [{
                label: dataLabel,
                data: chartData,
                borderWidth: 1,
                backgroundColor: '#00ABC0'
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

/**
 * Updates bar chart for age of developing/outgrowing allergies data
 * 
 * @param {[Number]} chartData 
 * @param {String} dataLabel 
 */
function updateAgeChart(chartData, dataLabel) {
    removeAgeChart();

    var result = getAgeChartData(chartData);
    var chartLabels = result[0];
    chartData = result[1];

    var chartDiv = document.getElementById("chart");
    var newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('id','ageChart');
    newCanvas.setAttribute('width','300px');
    newCanvas.setAttribute('height','300px');
    chartDiv.appendChild(newCanvas);
    var ctx = document.getElementById("ageChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [{
                label: dataLabel,
                data: chartData,
                borderWidth: 1,
                backgroundColor: '#00ABC0'
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

/**
 * Removes age chart from web page
 */
function removeAgeChart() {
    var ageChart = document.getElementById("ageChart");
    if (ageChart) {
        ageChart.remove();
    }
}

/**
 * Gets frequency of ages from the data
 * 
 * @param {[Number]} chartData 
 */
function getAgeChartData(chartData) {
    var labels = []
    var data = []
    var prev;
    
    chartData.sort((a, b) => a - b);
    for (var i = 0; i < chartData.length; i++ ) {
        if ( chartData[i] !== prev ) {
            labels.push(chartData[i]);
            data.push(1);
        } else {
            data[data.length-1]++;
        }
        prev = chartData[i];
    }
    
    return [labels, data];
}

/**
 * Updates statistics that are associated with the data from the map
 * 
 * @param {String} dataType 
 * @param {Object} data 
 * @param {String} allergy 
 * @param {String} dataValueType 
 */
function updateStats(dataType, data, allergy, dataValueType) {
    var titleDiv = document.getElementById('statTitle');
    var minDiv = document.getElementById('min');
    var maxDiv = document.getElementById('max');
    var meanDiv = document.getElementById('mean');

    switch (dataType) {
        case "population":
            titleDiv.innerHTML = "Population stats";

            switch (dataValueType) {
                case "total":  
                    minDiv.innerHTML = "Min: " + data.populationStats.min.population + " (" + data.populationStats.min.city + ")";
                    maxDiv.innerHTML = "Max: " + data.populationStats.max.population + " (" + data.populationStats.max.city + ")";
                    meanDiv.innerHTML = "Mean: " + data.populationStats.mean;

                    break;
                case "percentage":
                    minDiv.innerHTML = "Min: " + data.populationStats.min.percentage*100 + "% (" + data.populationStats.min.city + ")";
                    maxDiv.innerHTML = "Max: " + data.populationStats.max.percentage*100 + "% (" + data.populationStats.max.city + ")";
                    meanDiv.innerHTML = "Mean: " + (1/data.populationStats.cities.length)*100 + "%";

                    break;
                default:
            }

            break;
        case "developed":
            titleDiv.innerHTML = "Allergy stats for cities with " + allergy + " allergy";

            switch (dataValueType) {
                case "total":
                    for (let i = 0; i < data.allergyStats.stats.developed.length; i++) {
                        if (allergy == data.allergyStats.stats.developed[i].allergy) {
                            minDiv.innerHTML = "Min: " + data.allergyStats.stats.developed[i].min.total.min + " (" + data.allergyStats.stats.developed[i].min.total.city + ")";
                            maxDiv.innerHTML = "Max: " + data.allergyStats.stats.developed[i].max.total.max + " (" + data.allergyStats.stats.developed[i].max.total.city + ")";
                            meanDiv.innerHTML = "Mean: " + data.allergyStats.stats.developed[i].mean.total;
                        }
                    }

                    break;
                case "percentage":
                    for (let i = 0; i < data.allergyStats.stats.developed.length; i++) {
                        if (allergy == data.allergyStats.stats.developed[i].allergy) {
                            minDiv.innerHTML = "Min: " + data.allergyStats.stats.developed[i].min.percentage.min*100 + "% (" + data.allergyStats.stats.developed[i].min.percentage.city + ")";
                            maxDiv.innerHTML = "Max: " + data.allergyStats.stats.developed[i].max.percentage.max*100 + "% (" + data.allergyStats.stats.developed[i].max.percentage.city + ")";
                            meanDiv.innerHTML = "Mean: " + data.allergyStats.stats.developed[i].mean.percentage*100 + "%";
                        }
                    }

                    break;
                default:
            }

            break;
        case "outgrown":
            titleDiv.innerHTML = "Outgrowing allergy stats for cities with " + allergy + " allergy";
            
            switch (dataValueType) {
                case "total":
                    for (let i = 0; i < data.allergyStats.stats.outgrown.length; i++) {
                        if (allergy == data.allergyStats.stats.outgrown[i].allergy) {
                            minDiv.innerHTML = "Min: " + data.allergyStats.stats.outgrown[i].min.total.min + " (" + data.allergyStats.stats.outgrown[i].min.total.city + ")";
                            maxDiv.innerHTML = "Max: " + data.allergyStats.stats.outgrown[i].max.total.max + " (" + data.allergyStats.stats.outgrown[i].max.total.city + ")";
                            meanDiv.innerHTML = "Mean: " + data.allergyStats.stats.outgrown[i].mean.total;
                        }
                    }

                    break;
                case "percentage":
                    for (let i = 0; i < data.allergyStats.stats.outgrown.length; i++) {
                        if (allergy == data.allergyStats.stats.outgrown[i].allergy) {
                            minDiv.innerHTML = "Min: " + data.allergyStats.stats.outgrown[i].min.percentage.min*100 + "% (" + data.allergyStats.stats.outgrown[i].min.percentage.city + ")";
                            maxDiv.innerHTML = "Max: " + data.allergyStats.stats.outgrown[i].max.percentage.max*100 + "% (" + data.allergyStats.stats.outgrown[i].max.percentage.city + ")";
                            meanDiv.innerHTML = "Mean: " + data.allergyStats.stats.outgrown[i].mean.percentage*100 + "%";
                        }
                    }

                    break;
                default:
            }

            break;
        default:
    }
}