/**************************************************************************************/
// VARIABLES

//keep track of ratio selections
var ratioNum = JSON.parse(sessionStorage["ratioNum"]);
var caseNum = JSON.parse(sessionStorage['caseNum']);
var runStatus = JSON.parse(sessionStorage['runStatus']);

// Base paths
var caseBasePath = '../data/DopingLab_dev/';
var calibBasePath = '../data/DopingLab_dev/Calibrations/';

// Arrays of folder/file names
const caseNames = ["Case1", "Case2", "Case3", "Case4"];
const chromNames = ['Chrom1.csv', 'Chrom2.csv', 'Chrom3.csv', 'Chrom4.csv', 'Chrom5.csv'];
const chromPics = ['Chrom1.png', 'Chrom2.png', 'Chrom3.png', 'Chrom4.png', 'Chrom5.png'];
const MSNames = ['Peak1_MS.csv', 'Peak2_MS.csv', 'Peak3_MS.csv'];
const MSPics = ['Peak1_MS.png', 'Peak2_MS.png', 'Peak3_MS.png'];


/**************************************************************************************/
// ADD SOLVENT

const percentsB = ["0%", "15%", "25%", "45%", "70%"];
const percentsA = ["100%", "85%", "75%", "55%", "30%"];
const solventA = ' H<sub>2</sub>O';
const solventB = ' CH<sub>3</sub>CN';

