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
var realTimeDict = {};
const realTimeX = [];
const realTimeY = [];
var hoverMode = false;
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
    runStatus[ratioNum] = true;
    sessionStorage["runStatus"] = JSON.stringify(runStatus);
    var chromPath = caseBasePath + caseNames[caseNum] + '/' + chromNames[ratioNum];
    chartChrom(chromPath);
}

//show the buttons after graph is done.
function showButtons() {
    document.getElementById("trybut").style.display = "inline-block";
    document.getElementById("next").style.display = "inline-block";
    // console.log("buttons have been summoned but why not showing?");
}

//show the selection page
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
            //console.log(caseStartPath + caseNames[caseNum] + '/' + chromPics[i]);
            //console.log(graphTitleID);
            document.getElementById(graphID).src = caseBasePath + caseNames[caseNum] + '/' + chromPics[i];
            document.getElementById(graphTitleID).innerHTML = percentsA[i] + solventA + ', ' + percentsB[i] + solventB;
            graphNum++;
        }
    }

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

    //make the chart
    ctx = document.getElementById('chrom').getContext('2d');
    canvas = document.getElementById('chrom');

    //the chart
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
                    const coords = getCursorPosition(elements, ctx, canvas);
                    const yCoord = coords[0];
                    const xData = coords[1];
                    //console.log('xCoord:' + xData, 'yCoord: ' + yCoord);
                    if (yCoord > 0 && yCoord < realTimeDict[xData]) {
                        document.getElementById("hover-info").innerHTML = areaInfo();
                        document.getElementById("hover-info").style.opacity = "1";
                    }
                    else {
                        document.getElementById("hover-info").style.opacity = "0";
                    }
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
    const response = await fetch(path);
    var data = await response.text();
    data = data.trim();

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
    realTimeYNum = [];
    realTimeY.forEach(number => {
        realTimeYNum.push(Number(number));
    });
    var max = Math.max.apply(Math, realTimeYNum);
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
function getCursorPosition(event, ctx, canvas) {
    // source: https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element

    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    //Convert x on cavas to x value in the data set
    var xCoord = ((x - 57) / (795 - 57)) * 10

    var xData = (Math.ceil(xCoord * 200) / 200).toFixed(2)

    // Convert y on canvas to y value on the graph
    var yCoord = (((331 - y)) / (331)) * maxY;
    //console.log("x: " + x + "\nxCoord: " + xCoord + "\ny: " + y + "\nyCoord: " + yCoord);

    return [yCoord, xData];
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
function submitChoice() {
    var content = document.getElementById("selectRatio").value;
    var choice = content.match(/\d+/g);
    console.log('choice: ' + choice);
    if (choice != "55,2,45,3" && choice != "30,2,70,3") {
        alert("This one (" + content + ") will not work. Peaks may not be fully separated. Please select another ratio!");
    } 
    else if (choice == "30,2,70,3") {
        alert("This one (" + content + ") will not work. Peaks may be cut off at the end. Please select another ratio!")
    }
    else {
        window.location.href = "best-separation.html";
    }
}

/**************************************************************************************/
// BEST SEPARATION

async function chartBest() {

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
                    const coords = getCursorPosition(elements, ctx, canvas);
                    const yCoord = coords[0];
                    const xData = coords[1];
                    if (yCoord > 0 && yCoord < realTimeDict[xData]) {
                        document.getElementById("hover-info").innerHTML = areaInfo();
                        document.getElementById("hover-info").style.opacity = "1";
                    }
                    else {
                        document.getElementById("hover-info").style.opacity = "0";
                    }
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
    enableMSClick(ctx);
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

//enable the click function to see the MS graphs
function enableMSClick(ctx) {
    ratioNum = sessionStorage['ratioNum'];
    const canvas = document.getElementById('bestChrom');

    canvas.onclick = function (elements) {
        if (ratioNum == 3) {
            const coords = getCursorPosition(elements, ctx, canvas);
            const yCoord = coords[0];
            const xData = coords[1];
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

//initiate the making of the MS chart
function runMS() {
    var MSPath = sessionStorage.getItem("path-to-MS");

    chartMS(MSPath);

    var MSDownloadPath = caseBasePath + caseNames[caseNum] + '/' + MSPics[peakNum];
    var MSDownloadName = caseNames[caseNum] + '_' + MSPics[peakNum];

    document.getElementById("MSDownload").href = MSDownloadPath;
    document.getElementById("MSDownload").download = MSDownloadName;
}

//read and the CSV that has the MS data, and store the data in array
//source: https://www.youtube.com/watch?v=RfMkdvN-23o 
async function getMSData(path) {
    // reads csv file and trims is
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
const calibrationFilePaths = [["Acetaminophen"], ["AcetylsalicylicAcid"], ["Amphetamine_Case4"], ["Amphetamine_Case123"], ["Caffeine"], ["Chlorothiazide"], ["Ephedrine"], ["EthacrynicAcidMethylEster"], ["Ibuprofen"], ["Methamphetamine"], ["Methylphenidate"], ["Phenylephrine"], ["Pseudoephedrine"], ["THC"]];
//names of the images when they are downloaded
const calibraitonDownloadNames = [["Acetaminophen"], ["Acetylsalicylic Acid"], ["Amphetamine Case4"], ["Amphetamine Case123"], ["Caffeine"], ["Chlorothiazide"], ["Ephedrine"], ["Ethacrynic Acid MethylEster"], ["Ibuprofen"], ["Methamphetamine"], ["Methylphenidate"], ["Phenylephrine"], ["Pseudoephedrine"], ["THC"]]
//value to delay adding the data to the graph
const calibrationSleep = 0; //265 makes it take 10 min on Jenny's computer
//calibraiton chromatogram titles
const calibrationChromTitles = ['Calibration conditions 1', 'Calibration conditions 2', 'Calibration conditions 3', 'Calibration conditions 4'];

//read and parse the CSVs, store the data in arrays and a dictionary
async function getChromData4in1(path, dict, x, y) {
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
function getMaxY4in1() {
    realTimeYNum = [];
    y4.forEach(number => {
        realTimeYNum.push(Number(number));
    });
    var max = Math.max.apply(Math, realTimeYNum);
    var roundedMax = Math.ceil(max /100) * 100;
    return roundedMax;
}

//create the charts
async function chart4in1() {
    hoverMode = false;
    await getChromData4in1(first, dict1, x1, y1);
    await getChromData4in1(second, dict2, x2, y2);
    await getChromData4in1(third, dict3, x3, y3);
    await getChromData4in1(forth, dict4, x4, y4);
    maxY = getMaxY4in1();

    //first calibraiton graph
    const ctx1 = document.getElementById('chrom1').getContext('2d');
    var Chart1 = new Chart(ctx1, {
        type: 'line',
        data: {
            // change this to make it draw a data set instead of just y value
            labels: [],
            datasets: [{
                label: 'Calibration Graph 1',
                data: [],
                backgroundColor:
                    'rgba(163, 216, 108, 1)',
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
                text: calibrationChromTitles[0],
            },
            legend: {
                display: false
            },
            hover: {
                // Overrides the global setting
                enabled: true,
                //mode: 'dataset',
                onHover: function (elements) {
                    getCursorPosition1(elements);
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

    //second calibraiton graph
    const ctx2 = document.getElementById('chrom2').getContext('2d');
    var Chart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            // change this to make it draw a data set instead of just y value
            labels: [],
            datasets: [
                {
                    label: 'Calibration Graph 2',
                    data: [],
                    backgroundColor:
                        'rgba(86, 191, 132, 1)',
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
                text: calibrationChromTitles[1],
            },
            legend: {
                display: false
            },
            hover: {
                // Overrides the global setting
                enabled: true,
                //mode: 'dataset',
                onHover: function (elements) {
                    getCursorPosition2(elements);
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

    //third calibraiton graph
    const ctx3 = document.getElementById('chrom3').getContext('2d');
    var Chart3 = new Chart(ctx3, {
        type: 'line',
        data: {
            // change this to make it draw a data set instead of just y value
            labels: [],
            datasets: [
                {
                    label: 'Calibration Graph 3',
                    data: [],
                    backgroundColor:
                        'rgba(8, 166, 150, 1)',
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
                text: calibrationChromTitles[2],
            },
            legend: {
                display: false
            },
            hover: {
                // Overrides the global setting
                enabled: true,
                //mode: 'dataset',
                onHover: function (elements) {
                    getCursorPosition3(elements);
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

    //fouth calibration graph
    const ctx4 = document.getElementById('chrom4').getContext('2d');
    var Chart4 = new Chart(ctx4, {
        type: 'line',
        data: {
            // change this to make it draw a data set instead of just y value
            labels: [],
            datasets: [
                {
                    label: 'Calibration Graph 4',
                    data: [],
                    backgroundColor:
                        'rgba(9, 96, 115, 1)',
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
                        labelString: 'Signal (arb. units)',
                    }
                }],
            },
            title: {
                display: true,
                text: calibrationChromTitles[3],
            },
            legend: {
                display: false
            },
            hover: {
                // Overrides the global setting
                enabled: true,
                //mode: 'dataset',
                onHover: function (elements) {
                    getCursorPosition4(elements);
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

    //add the data to the graph in real time
    var i;
    for (i = 0; i < x1.length; i++) {
        await sleep(calibrationSleep); // 265 makes it take 10 min on Jenny's computer
        addData4in1(Chart1, x1[i], y1[i]);
        addData4in1(Chart2, x1[i], y2[i]);
        addData4in1(Chart3, x1[i], y3[i]);
        addData4in1(Chart4, x1[i], y4[i]);
    }

    //graph is done, so show Download and Next buttons
    hoverMode = true;
    document.getElementById("next").style.opacity = 1;
    document.getElementById('calibratioDownload').style.opacity = 1;
}

//add the data to the charts
function addData4in1(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data);
    chart.update();
}

//get the cursor position for the first chart
function getCursorPosition1(event) {
    if (hoverMode) {
        const canvas = document.getElementById('chrom1');
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        //Convert x on cavas to x value in the data set
        var xCoord = ((x - 57) / (795 - 57)) * 10

        var xData = (Math.ceil(xCoord * 200) / 200).toFixed(2)

        // Convert y on canvas to y value on the graph
        var yCoord = (((132 - y)) / (132)) * maxY;
        //console.log("x: " + x + "\nxCoord: " + xCoord + "\ny: " + y + "\nyCoord: " + yCoord);

        if (yCoord < dict1[xData] && yCoord > 0) {
            document.getElementById("Info1").innerHTML = areaInfo4in1(1);
            document.getElementById("Info1").style.opacity = "1";
        }
        else {
            document.getElementById("Info1").style.opacity = "0";
        }
    }
}

//get the cursor position for the second chart
function getCursorPosition2(event) {
    if (hoverMode) {
        const canvas = document.getElementById('chrom2');
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        //Convert x on cavas to x value in the data set
        var xCoord = ((x - 57) / (795 - 57)) * 10

        var xData = (Math.ceil(xCoord * 200) / 200).toFixed(2)

        // Convert y on canvas to y value on the graph
        var yCoord = (((132 - y)) / (132)) * maxY;
        //console.log("x: " + x + "\nxCoord: " + xCoord + "\ny: " + y + "\nyCoord: " + yCoord);

        if (yCoord < dict2[xData] && yCoord > 0) {
            document.getElementById("Info2").innerHTML = areaInfo4in1(2);
            document.getElementById("Info2").style.opacity = "1";
        }
        else {
            document.getElementById("Info2").style.opacity = "0";
        }
    }
}

//get the cursor position for the third chart
function getCursorPosition3(event) {
    if (hoverMode) {
        const canvas = document.getElementById('chrom3');
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        //Convert x on cavas to x value in the data set
        var xCoord = ((x - 57) / (795 - 57)) * 10

        var xData = (Math.ceil(xCoord * 200) / 200).toFixed(2)

        // Convert y on canvas to y value on the graph
        var yCoord = (((132 - y)) / (132)) * maxY;
        //console.log("x: " + x + "\nxCoord: " + xCoord + "\ny: " + y + "\nyCoord: " + yCoord);

        if (yCoord < dict3[xData] && yCoord > 0) {
            document.getElementById("Info3").innerHTML = areaInfo4in1(3);
            document.getElementById("Info3").style.opacity = "1";
        }

        else {
            document.getElementById("Info3").style.opacity = "0";
        }
    }
}

//get hte cursor positon for the forth chart
function getCursorPosition4(event) {
    if (hoverMode) {
        const canvas = document.getElementById('chrom4');
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        //Convert x on cavas to x value in the data set
        var xCoord = ((x - 57) / (795 - 57)) * 10

        var xData = (Math.ceil(xCoord * 200) / 200).toFixed(2)

        // Convert y on canvas to y value on the graph
        var yCoord = (((132 - y)) / (132)) * maxY;
        //console.log("x: " + x + "\nxCoord: " + xCoord + "\ny: " + y + "\nyCoord: " + yCoord);

        if (yCoord < dict4[xData] && yCoord > 0) {
            document.getElementById("Info4").innerHTML = areaInfo4in1(4);
            document.getElementById("Info4").style.opacity = "1";
        }
        else {
            document.getElementById("Info4").style.opacity = "0";
        }
    }
}

// displays the area count when hover
function areaInfo4in1(peakNum) {
    text = '';
    text += 'Peak ' + peakNum + ' Area = ' + calibrationArea[selectedcmpd][peakNum - 1];
    return text;
}

// the function that checks which compound is selected
selectCmpd(JSON.parse(localStorage.getItem('select')));
function selectCmpd(num) {
    selectedcmpd = num;
    var calibrationPath1 = "../data/DopingLab_dev/Calibrations/" + calibrationFilePaths[num] + "_1.csv";
    var calibrationPath2 = "../data/DopingLab_dev/Calibrations/" + calibrationFilePaths[num] + "_2.csv";
    var calibrationPath3 = "../data/DopingLab_dev/Calibrations/" + calibrationFilePaths[num] + "_3.csv";
    var calibrationPath4 = "../data/DopingLab_dev/Calibrations/" + calibrationFilePaths[num] + "_4.csv";
    var calibrationDownloadPath = "../data/DopingLab_dev/Calibrations/" + calibrationFilePaths[num] + ".png";
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

    chart4in1();
    chartOverlay();
}

/**************************************************************************************/
// OVERALY

//below are for calibration-overlay.html
async function chartOverlay() {
    var chromPathOverlay = '../data/DopingLab_dev/';
    chromPathOverlay += caseNames[caseNum] + '/' + chromNames[3];
    //console.log(chromPath);
    await getChromData4in1(forth, dict4, x4, y4);
    await getChromData(chromPathOverlay);
    maxY = getMaxY4in1();
    //console.log(maxY);
    if (getMaxY() > getMaxY4in1()) {
        maxY = getMaxY();
    }

    const ctx = document.getElementById('chromOverlay').getContext('2d');
    var myChart = new Chart(ctx, {
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
    document.getElementById("finish").style.opacity = 1;
    document.getElementById('try-again').style.opacity = 1;
}