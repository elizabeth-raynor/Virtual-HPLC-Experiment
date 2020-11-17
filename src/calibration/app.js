// Global constant for case
const caseNum = "Case1";

// Global constants for solvent ratios
const percentsB = ["0%", "15%", "25%", "45%", "70%"];
const percentsA = ["100%", "85%", "75%", "55%", "30%"];
var runStatus = [false, false, false, false, false];
const areas = [[86674,99256,110955], [21250,141568, 6225], [15203,42560,10525], [2256, 9536, 25638]];
var ratioNum = 0;
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
// Real-time Graph -- uncomment when running real-time-final.html, comment out when not

//chartChrom('../../data/DopingLab_dev/Case1/Chrom1.csv');
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
        console.log('inside');
        //ctx.font = "30px Arial";
        //ctx.fillText('Area', 600,35);
        document.getElementById("Hover-Info").innerHTML= areaInfo();
        document.getElementById("Hover-Info").style.opacity="1";
    }
    else {
        console.log("outside");
        document.getElementById("Hover-Info").style.opacity="0";
    }
} 

function areaInfo() {
    text = '';
    switch (ratioNum) {
        case 0:
            text += 'Peak 1 Area = ' + Math.sum.apply(areas[ratioNum]);
            break;
        case 1:
            text += 'Peak 1 Area = ' + areas[ratioNum][0] + '<br>Peak 2 Area = ' + areas[ratioNum][1]+areas[ratioNum][2];
            break;
        case 2:
            text += 'Peak 1 Area = ' + areas[ratioNum][0] + ' <br>Peak 2 Area = ' + areas[ratioNum][1] + '<br>Peak 3 Area = ' + areas[ratioNum][3];
            break;
        case 3:
            text += 'Peak 1 Area = ' + areas[ratioNum][0] + '<br>Peak 2 Area = ' + areas[ratioNum][1] + '<br>Peak 3 Area = ' + areas[ratioNum][3];
            break;
        case 4:
            text += 'Peak 1 Area = ' + areas[ratioNum][0] + '<br>Peak 2 Area = ' + areas[ratioNum][1] + '<br>Peak 3 Area = ' + areas[ratioNum][3]-2000;
            break;
    }
    return text;
}






/****************************************************************************/
// calibration 4 in 1 graphs -- uncomment when running calibration-real-time.html, comment out when not

    var first;
    var second;
    var third;
    var forth;
    const x1 = [];
    const y1 = [];
    const x2 = [];
    const y2 = [];
    const x3 = [];
    const y3 = [];
    const x4 = [];
    const y4 = [];

    var dict1 = {};
    var dict2 = {};
    var dict3 = {};
    var dict4 = {};