//change the percent when the up and down arrows are click on add-solvent.html
function changePercent(direction) {
    if (direction == 1 && ratioNum != percentsB.length - 1) {
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
    sessionStorage["ratioNum"] = JSON.stringify(ratioNum);
}

//check if the ratio has been run already
function statusCheck() {
    if (runStatus[ratioNum]) {
        document.getElementById("percentB").style.color = "#b1e0dc";
        document.getElementById("runButton").style.cursor = "context-menu";
        document.getElementById("runButton").disabled = true;
    }
}
//get stored ratio info
function getPerc() {
    document.getElementById("percentA").innerHTML = percentsA[ratioNum];
    document.getElementById("percentB").innerHTML = percentsB[ratioNum];
}

//reset the stored value
function ratioReset() {
    runStatus = [false, false, false, false, false];
    sessionStorage["runStatus"] = JSON.stringify(runStatus);
}

/**************************************************************************************/
// SOLVENT RATIO REAL-TIME


//arrays to store data for solve raito real-time graphs
const realTimeX = [];
const realTimeY = [];

//dictionary to access the data for solven ratio real-time graphs
var realTimeDict = {};

//maximum value in the y dataset (is updated later)
var maxY = 0;

//column info that is displayed in the title of the solvent ratio real-time graphs
const columnInfo = ', C18 Reverse Phase, 100 mm long, 5 µm particles';

// the areas of the peaks in each case
const areas = [[86674, 99256, 110955], 
[21250, 141568, 6225], 
[15203, 42560, 10525], 
[2256, 9536, 25638]];

//solvent ratio sleep value
const solventRatioSleep = 0; //170 makes it take 10 min on Jenny's computer

//initiate the making of the solvent ratio chromatograms
function runChroms() {
    var hoverMode = false;
    var MSClick = false;

    //running real-time graph for solvent ratio so set runStatus to true
    runStatus[ratioNum] = true;
    //update session storage for the runStatus
    sessionStorage["runStatus"] = JSON.stringify(runStatus);

    //chart appropriate data according to case and ratio num
    var chromPath = caseBasePath + caseNames[caseNum] + '/' + chromNames[ratioNum];
    chartChrom(chromPath);
}

//make the solvent ratio chromatogram
async function chartChrom(path) {

    // Get data
    await getChromData(path);

    //add the title of the chromatogram to the page
    var caseName = caseNames[caseNum].substring(0, caseNames[caseNum].length - 1) + ' ' + caseNames[caseNum].substring(caseNames[caseNum].length - 1);
    const title = caseName + ': ' + percentsA[ratioNum] + solventA + ', ' + percentsB[ratioNum] + solventB + columnInfo;
    document.getElementById("chrom-chart-title").innerHTML = title;
    document.getElementById("chrom-chart-title").style.opacity = 1;

    //get the chart from the HTML
    ctx = document.getElementById('chrom').getContext('2d');
    canvas = document.getElementById('chrom');

    //make the chart
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
                onHover: function (elements) {
                    getCursorPosition(elements, canvas);
                }
            },
            tooltips: {
                callbacks: {
                    title: function (tooltipItem, data) {
                        var title = "Retention Time (min): " + realTimeX[tooltipItem[0].index];
                        return title;
                    },
                    label: function (tooltipItem, data) {
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
    for (i = 0; i < realTimeX.length; i++) {
        await sleep(solventRatioSleep); 
        addData(myChart, realTimeX[i], realTimeY[i]);
    }
    hoverMode = true;

    // Enable all buttons on the graph after the graph is made
    if (runStatus.includes(false)) {
        document.getElementById('again').style.opacity = 1;
        document.getElementById('again').disabled = false;
    }
    else {
        document.getElementById('again').disabled = true;
    }

    document.getElementById('download').style.opacity = 1;
    document.getElementById('download').disabled = false;

    var chromDownloadPath = caseBasePath + caseNames[caseNum] + '/' + chromPics[ratioNum];
    var chromDownloadName = caseNames[caseNum] + '_' + chromPics[ratioNum];

    document.getElementById("chromDownload").href = chromDownloadPath;
    document.getElementById("chromDownload").download = chromDownloadName;

    document.getElementById('hover-tip').style.opacity = 1;
    document.getElementById('next').style.opacity = 1;
    document.getElementById('next').disabled = false;
}

//read and parse the CSV, add the data to arrays and dictionary for the solvent ratio chromatrogram
async function getChromData(path) {

    //read and trim the data
    const response = await fetch(path);
    var data = await response.text();
    data = data.trim();

    //populate the arrays with the data
    const rows = data.split('\n');
    rows.forEach(elt => {
        const row = elt.split(',');
        realTimeDict[row[0]] = row[1];
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

//determine the max y value in the data to set the y-axis
function getMaxY() {
    var max = Math.max.apply(Math, realTimeY);
    var roundedMax = Math.ceil(max / 100) * 100;
    return roundedMax;
}

//add the data to the solvent ratio chromatogram
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

//add the data in real time to the solvent ratio chromatogram
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//get the cursor position for the real-time graph
function getCursorPosition(event, canvas) {
    // source: https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
    
if (hoverMode) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    //Convert x on cavas to x value in the data set
    var xCoord = ((x - 57) / (795 - 57)) * 10

    var xData = (Math.ceil(xCoord * 200) / 200).toFixed(2)

    // Convert y on canvas to y value on the graph
    var yCoord = (((331 - y)) / (331)) * maxY;
    //console.log("x: " + x + "\nxCoord: " + xCoord + "\ny: " + y + "\nyCoord: " + yCoord);

    if (yCoord > 0 && yCoord < realTimeDict[xData]) {
        document.getElementById("hover-info").innerHTML = areaInfo();
        document.getElementById("hover-info").style.opacity = "1";
    }
    else {
        document.getElementById("hover-info").style.opacity = "0";
    }

    if (MSClick) {
        canvas.onclick = function (elements) {
        var MSPath = '';
            if (yCoord > 0 && yCoord < realTimeDict[xData]) {
                if (ranges[caseNum][0][0] < xData && xData < ranges[caseNum][0][1]) {
                    MSPath = caseBasePath + caseNames[caseNum] + '/' + MSNames[0];
                    sessionStorage["peakNum"] = 0;
                }
                else if (ranges[caseNum][1][0] < xData && xData < ranges[caseNum][1][1]) {
                    MSPath = caseBasePath + caseNames[caseNum] + '/' + MSNames[1];
                    sessionStorage["peakNum"] = 1;
                }
                else if (ranges[caseNum][2][0] < xData && xData < ranges[caseNum][2][1]) {
                    MSPath = caseBasePath + caseNames[caseNum] + '/' + MSNames[2];
                    sessionStorage["peakNum"] = 2;
                }
                window.location.href = "mass-spectra.html";
                sessionStorage["path-to-MS"] = MSPath;
            }
        }
    }
}
}

//make the labels to display the area information
function areaInfo() {
    text = '';
    switch (caseNum) {
        case 0:
            switch (ratioNum) {
                case 0:
                    text += 'Area (1)= ' + areas[caseNum].reduce((a, b) => a + b, 0) + '*';
                    break;
                case 1:
                    const sum = areas[caseNum][1] + areas[caseNum][2];
                    text += 'Area (1) = ' + areas[caseNum][0] +
                        '*<br>Area (2) = ' + (areas[caseNum][1] + areas[caseNum][2]) + '*';
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
                        '<br>Area (3) = ' + (areas[caseNum][2] - 20000) + '*';
                    break;
            }
            break;
        case 1:
            switch (ratioNum) {
                case 0:
                    text += 'Area (1)= ' + areas[caseNum].reduce((a, b) => a + b, 0) + '*';
                    break;
                case 1:
                    text += 'Area (1) = ' + (areas[caseNum][0] - 1050) +
                        '*<br>Area (2) = ' + (areas[caseNum][1] + areas[caseNum][2] + 1050) + '*';
                    break;
                case 2:
                    text += 'Area (1) = ' + areas[caseNum][0] +
                        '<br>Area (2) = ' + (areas[caseNum][1] + areas[caseNum][2] - 170) + '*';
                    break;
                case 3:
                    text += 'Area (1) = ' + areas[caseNum][0] +
                        '<br>Area (2) = ' + areas[caseNum][1] +
                        '<br>Area (3) = ' + areas[caseNum][2];
                    break;
                case 4:
                    text += 'Area (1) = ' + areas[caseNum][0] +
                        '<br>Area (2)= ' + areas[caseNum][1] +
                        '<br>Area (3)= ' + (areas[caseNum][2] - 15) + '*';
                    break;
            }
            break;
        case 2:
            switch (ratioNum) {
                case 0:
                    text += 'Area (1)= ' + areas[caseNum].reduce((a, b) => a + b, 0) + '*';
                    break;
                case 1:
                    text += 'Area (1) = ' + (areas[caseNum][0] - 453) +
                        '*<br>Area (2) = ' + (areas[caseNum][1] + areas[caseNum][2] + 453) + '*';
                    break;
                case 2:
                    text += 'Area (1) = ' + areas[caseNum][0] +
                        '*<br>Area (2) = ' + areas[caseNum][1] +
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
                        '<br>Area (3)= ' + (areas[caseNum][2] - 3000) + '*';
                    break;
            }
            break;
        case 3:
            switch (ratioNum) {
                case 0:
                    text += 'Area (1)= ' + areas[caseNum].reduce((a, b) => a + b, 0) + '*';
                    break;
                case 1:
                    text += 'Area (1)= ' + areas[caseNum].reduce((a, b) => a + b, 0) + '*';
                    break;
                case 2:
                    text += 'Area (1) = ' + (areas[caseNum][0] + areas[caseNum][1]) +
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
                        '<br>Area (3)= ' + (areas[caseNum][2] - 16093) + '*';
                    break;
            }
            break;
    }
    return text;
}
/**************************************************************************************/
// SELECT BEST

//show the selection option for the selectBest page
let checker = arr => arr.every(v => v === false);
function selectOption() {
    var selectra = document.getElementById("selectRatio");
    if (checker(runStatus)) {
        var d = document.createElement("option");
        d.text = "Run a trial first!";
        selectra.options.add(d, 1);
    }

    for (var i = 0; i < runStatus.length; i++) {
        if (runStatus[i]) {
            var c = document.createElement("option");
            c.text = percentsA[i] + ' H2O, ' + percentsB[i] + " CH3CN";
            selectra.options.add(c, i);
        }
    }

    var graphNum = 1;
    for (i = 0; i < runStatus.length; i++) {
        if (runStatus[i]) {
            var graphID = 'graph' + graphNum;
            var graphTitleID = graphID + 'Title';
            document.getElementById(graphID).src = caseBasePath + caseNames[caseNum] + '/' + chromPics[i];
            document.getElementById(graphTitleID).innerHTML = percentsA[i] + solventA + ', ' + percentsB[i] + solventB;
            graphNum++;
        }
    }

}

//give functionality to the Submit button on the selectBest page
function submitChoice() {
    //get the data for the selected choice
    var content = document.getElementById("selectRatio").value;
    //get the part of the data that is only the percent values
    var choice = content.match(/\d+%/g);

    //check the choice selectted and see if it's correct
    if (choice != "55%,45%" && choice != "30%,70%") {
        alert("This one (" + content + ") will not work. Peaks may not be fully separated. Please select another ratio!");
    } 
    else if (choice == "30%,70%") {
        alert("This one (" + content + ") will not work. Peaks may be cut off at the end. Please select another ratio!")
    }
    else {
        window.location.href = "best-separation.html";
    }
}

/**************************************************************************************/
// BEST SEPARATION

//make the chart of the best separation
async function chartBest() {

    sessionStorage['ratioNum'] = 3;

    //Get the data
    bestChromPath = caseBasePath + caseNames[caseNum] + '/' + chromNames[3];
    await getChromData(bestChromPath);

    // Add the title of the chromatogram to the page
    var caseName = caseNames[caseNum].substring(0, caseNames[caseNum].length - 1) + ' ' + caseNames[caseNum].substring(caseNames[caseNum].length - 1);
    const title = caseName + ': ' + percentsA[ratioNum] + solventA + ', ' + percentsB[ratioNum] + solventB;
    document.getElementById("chrom-chart-title").innerHTML = title;
    document.getElementById("chrom-chart-title").style.opacity = 1;

    // Make the chart
    const ctx = document.getElementById('bestChrom').getContext('2d');
    const canvas = document.getElementById('bestChrom');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            // change this to make it draw a data set instead of just y value
            labels: realTimeX,
            datasets: [{
                label: 'Signal(arb. units)',
                data: realTimeY,
                backgroundColor: 'rgba(163, 216, 108, .5)',
            },
            ]
        },
        options: {
            responsive: false,
            legend: {
                display: false
            },
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
                        maxTicksLimit: 21
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Signal (arb. units)'
                    }
                }],
            },
            hover: {
                onHover: function (elements) {
                    getCursorPosition(elements, canvas);
                    
                }
            },
            tooltips: {
                callbacks: {
                    title: function (tooltipItem, data) {
                        var title = "Retention Time (min): " + realTimeX[tooltipItem[0].index];
                        return title;
                    },
                    label: function (tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += Math.round(tooltipItem.yLabel * 100) / 100;
                        return label;
                    },
                },
            },
        }
    });

    hoverMode = true;

    //this graph is the best separation graph so enable the MS click function
    MSClick = true;
}

