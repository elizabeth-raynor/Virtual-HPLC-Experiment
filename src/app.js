// Global constant for case
const caseNum = 2;

// Global constants for solvent ratios
const percentsB = ["0%", "15%", "25%", "45%", "70%"];
const percentsA = ["100%", "85%", "75%", "55%", "30%"];
var runStatus = [false, false, false, false, false];
const areas = [[86674,99256,110955], [21250,141568, 6225], [15203,42560,10525], [2256, 9536, 25638]];
const ranges = [[[.955, 1.5], [2.352, 3.23], [3.23, 4.345]], 
                [[.97, 1.5], [2.445, 4.47], [5.005, 6.82]],
                [[.96, 1.5], [1.93, 3.685], [4.655, 7.215]],
                [[1.5, 2.265], [2.265, 3.5], [5.605, 8.745]]
            ];
var ratioNum = 3;

// Paths
var caseStartPath = '../data/DopingLab_dev/';
var calibStartPath = '../data/DopingLab_dev/Calibrations/';

// Arrays of filenames
const caseNames = ["Case1", "Case2", "Case3", "Case4"];
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
    chromPath += caseNames[caseNum] + '/' + chromNames[ratioNum];
    console.log(chromPath);
    chartChrom(chromPath);
}


/****************************************************************************/
// Real-time Graph Current-- uncomment when running real-time-final.html, comment out when not

const chromPath = caseStartPath + caseNames[caseNum] + '/' + chromNames[ratioNum];
chartChrom(chromPath);
var dict = {};
const realTimeX = [];
const realTimeY = [];
var hoverMode = false;
var maxY = 0;

async function getChromData(path){
    const response = await fetch(path);
    var data = await response.text();
    data = data.trim();

    const rows = data.split('\n');
    rows.forEach(elt => {
        const row = elt.split(',');
        dict[row[0]] = row[1];
        const time = parseFloat(row[0]);
        
        // Add times to x-axis array if they are a number
        if (!isNaN(Number(time))) {
            realTimeX.push(time);
        }
        
        // Add signals to y-axis array if they are a number
        const signal = parseFloat(row[1]);
        if (!isNaN(Number(signal))) {
            realTimeY.push(signal);
        }  
    });
    maxY = getMaxY();
}

function getMaxY() {
    realTimeYNum = [];
    realTimeY.forEach(number => {
        realTimeYNum.push(Number(number));
    });
    var max = Math.max.apply(Math, realTimeYNum);
    var roundedMax = Math.ceil(max/100)*100;
    return roundedMax; 
}