/*
async function getData(fileSource,x,y){
    const response = await fetch(fileSource);
    const data = await response.text();
    console.log(data);

    const rows = data.split('\n');
    console.log(rows);
    rows.forEach(elt => {
        const row = elt.split(',');
        const time = parseFloat(row[0]);
        x.push(time);
        const signal = parseFloat(row[1]);
        y.push(signal);
        console.log(time,signal);
    });
}
*/
async function getChromData4in1(path,dict,x,y){
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

function getMaxY4in1() {
    realTimeYNum = [];
    y4.forEach(number => {
        realTimeYNum.push(Number(number));
    });
    var max = Math.max.apply(Math, realTimeYNum);
    var roundedMax = Math.ceil(max/1000)*1000;
    return roundedMax; 
}

async function chart4in1(){
    hoverMode = false;
    await getChromData4in1(first,dict1,x1,y1);
    await getChromData4in1(second,dict2,x2,y2);
    await getChromData4in1(third,dict3,x3,y3);
    await getChromData4in1(forth,dict4,x4,y4);
    maxY = getMaxY4in1();
    //console.log(maxY);

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
                display:false,
            },
            ]},
        options: {
            responsive: false,
            scales: {
                xAxes: [{
                    ticks: {
                    max: 10,
                    min: 0,
                    maxTicksLimit: 21,
                    beginAtZero:true
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
                    stepSize:1000,
                    beginAtZero:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Signal (arb. units)'
                    }
                }],
            },
            title: {
                display: true,
                text: 'Calibration Graph 1',},
            legend: {
                display: false},
                //onClick:function (elements) {
                //    console.log(elements);}
                //onClick: getCursorPosition,
            hover: {
                // Overrides the global setting
                enabled: true,
                //mode: 'dataset',
                onHover: function(elements) {
                    getCursorPosition1(elements);
                }
            }   
        }
    });

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
                display:false,
            },
            ]},
        options: {
            responsive: false,
            scales: {
                xAxes: [{
                    ticks: {
                    max: 10,
                    min: 0,
                    maxTicksLimit: 21,
                    beginAtZero:true
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
                    stepSize:1000,
                    beginAtZero:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Signal (arb. units)'
                    }
                }],
            },
            title: {
                display: true,
                text: 'Calibration Graph 2',},
            legend: {
                display: false},
                //onClick:function (elements) {
                //    console.log(elements);}
                //onClick: getCursorPosition,
            hover: {
                // Overrides the global setting
                enabled: true,
                //mode: 'dataset',
                onHover: function(elements) {
                    getCursorPosition2(elements);
                }
            }   
        }
    });

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
                display:false,
            },
            ]},
        options: {
            responsive: false,
            scales: {
                xAxes: [{
                    ticks: {
                    max: 10,
                    min: 0,
                    maxTicksLimit: 21,
                    beginAtZero:true
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
                    stepSize:1000,
                    beginAtZero:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Signal (arb. units)'
                    }
                }],
            },
            title: {
                display: true,
                text: 'Calibration Graph 3',},
                legend: {
                    display: false},
                //onClick:function (elements) {
                //    console.log(elements);}
                //onClick: getCursorPosition,
            hover: {
                // Overrides the global setting
                enabled: true,
                //mode: 'dataset',
                onHover: function(elements) {
                    getCursorPosition3(elements);
                }
            }   
        }
    });

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
                display:false,
            },
            ]},
        options: {
            responsive: false,
            scales: {
                xAxes: [{
                    ticks: {
                    max: 10,
                    min: 0,
                    maxTicksLimit: 21,
                    beginAtZero:true
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
                    stepSize:1000,
                    beginAtZero:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Signal (arb. units)',
                    }
                }],
            },
            title: {
                display: true,
                text: 'Calibration Graph 4',},
                legend: {
                    display: false},
                //onClick:function (elements) {
                //    console.log(elements);}
                //onClick: getCursorPosition,
            hover: {
                // Overrides the global setting
                enabled: true,
                //mode: 'dataset',
                onHover: function(elements) {
                    getCursorPosition4(elements);
                }
            }   
        }
    });
    var i;
    for(i=0; i < x1.length; i++){
        await sleep(170);
        addData4in1(Chart1,x1[i],y1[i]);
        addData4in1(Chart2,x1[i],y2[i]);
        addData4in1(Chart3,x1[i],y3[i]);
        addData4in1(Chart4,x1[i],y4[i]);
    }
    hoverMode = true;  
    document.getElementById("next").style.opacity=1;
}

function addData4in1(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data);
    chart.update();
}

/*
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
*/

function getCursorPosition1(event) { 
    if(hoverMode){
    const canvas = document.getElementById('chrom1');
    let rect = canvas.getBoundingClientRect(); 
    let x = event.clientX - rect.left; 
    let y = event.clientY - rect.top; 
    
    //Convert x on cavas to x value in the data set
    var xCoord = ((x-57)/(795-57))*10

    var xData = (Math.ceil(xCoord*200)/200).toFixed(2)
    
    // Convert y on canvas to y value on the graph
    var yCoord = (((132-y))/(132))*maxY;
    //console.log("x: " + x + "\nxCoord: " + xCoord + "\ny: " + y + "\nyCoord: " + yCoord);

    //ctx.save();
    if (yCoord < dict1[xData] && yCoord > 0){
        document.getElementById("Info1").innerHTML= areaInfo4in1(1);
        document.getElementById("Info1").style.opacity="1";
    }
    else {
        //console.log("outside");
        document.getElementById("Info1").style.opacity="0";
    }
}
} 