/**************************************************************************************/
// MASS SPECTRA

// arrays to store the MS data
const xValsMS = [];
const yValsMS = [];

// x ranges of the peaks of the best separation for all cases
const ranges = [[[.955, 1.5], [2.352, 3.23], [3.23, 4.345]],
[[.97, 1.5], [2.445, 4.47], [5.005, 6.82]],
[[.96, 1.5], [1.93, 3.685], [4.655, 7.215]],
[[1.5, 2.265], [2.265, 3.5], [5.605, 8.745]]
];

//initiate the making of the MS chart
function runMS() {
    //retrieve path to the MS data from session storage
    var MSPath = sessionStorage.getItem("path-to-MS");

    //chart the MS data
    chartMS(MSPath);

    //set up Download Button
    var MSDownloadPath = caseBasePath + caseNames[caseNum] + '/' + MSPics[peakNum];
    var MSDownloadName = caseNames[caseNum] + '_' + MSPics[peakNum];
    document.getElementById("MSDownload").href = MSDownloadPath;
    document.getElementById("MSDownload").download = MSDownloadName;
}

//read and the CSV that has the MS data, and store the data in array
//source: https://www.youtube.com/watch?v=RfMkdvN-23o 
async function getMSData(path) {
    // read csv file and trim it
    const response = await fetch(path);
    var data = await response.text();
    data = data.trim();

    // populate the arrays with the data
    const rows = data.split('\n');
    rows.forEach(element => {
        const row = element.split(',');
        const ratio = parseFloat(row[0]);
        xValsMS.push(ratio);
        const abund = parseFloat(row[1] / 10000);
        yValsMS.push(abund);
    });
    return { xVals: xValsMS, yVals: yValsMS };
}