async function chartChrom(path){
    await getChromData(path);

    // Add the title of the chromatogram to the page
    const title = caseNames[caseNum] + ': ' + percentsA[ratioNum] + ' Solvent A, ' + percentsB[ratioNum] + ' Solvent B ';
    document.getElementById("chrom-chart-title").innerHTML = title; 
    document.getElementById("chrom-chart-title").style.opacity = 1;

    // Make the chart
    const ctx = document.getElementById('chrom').getContext('2d');    
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            // change this to make it draw a data set instead of just y value
            labels: [],
            datasets: [{
                label: 'Signal(arb. units)',
                data: [],
                backgroundColor: 
                'rgba(163, 216, 108, 0.5)',
                radius: 2
            }],
        },
        options: {
            legend: {
                display: false
            },
            responsive: false,
            scales: {
                xAxes: [{
                    ticks: {
                    max: 10,
                    min: 0,
                    maxTicksLimit: 40,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Retention Time (min)'
                    }
                }],
                yAxes: [{
                    ticks: {
                    max: maxY,
                    min: 0,
                    maxTicksLimit: 11,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Signal (arb. units)'
                    }
                }],
            },
            hover: {
                onHover: function(elements) {
                    const coords = getCursorPosition(elements, ctx);
                    const yCoord = coords[0];
                    const xData = coords[1];
                    if (yCoord > 0 && yCoord < dict[xData]) {
                        document.getElementById("hover-info").innerHTML= areaInfo();
                        document.getElementById("hover-info").style.opacity="1";
                    }
                    else {
                        document.getElementById("hover-info").style.opacity="0";
                    }
                }
            },
            tooltips: {
                callbacks: {
                    title: function(tooltipItem, data) {
                        var title = "Retention Time (min): " + realTimeX[tooltipItem[0].index];
                        return title;
                    },
                    label: function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += Math.round(tooltipItem.yLabel * 100) / 100;
                        return label;
                    }
                }
            }
        }
});
   
    // Add the data to the graph in real time
    hoverMode = false;
    var i;
    for(i=0; i < realTimeX.length; i++){
        //await sleep(realTimeX[i]* 1e-10000);
        addData(myChart,realTimeX[i],realTimeY[i]);
    }
    hoverMode = true;  

    // Enable all buttons on the graph after the graph is made
    document.getElementById('hover-tip').style.opacity = 1;
    document.getElementById('again').style.opacity = 1;
    document.getElementById('again').disabled = false;
    document.getElementById('next').style.opacity = 1;
    document.getElementById('next').disabled = false;
    document.getElementById('download').style.opacity = 1;
    document.getElementById('download').disabled = false;

    // enable click function for MS
    enableMSClick(ctx);   
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCursorPosition(event, ctx) { 
    // source: https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element

    const canvas = document.getElementById('chrom');
    let rect = canvas.getBoundingClientRect(); 
    let x = event.clientX - rect.left; 
    let y = event.clientY - rect.top; 
    
    //Convert x on cavas to x value in the data set
    var xCoord = ((x-57)/(795-57))*10

    var xData = (Math.ceil(xCoord*200)/200).toFixed(2)
    
    // Convert y on canvas to y value on the graph
    var yCoord = (((331-y))/(331))*maxY;
    //console.log("x: " + x + "\nxCoord: " + xCoord + "\ny: " + y + "\nyCoord: " + yCoord);

    return [yCoord, xData];
} 

