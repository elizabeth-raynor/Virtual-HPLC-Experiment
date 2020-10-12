
// Global constant for case
const caseNum = "Case1";

// Global constants for solvent ratios
const percentsB = ["15%", "35%", "50%", "65%", "85%"];
const percentsA = ["85%", "65%", "50%", "35%", "15%"];
var runStatus = [false, false, false, false, false];
var ratioNum = 2;
var peakNum = 1;

// Paths
var chromPath = '../data/DopingLab_dev/';
var MSPath = '../data/DopingLab_dev/MSData/';
var calibPath = '../data/DopingLab_dev/Calibrations/';

// Arrays of filenames
const chromNames = ['Chrom1.csv', 'Chrom2.csv', 'Chrom3.csv', 'Chrom4.csv', 'Chrom5.csv'];
const MSNames = ['Peak1_MS.csv', 'Peak2_MS.csv', 'Peak3_MS.csv'];


function changePercent(direction) {
    if (direction == 1 && ratioNum != percentsB.length-1) {
        ratioNum++;
    }
    if (direction == -1 && ratioNum != 0) {
        ratioNum--;
    }
    if (runStatus[ratioNum]) {
        document.getElementById("percentB").style.color = "#b1e0dc";
        document.getElementById("runButton").style.cursor = "context-menu";
        document.getElementById("runButton").disabled = true;
    }       
    else {
        document.getElementById("percentB").style.color = "#08A696"; 
        document.getElementById("runButton").style.cursor = "pointer";
        document.getElementById("runButton").disabled = false;  
    }
    document.getElementById("percentB").innerHTML = percentsB[ratioNum];
    document.getElementById("percentA").innerHTML = percentsA[ratioNum];
}

function MakeChroms() {
    runStatus[ratioNum] = true;
    chromPath += caseNum + '/' + chromNames[ratioNum];
    console.log(chromPath);
    chartChrom(chromPath);
}


/****************************************************************************/
// Real-time Graph

const xlabels = [];
const ylabels = [];
const xValsChrom = [];
const yValsChrom = [];

// Read the csv file, parse it, and populate arrays with the data
async function getChromData(path){
    const response = await fetch(path);
    var data = await response.text();
    data = data.trim();
    //console.log(data);

    const rows = data.split('\n');
    //console.log(rows);
    rows.forEach(elt => {
        const row = elt.split(',');
        const time = parseFloat(row[0]);
        xValsChrom.push(time);
        const signal = parseFloat(row[1]);
        yValsChrom.push(signal);
        //console.log(time,signal);
    });
}

// Make the real-time chromatogram with chart.js
async function chartChrom(path){
    await getChromData(path);
    const ctx = document.getElementById('chrom').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            // change this to make it draw a data set instead of just y value
            labels: xlabels,
            datasets: [{
                label: 'Signal(arb. units)',
                data: yValsChrom,
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
    for(i=0; i < xValsChrom.length; i++){
        await sleep(xValsChrom[i]*6000);
        addChromData(myChart,xValsChrom[i]);
    }

}

function addChromData(chart,label) {
    chart.data.labels.push(label);
    //chart.data.datasets.forEach((dataset) => {
    //    dataset.data.push(data);
    // });
    chart.update();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/**************************************************************************************/
// Mass Spectra
chartMS('Ethacrynic_acid_methylMS.csv');

// source: https://www.youtube.com/watch?v=RfMkdvN-23o 
async function getMSData(filename) {
    // arrays for x and y values
    const xValsMS = [];
    const yValsMS = [];

    // reads csv file and trims is
    const path = '../data/DopingLab_dev/MSData/'+filename;
    const response = await fetch(path);
    var data = await response.text();
    data = data.trim();

    // populate the arrays with the data
    const rows = data.split('\n');
    //console.log(rows);
    rows.forEach(element => {
        const row = element.split(',');
        const ratio = parseFloat(row[0]);
        xValsMS.push(ratio);
        const abund = parseFloat(row[1]/10000);
        yValsMS.push(abund);
        //console.log(ratio, abund);
    });
    return {xVals: xValsMS, yVals: yValsMS};
}

async function chartMS(filename) {
    const data = await getMSData(filename);
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