//make the chart
async function chartMS(path) {

    //get the data
    const data = await getMSData(path);

    // Add the title of the graph to the page
    const title = caseNames[caseNum] + ': Peak ' + (JSON.parse(sessionStorage["peakNum"]) + 1) + " Mass Spectra";
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
                    title: function (tooltipItem, data) {
                        var title = "Mass-to-Change Ratio: " + xValsMS[tooltipItem[0].index];
                        return title;
                    },
                    label: function (tooltipItem, data) {
                        var label = "Relative Abundance: " + tooltipItem.yLabel;
                        return label;
                    }
                }
            }
        }
    })
}

/**************************************************************************************/
// CALIBRATION REAL-TIME

var first;
var second;
var third;
var forth;
//arrays to store the data for each graph
const x1 = [];
const y1 = [];
const x2 = [];
const y2 = [];
const x3 = [];
const y3 = [];
const x4 = [];
const y4 = [];
//dictionarys to access the data for each graph
var dict1 = {};
var dict2 = {};
var dict3 = {};
var dict4 = {};

//the selected compound from calibration select page
var selectedcmpd = -1;

//areas of the calibraiton curves
const calibrationArea = [[7370, 23804, 86891, 150534], [9597, 23319, 91002, 227054], [1072, 18291, 39363, 55005], [1072, 18291, 39363, 55005], [3684, 12718, 46383, 118860], [3684, 12718, 46383, 118860], [6574, 23554, 89508, 233279], [13598, 69753, 127019, 452253], [9597, 23319, 91002, 227054], [2090, 17676, 41710, 57836], [13598, 69753, 127019, 452253], [9597, 23319, 91002, 227054], [9597, 23319, 91002, 227054], [13598, 69753, 127019, 452253]];