function getCursorPosition2(event) { 
    if(hoverMode){
    const canvas = document.getElementById('chrom2');
    let rect = canvas.getBoundingClientRect(); 
    let x = event.clientX - rect.left; 
    let y = event.clientY - rect.top; 
    
    //Convert x on cavas to x value in the data set
    var xCoord = ((x-57)/(795-57))*10

    var xData = (Math.ceil(xCoord*200)/200).toFixed(2)
    
    // Convert y on canvas to y value on the graph
    var yCoord = (((132-y))/(132))*maxY;
    //console.log("x: " + x + "\nxCoord: " + xCoord + "\ny: " + y + "\nyCoord: " + yCoord);

    //ctx.save();
    if(yCoord < dict2[xData] && yCoord > 0){
        document.getElementById("Info2").innerHTML= areaInfo4in1(2);
        document.getElementById("Info2").style.opacity="1";
    }
    else {
        //console.log("outside");
        document.getElementById("Info2").style.opacity="0";
    }
}
} 

function getCursorPosition3(event) { 
    if(hoverMode){
    const canvas = document.getElementById('chrom3');
    let rect = canvas.getBoundingClientRect(); 
    let x = event.clientX - rect.left; 
    let y = event.clientY - rect.top; 
    
    //Convert x on cavas to x value in the data set
    var xCoord = ((x-57)/(795-57))*10

    var xData = (Math.ceil(xCoord*200)/200).toFixed(2)
    
    // Convert y on canvas to y value on the graph
    var yCoord = (((132-y))/(132))*maxY;
    //console.log("x: " + x + "\nxCoord: " + xCoord + "\ny: " + y + "\nyCoord: " + yCoord);

    //ctx.save();
    
    if(yCoord < dict3[xData] && yCoord > 0){
        document.getElementById("Info3").innerHTML= areaInfo4in1(3);
        document.getElementById("Info3").style.opacity="1";
    }
    
    else {
        //console.log("outside");
        document.getElementById("Info3").style.opacity="0";
    }
}
} 

function getCursorPosition4(event) { 
    if(hoverMode){
    const canvas = document.getElementById('chrom4');
    let rect = canvas.getBoundingClientRect(); 
    let x = event.clientX - rect.left; 
    let y = event.clientY - rect.top; 
    
    //Convert x on cavas to x value in the data set
    var xCoord = ((x-57)/(795-57))*10

    var xData = (Math.ceil(xCoord*200)/200).toFixed(2)
    
    // Convert y on canvas to y value on the graph
    var yCoord = (((132-y))/(132))*maxY;
    //console.log("x: " + x + "\nxCoord: " + xCoord + "\ny: " + y + "\nyCoord: " + yCoord);

    //ctx.save();
    
    if(yCoord < dict4[xData] && yCoord > 0){
        document.getElementById("Info4").innerHTML= areaInfo4in1(4);
        document.getElementById("Info4").style.opacity="1";
    }
    else {
        //console.log("outside");
        document.getElementById("Info4").style.opacity="0";
    }
}
}


// things below sets data for different compound choices
// the selected compound from calibration select page
var selectedcmpd = -1;
const area4in1 = [[7370,23804,86891,150534],[9597,23319,91002,227054],[1072,18291,39363,55005],[1072,18291,39363,55005],[3684,12718,46383,118860],[3684,12718,46383,118860],[6574,23554,89508,233279],[13598,69753,127019,452253],[9597,23319,91002,227054],[2090,17676,41710,57836],[13598,69753,127019,452253],[9597,23319,91002,227054],[9597,23319,91002,227054],[13598,69753,127019,452253]];
const calibrationFilePaths = [["Acetaminophen"],["AcetylsalicylicAcid"],["Amphetamine_Case4"],["Amphetamine_Case123"],["Caffeine"],["Chlorothiazide"],["Ephedrine"],["EthacrynicAcidMethylEster"],["Ibuprofen"],["Methamphetamine"],["Methylphenidate"],["Phenylephrine"],["Pseudoephedrine"],["THC"]];
const downloadNames = [["Acetaminophen"],["Acetylsalicylic Acid"],["Amphetamine Case4"],["Amphetamine Case123"],["Caffeine"],["Chlorothiazide"],["Ephedrine"],["Ethacrynic Acid MethylEster"],["Ibuprofen"],["Methamphetamine"],["Methylphenidate"],["Phenylephrine"],["Pseudoephedrine"],["THC"]]

// displays the area count when hover
function areaInfo4in1(peakNum) {
    text = '';
    text += 'Peak '+ peakNum + ' Area = ' + area4in1[selectedcmpd][peakNum-1];
    return text;
}

// the function that checks which compound is selected

if(localStorage.getItem('select') == 0){
    selectCmpd(0);
}
else if(localStorage.getItem('select') == 1){
    //console.log("entered");
    selectCmpd(1);
    }
