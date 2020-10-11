
// Global constants for solvent ratios
var percentsB = ["15%", "35%", "50%", "65%", "85%"];
var percentsA = ["85%", "65%", "50%", "35%", "15%"];
var runStatus = [false, false, false, false, false];
var index = 2;


function changePercent(direction) {
    if (direction == 1 && index != percentsB.length-1) {
        index++;
    }
    if (direction == -1 && index != 0) {
        index--;
    }
    if (runStatus[index]) {
        document.getElementById("percentB").style.color = "#b1e0dc";
        document.getElementById("runButton").style.cursor = "context-menu";
        document.getElementById("runButton").disabled = true;
    }       
    else {
        document.getElementById("percentB").style.color = "#08A696"; 
        document.getElementById("runButton").style.cursor = "pointer";
        document.getElementById("runButton").disabled = false;  
    }
    document.getElementById("percentB").innerHTML = percentsB[index];
    document.getElementById("percentA").innerHTML = percentsA[index];
}


function MakeChroms() {
    runStatus[index] = true;
    switch(index) {
        case 0:
        break;
        case 1:
        break;
        case 2:
        break;
        case 3:
        break;
        case 4:
        break;
    }
}


// Real-time Graph
const xlabels = [];
        const ylabels = [];
        const realTimeX = [];
        const realTimeY = [];
        
        chartIt();
        async function getData(){
            const response = await fetch('real-time-graph.csv');
            const data = await response.text();
            console.log(data);

            const rows = data.split('\n');
            console.log(rows);
            rows.forEach(elt => {
                const row = elt.split(',');
                const time = parseFloat(row[0]);
                realTimeX.push(time);
                const signal = parseFloat(row[1]);
                realTimeY.push(signal);
                console.log(time,signal);
            });
        }
        async function chartIt(){
            await getData();
            const ctx = document.getElementById('chart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    // change this to make it draw a data set instead of just y value
                    labels: xlabels,
                    datasets: [{
                        label: 'Signal(arb. units)',
                        data: realTimeY,
                    },
                    ],
                },
                options: {
                responsive: false,
                    scales: {
                        xAxes: [{
                            ticks: {
                            max: 10,
                            min: 0,
                            maxTicksLimit: 40,
                            }
                        }]
                    }
                }
            });
            ;

            var i;
            for(i=0; i < realTimeX.length; i++){
                await sleep(realTimeX[i]*6000);
                addData(myChart,realTimeX[i]);
            }

        }

        function addData(chart,label) {
            chart.data.labels.push(label);
            //chart.data.datasets.forEach((dataset) => {
            //    dataset.data.push(data);
           // });
            chart.update();
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

// Mass Spectra
chartIt('Ethacrynic_acid_methylMS.csv');

// source: https://www.youtube.com/watch?v=RfMkdvN-23o 
async function getData(filename) {
    // arrays for x and y values
    const xVals = [];
    const yVals = [];

    // reads csv file and trims is
    const path = '../data/DopingLab_dev/MSData/'+filename;
    const response = await fetch(path);
    var data = await response.text();
    data = data.trim();

    // populate the arrays with the data
    const rows = data.split('\n');
    console.log(rows);
    rows.forEach(element => {
        const row = element.split(',');
        const ratio = parseFloat(row[0]);
        xVals.push(ratio);
        const abund = parseFloat(row[1]/10000);
        yVals.push(abund);
        console.log(ratio, abund);
    });
    return {xVals, yVals};
}

async function chartIt(filename) {
    const data = await getData(filename);
    var ctx = document.getElementById('massSpectra');
    var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: data.xVals,
        datasets: [{
            data: data.yVals,
            backgroundColor: '#A3D86C',
            borderColor: 'grey',
            hoverBackgroundColor: '#56BF84', 
            barPercentage: 1.0
        }]
    },

    // Configuration options go here
    options: {
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Relative Abundance',
                },
            }],
            xAxes: [{
                
                scaleLabel: {
                    display: true,
                    labelString: 'Mass-to-Change Ratio (m/z)',
                },
                ticks: {
                        beginAtZero: false,
                        }
            }]
        },
    }
    })
}