function areaInfo() {
    text = '';
    switch (caseNum) {
        case 0: 
            switch (ratioNum) {
            case 0:
                text += 'Area (1)= ' + areas[caseNum].reduce((a,b) => a + b, 0) + '*';
                break;
            case 1:
                const sum = areas[caseNum][1]+areas[caseNum][2];
                text += 'Area (1) = ' + areas[caseNum][0] + 
                        '*<br>Area (2) = ' + (areas[caseNum][1]+areas[caseNum][2]) + '*';
                break;
            case 2:
                text += 'Area (1) = ' + areas[caseNum][0] + 
                        '<br>Area (2) = ' + areas[caseNum][1] + 
                        '*<br>Area (3) = ' + areas[caseNum][2] + '*';
                break;
            case 3:
                text += 'Area (1) = ' + areas[caseNum][0] + 
                        '<br>Area (2) = ' + areas[caseNum][1] + 
                        '<br>Area (3) = ' + areas[caseNum][2];
                break;
            case 4:

                text += 'Area (1) = ' + areas[caseNum][0] + 
                        '<br>Area (2) = ' + areas[caseNum][1] + 
                        '<br>Area (3) = ' + (areas[caseNum][2]-20000) + '*';
                break;
            }
            break;
        case 1:
            switch (ratioNum) {
                case 0:
                    text += 'Area (1)= ' + areas[caseNum].reduce((a,b) => a + b, 0) + '*';
                    break;
                case 1:
                    text += 'Area (1) = ' + (areas[caseNum][0]-1050) + 
                            '*<br>Area (2) = ' + (areas[caseNum][1]+areas[caseNum][2] + 1050) + '*';
                    break;
                case 2:
                    text += 'Area (1) = ' + areas[caseNum][0] + 
                            '<br>Area (2) = ' + (areas[caseNum][1]+areas[caseNum][2] - 170) + '*';
                    break;
                case 3:
                    text += 'Area (1) = ' + areas[caseNum][0] + 
                            '<br>Area (2) = ' + areas[caseNum][1] + 
                            '<br>Area (3) = ' + areas[caseNum][2];
                    break;
                case 4:
                    text += 'Area (1) = ' + areas[caseNum][0] + 
                            '<br>Area (2)= ' + areas[caseNum][1] + 
                            '<br>Area (3)= ' + (areas[caseNum][2]-15) + '*';
                    break;
                }
                break;
        case 2:
            switch (ratioNum) {
                case 0:
                    text += 'Area (1)= ' + areas[caseNum].reduce((a,b) => a + b, 0) + '*';
                    break;
                case 1:
                    text += 'Area (1) = ' + (areas[caseNum][0]-453) + 
                            '*<br>Area (2) = ' + (areas[caseNum][1]+areas[caseNum][2]+453) + '*';
                    break;
                case 2:
                    text += 'Area (1) = ' + areas[caseNum][0] + 
                            '*<br>Area (2) = ' + areas[caseNum][1]+
                            '*<br>Area (3) = ' + areas[caseNum][2];
                    break;
                case 3:
                    text += 'Area (1) = ' + areas[caseNum][0] + 
                            '<br>Area (2) = ' + areas[caseNum][1] + 
                            '<br>Area (3) = ' + areas[caseNum][2];
                    break;
                case 4:
                    text += 'Area (1) = ' + areas[caseNum][0] + 
                            '<br>Area (2)= ' + areas[caseNum][1] + 
                            '<br>Area (3)= ' + (areas[caseNum][2]-3000) + '*';
                    break;
                }
                break;
        case 3: 
            switch (ratioNum) {
                case 0:
                    text += 'Area (1)= ' + areas[caseNum].reduce((a,b) => a + b, 0) + '*';
                    break;
                case 1:
                    text += 'Area (1)= ' + areas[caseNum].reduce((a,b) => a + b, 0) + '*';
                    break;
                case 2:
                    text += 'Area (1) = ' + (areas[caseNum][0]+areas[caseNum][1]) +
                            '*<br>Area (3) = ' + areas[caseNum][2];
                    break;
                case 3:
                    text += 'Area (1) = ' + areas[caseNum][0] + 
                            '<br>Area (2) = ' + areas[caseNum][1] + 
                            '<br>Area (3) = ' + areas[caseNum][2];
                    break;
                case 4:
                    text += 'Area (1) = ' + areas[caseNum][0] + 
                            '<br>Area (2)= ' + areas[caseNum][1] + 
                            '<br>Area (3)= ' + (areas[caseNum][2]-16093) + '*';
                    break;
                }
                break;
    }
    return text;
}


/**************************************************************************************/
// Mass Spectra -- Uncomment when run Mass-spectra.html, comment out when not

// arrays for x and y values
const xValsMS = [];
const yValsMS = [];

function enableMSClick(ctx) {
    document.getElementById('chrom').onclick = function(elements) {
        console.log("peakNum before click: " + sessionStorage["peakNum"]);
        if (ratioNum == 3) {
            const coords = getCursorPosition(elements, ctx);
            const yCoord = coords[0];
            const xData = coords[1];
            var MSPath = '';
            if ( yCoord > 0 && yCoord < dict[xData]) {
                if (ranges[caseNum][0][0] < xData && xData < ranges[caseNum][0][1]) {
                    //console.log('peak 1');
                    MSPath = caseStartPath + caseNames[caseNum] + '/' + MSNames[0];   
                    sessionStorage["peakNum"] = 0;
                }
                else if (ranges[caseNum][1][0] < xData && xData < ranges[caseNum][1][1]) {
                    //console.log('peak 2');
                    MSPath = caseStartPath + caseNames[caseNum] + '/' + MSNames[1];
                    sessionStorage["peakNum"] = 1;
                }
                else if (ranges[caseNum][2][0] < xData && xData < ranges[caseNum][2][1]) {
                    //console.log('peak 3');
                    MSPath = caseStartPath + caseNames[caseNum] + '/' + MSNames[2];
                    sessionStorage["peakNum"] = 2;
                }
                //console.log("peakNum after click: " + sessionStorage["peakNum"])
            window.location.href = "mass-spectra.html";
            sessionStorage["path-to-MS"] = MSPath;
            }
        }
    }
}