//file names for the calibraiton compounds
const calibrationFilePaths = [["Acetaminophen"], ["AcetylsalicylicAcid"], ["Amphetamine_Case4"], ["Amphetamine_Case123"], 
["Caffeine"], ["Chlorothiazide"], ["Ephedrine"], ["EthacrynicAcidMethylEster"], ["Ibuprofen"], ["Methamphetamine"], 
["Methylphenidate"], ["Phenylephrine"], ["Pseudoephedrine"], ["THC"]];

//names of the images when they are downloaded
const calibraitonDownloadNames = [["Acetaminophen"], ["Acetylsalicylic Acid"], ["Amphetamine Case4"], ["Amphetamine Case123"], 
["Caffeine"], ["Chlorothiazide"], ["Ephedrine"], ["Ethacrynic Acid MethylEster"], ["Ibuprofen"], ["Methamphetamine"], 
["Methylphenidate"], ["Phenylephrine"], ["Pseudoephedrine"], ["THC"]]

//value to delay adding the data to the graph
const calibrationSleep =0; //265 makes it take 10 min on Jenny's computer

//calibraiton chromatogram titles
const calibrationChromTitles = ['Calibration conditions 1', 'Calibration conditions 2', 'Calibration conditions 3', 'Calibration conditions 4'];

//calibraiton chromtrogram colors
const calibratioChromColors = ['rgba(163, 216, 108, .5)', 'rgba(86, 191, 132, .5)', 'rgba(8, 166, 150, .5)', 'rgba(9, 96, 115, .5)']

//HTML chart IDs
const chartID = ['chrom1', 'chrom2', 'chrom3', 'chrom4'];

//HTML hover info IDs
const infoID = ['Info1', 'Info2', 'Info3', 'Info4'];