else if(localStorage.getItem('select') == 2){
    //console.log("entered");
    selectCmpd(2);
    }
else if(localStorage.getItem('select') == 3){
//console.log("entered");
selectCmpd(3);
}
else if(localStorage.getItem('select') == 4){
//console.log("entered");
selectCmpd(4);
}
else if(localStorage.getItem('select') == 5){
//console.log("entered");
selectCmpd(5);
}
else if(localStorage.getItem('select') == 6){
//console.log("entered");
selectCmpd(6);
}
else if(localStorage.getItem('select') == 7){
//console.log("entered");
selectCmpd(7);
}
else if(localStorage.getItem('select') == 8){
//console.log("entered");
selectCmpd(8);
}
else if(localStorage.getItem('select') == 9){
    //console.log("entered");
selectCmpd(9);
}
else if(localStorage.getItem('select') == 10){
//console.log("entered");
selectCmpd(10);
}
else if(localStorage.getItem('select') == 11){
//console.log("entered");
selectCmpd(11);
}
else if(localStorage.getItem('select') == 12){
//console.log("entered");
selectCmpd(12);
}
else if(localStorage.getItem('select') == 13){
//console.log("entered");
selectCmpd(13);
}
else if(localStorage.getItem('select') == 14){
//console.log("entered");
selectCmpd(14);
}
else{
//console.log(localStorage.getItem('select'));
}

function selectCmpd(num){
    selectedcmpd = num;
    var calibrationPath1 = "../../data/DopingLab_dev/Calibrations/"+calibrationFilePaths[num]+"_1.csv";
    var calibrationPath2 = "../../data/DopingLab_dev/Calibrations/"+calibrationFilePaths[num]+"_2.csv";
    var calibrationPath3 = "../../data/DopingLab_dev/Calibrations/"+calibrationFilePaths[num]+"_3.csv";
    var calibrationPath4 = "../../data/DopingLab_dev/Calibrations/"+calibrationFilePaths[num]+"_4.csv";
    var calibrationDownloadPath =  "../../data/DopingLab_dev/Calibrations/" + calibrationFilePaths[num] +".png";
    var calibrationDownloadName = downloadNames[num]+"_Calibration_Graphs";
    var calibrationTitleText = downloadNames[num]+" Calibration Graphs";
    first = calibrationPath1;
    second = calibrationPath2;
    third = calibrationPath3;
    forth = calibrationPath4;
    
    document.getElementById("calibrationDownload").href=calibrationDownloadPath;
    document.getElementById("calibrationDownload").download=calibrationDownloadName;
    document.getElementById("calibrationTitle").innerText=calibrationTitleText;

    chart4in1();
    chartOverlay();
}

//below are for calibration-overlay.html
async function chartOverlay(){
    var chromPathOverlay = '../../data/DopingLab_dev/';
    chromPathOverlay += caseNum + '/' + chromNames[3];
    //console.log(chromPath);
    await getChromData4in1(forth,dict4,x4,y4);
    await getChromData(chromPathOverlay);
    maxY = getMaxY4in1();
    //console.log(maxY);
    if(getMaxY()>getMaxY4in1()){
        maxY = getMaxY();
    }
    
    const ctx = document.getElementById('chromOverlay').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                // change this to make it draw a data set instead of just y value
                labels: realTimeX,
                datasets: [{
                    label: 'solvent',
                    data: realTimeY,
                    backgroundColor: 
                  'rgba(163, 216, 108, 1)',
                },
                {
                    label: 'calibration',
                    data: y4,
                    backgroundColor: 
                  'rgba(9, 96, 115, 1)',
                },
                ]},
            options: {
                responsive: false,
                scales: {
                    xAxes: [{
                        ticks: {
                        max: 10,
                        min: 0,
                        maxTicksLimit: 21,
                        beginAtZero:true
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
                        stepSize:1000,
                        beginAtZero:true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Signal (arb. units)'
                        }
                    }],
                },
                    //onClick:function (elements) {
                    //    console.log(elements);}
                    //onClick: getCursorPosition,
                    /*
                hover: {
                    // Overrides the global setting
                    enabled: true,
                    //mode: 'dataset',
                    onHover: function(elements) {
                        getCursorPosition(elements);
                    }
                }   
                */
            }
        });
        document.getElementById("finish").style.opacity=1;
}