function MakeMS() {
    var MSPath = sessionStorage.getItem("path-to-MS");
    console.log("peakNum after click: " + sessionStorage["peakNum"]);
    //console.log(MSPath);
    chartMS(MSPath);
}

// source: https://www.youtube.com/watch?v=RfMkdvN-23o 
async function getMSData(path) {
    

    // reads csv file and trims is
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

async function chartMS(path) {
    const data = await getMSData(path);

    // Add the title of the graph to the page
    const title = caseNames[caseNum] + ': Peak ' + (Number(sessionStorage["peakNum"]) + 1) + " Mass Spectra";
    document.getElementById("MS-chart-title").innerHTML = title; 
    document.getElementById("MS-chart-title").style.opacity = 1;

    // Make MS graph
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
        tooltips: {
            callbacks: {
                title: function(tooltipItem, data) {
                    var title = "Mass-to-Change Ratio: " + xValsMS[tooltipItem[0].index];
                    return title;
                },
                label: function(tooltipItem, data) {
                    var label = "Relative Abundance: " + tooltipItem.yLabel;
                    return label;
                }
            }
        }
    }
    })
}




/********************************************************** */
// Real-time Graph code V.2
/*
chartChrom('../data/DopingLab_dev/Case1/Chrom1.csv');
const realTimeX = [];
const realTimeY = [];
var hoverMode = false;


async function getChromData(path){
    const response = await fetch(path);
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

async function chartChrom(path){
    await getChromData(path);
    const ctx = document.getElementById('chrom');
    var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        // change this to make it draw a data set instead of just y value
        labels: [],
        datasets: [{
            label: 'Signal(arb. units)',
            data: [],
            backgroundColor: 
            'rgba(163, 216, 108, 0.5)',
        }],
    },
    options: {
        legend: {
            display: false
        },
        responsive: false,
        scales: {
            xAxes: [{
                ticks: {
                max: 10,
                min: 0,
                maxTicksLimit: 40,
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Retention Time (min)'
                }
            }],
            yAxes: [{
                ticks: {
                max: 10000,
                min: 0,
                maxTicksLimit: 11,
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Signal (arb. units)'
                }
            }],
        },
        
        //onClick: getCursorPosition,
        hover: {
            // Overrides the global setting
            enabled: true,
            //mode: 'dataset',
            onHover: function(elements) {
                getCursorPosition(elements);
            }
        }
    }
});
    hoverMode = false;
    var i;
    for(i=0; i < realTimeX.length; i++){
        await sleep(realTimeX[i]*0);
        addData(myChart,realTimeX[i],realTimeY[i]);
    }
    hoverMode = true;  
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCursorPosition(event) {
    var i;
    if(hoverMode){
    const can = document.getElementById('chart');
    const rect = can.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    var chartX=(x-44)/95;
    var chartY=(452-y)*23.809;
        for(i=103;i<200;i++){
            if(Math.abs(chartX-realTimeX[i])<0.05 && chartY<realTimeY[i]){
                console.log("x: " + chartX + " y: " + chartY);
                //alert("Area for Peak1");
                document.getElementById("text").innerHTML="Area for Peak1<br>Width of Peak1";
                document.getElementById("text").style.opacity="1";
                return;
            }
        }
        document.getElementById("text").innerHTML="";
        document.getElementById("text").style.opacity="0";
        
    }
}
*/

/******************************************************************* */
// Real-time Graph code V.1
/*
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
        await sleep(xValsChrom[i]*10);
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
*/