//read and parse the CSVs, store the data in arrays and a dictionary
async function getCalibData(path, dict, x, y) {

    //read the csv file and trim it
    const response = await fetch(path);
    var data = await response.text();
    data = data.trim();

    //populate the arrays with the data
    const rows = data.split('\n');
    rows.forEach(elt => {
        const row = elt.split(',');
        dict[row[0]] = row[1];
        const time = parseFloat(row[0]);

        // Add times to x-axis array if they are a number
        if (!isNaN(Number(time))) {
            x.push(time);
        }

        // Add signals to y-axis array if they are a number
        const signal = parseFloat(row[1]);
        if (!isNaN(Number(signal))) {
            y.push(signal);
        }
    });
}

//determine max y value in the data to set the y-axis mas value
function getCalibMaxY() {
    var max = Math.max.apply(Math, y4);
    var roundedMax = Math.ceil(max /100) * 100;
    return roundedMax;
}

//create the charts
async function chartCalib() {
    hoverMode = false;

    //get the data for each calibration graph
    await getCalibData(first, dict1, x1, y1);
    await getCalibData(second, dict2, x2, y2);
    await getCalibData(third, dict3, x3, y3);
    await getCalibData(forth, dict4, x4, y4);

    //get the maxY value of all 4 calibraiton graps
    maxY = getCalibMaxY();

    //first calibraiton graph
    const ctx1 = document.getElementById('chrom1').getContext('2d');
    var Chart1 = makeCalibCharts(ctx1, 0);

    //second calibraiton graph
    const ctx2 = document.getElementById('chrom2').getContext('2d');
    var Chart2 = makeCalibCharts(ctx2, 1);

    //third calibraiton graph
    const ctx3 = document.getElementById('chrom3').getContext('2d');
    var Chart3 = makeCalibCharts(ctx3, 2);

    //fouth calibration graph
    const ctx4 = document.getElementById('chrom4').getContext('2d');
    var Chart4 = makeCalibCharts(ctx4, 3);

    //add the data to the graph in real time
    var i;
    for (i = 0; i < x1.length; i++) {
        await sleep(calibrationSleep);
        addCalibData(Chart1, x1[i], y1[i]);
        addCalibData(Chart2, x1[i], y2[i]);
        addCalibData(Chart3, x1[i], y3[i]);
        addCalibData(Chart4, x1[i], y4[i]);
    }

    //graphs are done, so show Download and Next buttons
    hoverMode = true;
    document.getElementById("next").style.opacity = 1;
    document.getElementById('calibratioDownload').style.opacity = 1;
}

//add the data to the charts
function addCalibData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data);
    chart.update();
}

