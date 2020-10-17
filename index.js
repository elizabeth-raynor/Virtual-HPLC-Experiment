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

    var first = "https://raw.githubusercontent.com/jw4590/Virtual-Chem-Lab/data/data/DopingLab_dev/Calibrations/Caffeine1.csv";
    var second = "https://raw.githubusercontent.com/jw4590/Virtual-Chem-Lab/data/data/DopingLab_dev/Calibrations/Caffeine2.csv";
    var third = "https://raw.githubusercontent.com/jw4590/Virtual-Chem-Lab/data/data/DopingLab_dev/Calibrations/Caffeine3.csv";
    var forth = "https://raw.githubusercontent.com/jw4590/Virtual-Chem-Lab/data/data/DopingLab_dev/Calibrations/Caffeine4.csv";
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

    const ctx4in1 = document.getElementById('chrom').getContext('2d');
    var Chart4in1 = new Chart(ctx4in1, {
        type: 'line',
        data: {
            // change this to make it draw a data set instead of just y value
            labels: [],
            datasets: [{
                label: 'caffeine 1',
                data: [],
                backgroundColor: 
                'rgba(163, 216, 108, 1)',
            },
            {
                label: 'caffeine 2',
                data: [],
                backgroundColor: 
                'rgba(86, 191, 132, 1)',
            },
            {
                label: 'caffeine 3',
                data: [],
                backgroundColor: 
                'rgba(8, 166, 150, 1)',
            },
            {
                label: 'caffeine 4',
                data: [],
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
                    maxTicksLimit: maxY/1000,
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
            hover: {
                // Overrides the global setting
                enabled: true,
                //mode: 'dataset',
                onHover: function(elements) {
                    getCursorPosition4in1(elements);
                }
            }   
        }
    });
    var i;
    for(i=0; i < x1.length; i++){
        await sleep(x1[i]*0.1);
        addData4in1(Chart4in1,x1[i],y1[i],y2[i],y3[i],y4[i]);
    }
    hoverMode = true;  
}

function addData4in1(chart, label, data1,data2,data3,data4) {
    chart.data.labels.push(label);
    //chart.data.datasets.forEach((dataset) => {
    //    dataset.data.push(data);
    //});
    chart.data.datasets[0].data.push(data1);
    chart.data.datasets[1].data.push(data2);
    chart.data.datasets[2].data.push(data3);
    chart.data.datasets[3].data.push(data4);
    chart.update();
}

/*
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
*/

function getCursorPosition4in1(event) { 
    if(hoverMode){
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

    //ctx.save();
    if (yCoord < dict1[xData] && yCoord > 0){
        document.getElementById("Hover-Info").innerHTML= areaInfo4in1(1);
        document.getElementById("Hover-Info").style.opacity="1";
    }
    else if(yCoord < dict2[xData] && yCoord > dict1[xData]){
        document.getElementById("Hover-Info").innerHTML= areaInfo4in1(2);
        document.getElementById("Hover-Info").style.opacity="1";
    }
    else if(yCoord < dict3[xData] && yCoord > dict2[xData]){
        document.getElementById("Hover-Info").innerHTML= areaInfo4in1(3);
        document.getElementById("Hover-Info").style.opacity="1";
    }
    else if(yCoord < dict4[xData] && yCoord > dict3[xData]){
        document.getElementById("Hover-Info").innerHTML= areaInfo4in1(4);
        document.getElementById("Hover-Info").style.opacity="1";
    }
    else {
        //console.log("outside");
        document.getElementById("Hover-Info").style.opacity="0";
    }
}
} 
const compounds = 0;//currently Caffeine is 0
const area4in1 = [[3684,12718,46383,118860]];

function areaInfo4in1(peakNum) {
    text = '';
    text += 'Peak '+ peakNum + ' Area = ' + area4in1[compounds][peakNum-1];
    return text;
}

chart4in1();