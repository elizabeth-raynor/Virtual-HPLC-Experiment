
// Global constant for case
const caseNum = "Case1";

// Global constants for solvent ratios
const percentsB = ["0%", "15%", "25%", "45%", "70%"];
const percentsA = ["100%", "85%", "75%", "55%", "30%"];
var runStatus = [false, false, false, false, false];
const areas = [[86674,99256,110955], [21250,141568, 6225], [15203,42560,10525], [2256, 9536, 25638]];
var ratioNum = 1;
var peakNum = 1;
let rungraph = [];

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
    //store the current ratio
    localStorage["percnum"] = JSON.stringify(ratioNum);
}

function MakeChroms() {
    runStatus[ratioNum] = true;
    chromPath += caseNum + '/' + chromNames[ratioNum];
    console.log(chromPath);
    chartChrom(chromPath);
}
//get stored ratio info
function getPerc() {
    
    ratioNum = JSON.parse(localStorage["percnum"]);
    document.getElementById("percentsA").innerHTML = percentsA[ratioNum];
    document.getElementById("percentsB").innerHTML = percentsB[ratioNum];
}

//show the buttons after graph is done.
function showButtons(){
    document.getElementById("trybut").style.display = "inline-block";
    document.getElementById("next").style.display = "inline-block";
    console.log("buttons have been summoned but why not showing?");
}

chartChrom('../data/DopingLab_dev/Case1/Chrom1.csv');
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
    var roundedMax = Math.ceil(max/1000)*1000;
    return roundedMax; 
}

async function chartChrom(path){
    await getChromData(path);
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
                    getCursorPosition(elements, ctx);
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
    hoverMode = false;
    var i;
    for(i=0; i < realTimeX.length; i++){
        //await sleep(realTimeX[i]*10000);
        addData(myChart,realTimeX[i],realTimeY[i]);
    }
    hoverMode = true;  
    showButtons();
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

    ctx.save();
    if (yCoord < dict[xData]){
        //console.log('inside');
        //ctx.font = "30px Arial";
        //ctx.fillText('Area', 600,35);
        document.getElementById("Hover-Info").innerHTML= areaInfo();
        document.getElementById("Hover-Info").style.opacity="1";
    }
    else {
        //console.log("outside");
        document.getElementById("Hover-Info").style.opacity="0";
    }
} 

function areaInfo() {
    text = '';
    switch (ratioNum) {
        case 0:
            console.log("Case " + (ratioNum+1));
            text += 'Peak 1 Area = ' + areas[ratioNum].reduce((a,b) => a + b, 0);
            //console.log(areas[ratioNum].reduce((a,b) => a + b, 0));
            break;
        case 1:
            console.log("Case " + (ratioNum+1));
            text += 'Peak 1 Area = ' + areas[ratioNum][0] + 
                    '<br>Peak 2 Area = ' + areas[ratioNum][1]+areas[ratioNum][2];
            break;
        case 2:
            console.log("Case " + (ratioNum+1));
            text += 'Peak 1 Area = ' + areas[ratioNum][0] + 
                    '<br>Peak 2 Area = ' + areas[ratioNum][1] + 
                    '<br>Peak 3 Area = ' + areas[ratioNum][2];
            break;
        case 3:
            console.log("Case " + (ratioNum+1));
            text += 'Peak 1 Area = ' + areas[ratioNum][0] + 
                    '<br>Peak 2 Area = ' + areas[ratioNum][1] + 
                    '<br>Peak 3 Area = ' + areas[ratioNum][2];
            break;
        case 4:
            console.log("Case " + (ratioNum+1));
            text += 'Peak 1 Area = ' + areas[ratioNum][0] + 
                    '<br>Peak 2 Area = ' + areas[ratioNum][1] + 
                    '<br>Peak 3 Area = ' + areas[ratioNum][2]-2000;
            break;
    }
    return text;
}

/**************************************************************************************/
// Mass Spectra -- Uncomment when run Mass-spectra.html, comment out when not

chartMS('Ethacrynic_acid_methylMS.csv');
// arrays for x and y values
const xValsMS = [];
const yValsMS = [];

// source: https://www.youtube.com/watch?v=RfMkdvN-23o 
async function getMSData(filename) {

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