//make the calibraiton charts
function makeCalibCharts(ctx, index) {
    var chart =  new Chart(ctx, {
        type: 'line',
        data: {
            // change this to make it draw a data set instead of just y value
            labels: [],
            datasets: [{
                data: [],
                label: 'Calibration Graph',
                backgroundColor: calibratioChromColors[index],
                display: false,
            },
            ]
        },
        options: {
            responsive: false,
            scales: {
                xAxes: [{
                    ticks: {
                        max: 10,
                        min: 0,
                        maxTicksLimit: 21,
                        beginAtZero: true
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
                        stepSize: 1000,
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Signal (arb. units)'
                    }
                }],
            },
            title: {
                display: true,
                text: calibrationChromTitles[index],
            },
            legend: {
                display: false
            },
            hover: {
                // Overrides the global setting
                enabled: true,
                //mode: 'dataset',
                onHover: function (elements) {
                    getCursorPositionCalib(elements, index);
                }
            },
            tooltips: {
                callbacks: {
                    title: function (tooltipItem, data) {
                        var title = "Retention Time (min): " + realTimeX[tooltipItem[0].index];
                        return title;
                    },
                    label: function (tooltipItem, data) {
                        var label = 'Signal (arb. units)';
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
    return chart;
}

//get the cursor positons for all calibration charts
function getCursorPositionCalib(event, index) {
    if (hoverMode) {
        const canvas = document.getElementById(chartID[index]);
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        //Convert x on cavas to x value in the data set
        var xCoord = ((x - 57) / (795 - 57)) * 10

        var xData = (Math.ceil(xCoord * 200) / 200).toFixed(2)

        // Convert y on canvas to y value on the graph
        var yCoord = (((330 - y)) / (332)) * maxY;
        //console.log("x: " + x + "\nxCoord: " + xCoord + "\ny: " + y + "\nyCoord: " + yCoord);

        if (yCoord < dicts[index][xData] && ygitCoord > 0) {
            //console.log('inside');
            document.getElementById(infoID[index]).innerHTML = calibAreaInfo(index);
            document.getElementById(infoID[index]).style.opacity = "1";
        }
        else {
            //console.log('outside');
            document.getElementById(infoID[index]).style.opacity = "0";
        }
    }
}

// creates the area labels
function calibAreaInfo(peakNum) {
    text = '';
    text += 'Calibration Graph ' + (peakNum+1) + ' Area = ' + calibrationArea[selectedcmpd][peakNum];
    return text;
}

// the function that checks which compound is selected
selectCmpd(JSON.parse(localStorage.getItem('select')));
function selectCmpd(num) {
    selectedcmpd = num;
    var calibrationPath1 = calibBasePath + calibrationFilePaths[num] + "_1.csv";
    var calibrationPath2 = calibBasePath + calibrationFilePaths[num] + "_2.csv";
    var calibrationPath3 = calibBasePath + calibrationFilePaths[num] + "_3.csv";
    var calibrationPath4 = calibBasePath + calibrationFilePaths[num] + "_4.csv";
    var calibrationDownloadPath = calibBasePath + calibrationFilePaths[num] + ".png";
    var calibrationDownloadName = calibraitonDownloadNames[num] + "_Calibration_Graphs";
    var calibrationTitleText = calibraitonDownloadNames[num] + " Calibration Graphs";
    first = calibrationPath1;
    second = calibrationPath2;
    third = calibrationPath3;
    forth = calibrationPath4;

    document.getElementById("calibrationDownload").style.opacity = 1;
    document.getElementById("calibrationDownload").href = calibrationDownloadPath;
    document.getElementById("calibrationDownload").download = calibrationDownloadName;
    document.getElementById("calibrationTitle").innerText = calibrationTitleText;

    chartCalib();
    chartOverlay();
}

/**************************************************************************************/
// OVERLAY

//below are for calibration-overlay.html
async function chartOverlay() {

    //the path to the solvent ratio with the best separation
    var chromPathOverlay = caseBasePath + caseNames[caseNum] + '/' + chromNames[3];

    //get the calib data for the calibration graph with the talleest peak
    await getCalibData(forth, dict4, x4, y4);

    //get the data for the solvent ratio with the best separation
    await getChromData(chromPathOverlay);

    //determine if solvent ratio data or the calibraiton data has the highest maxY value
    maxY = getCalibMaxY();
    if (getMaxY() > getCalibMaxY()) {
        maxY = getMaxY();
    }

    //make the chart
    const ctx = document.getElementById('chromOverlay').getContext('2d');
    var overlayChart = new Chart(ctx, {
        type: 'line',
        data: {
            // change this to make it draw a data set instead of just y value
            labels: realTimeX,
            datasets: [{
                label: 'Best Separation',
                data: realTimeY,
                backgroundColor:
                    'rgba(163, 216, 108, .5)',
            },
            {
                label: 'Calibration',
                data: y4,
                backgroundColor:
                    'rgba(9, 96, 115, .5)',
            },
            ]
        },
        options: {
            responsive: false,
            scales: {
                xAxes: [{
                    ticks: {
                        max: 10,
                        min: 0,
                        maxTicksLimit: 21,
                        beginAtZero: true
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
                        stepSize: 1000,
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Signal (arb. units)'
                    }
                }],
            },
        },
        tooltips: {
            callbacks: {
                title: function (tooltipItem, data) {
                    var title = "Retention Time (min): " + realTimeX[tooltipItem[0].index];
                    return title;
                },
                label: function (tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';
                    if (label) {
                        label += ': ';
                    }
                    label += Math.round(tooltipItem.yLabel * 100) / 100;
                    return label;
                }
            }
        }
    });

    //chart is done so show the button
    document.getElementById('try-again').style.opacity = 1;
}