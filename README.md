# Virtual Drug Doping Lab
Bucknell University
Lewisburg, PA
 
## Course Information
Course Title: CSCI 479  
Instructor: Xiannong Meng  
Semester: Fall 2020  
 
## Student Information
Bill Chen, Elizabeth Raynor, and Jenny Wu
 
## Project Background
Our clients, CHEM230L professors Patrick Martino and Douglas Collins, would like a virtual drug doping experiment for their students. The objective of the experiment is to use high-performance liquid chromatography (HPLC) to determine if a fictional athlete has used illicit drugs. 
 
The experiment involves students choosing various solvent ratios to run HPLC trials for and then obtaining the resulting chromatograms. The old lab has students wait until a timer runs out and then the professors hand them paper data; however, this method is not very interactive and engaging. Our solution is a web application that lets students see the chromatograms being drawn in real-time, similar to if they were using a really HPLC column. Students can then interact with the chromatograms to obtain more information such as the area of peaks, the xy values of each data point, and the corresponding mass spectra of each peak. Additionally, students are able to run calibration trials for various compounds and see the chromatograms drawn in real-time. Lastly, students can compare the calibration data with the sample data by overlaying the graphs. This feature makes the analysis easier and more accurate. 
 
The primary features are:
* 4 different cases (representing different samples) can be run
* Up to 5 solvent ratios can be tested for each case
* The chromatograms for each solvent ratio are drawn in real-time
* The area of the peaks is shown when they are hovered over
* The xy values of each data point is shown when they are hovered over
* The mass spectra of each peak are shown when the peaks of the chromatogram with the best separation are clicked on
* The calibration chromatograms are drawn in real-time
* The calibration and best separation chromatograms can be analyzed with an overlay of the graphs
 
## Information for Running the Application
Students can access the official application that is hosted on the Bucknell server using this [Bucknell link](https://www.projects.bucknell.edu/drugdopinglab/). During development, the application was hosted on GitHub and can be accessed using this [GitHub link](https://jw4590.github.io/Virtual-Chem-Lab/). A video demonstration of the web application can be accessed using this [demo link](https://youtu.be/nEJ-aItOBUA).

## Code Documentation


## <span style="text-decoration:underline;">folders</span>

data/DopingLab_dev: This folder contains CSV files that are used as the data sources for all the graphs on the website (the solvent ratio real-time graphs, calibration real-time graphs, and the MS graphs); PNG of the graphs used for downloading; and MATLAB files used to generate the CSV files

images: This folder contains images of the solvent bottles and HPLC column used by add-solvent.html

src: This folder contains all the HTML, CSS, and JavaScript files for the website.

doc: This folder contains all the PDF documents listed on the documents page.


## <span style="text-decoration:underline;">the data/DopingLab_dev folder</span>

This folder has 4 sub folders that the web application retrieves data from: Calibrations, Case1, Case2, Case3, and Case4. It also contains MATLAB files to make the data.


### <span style="text-decoration:underline;">the Calibrations folder</span>

This folder has one PNG and 4 CSV files per compound. The PNG is what is downloaded when the download button on the calibration-real-time.html is clicked. The 4 CSV files provide the data for one of each of the graphs on the calibration-real-time.html. Note: the CSV files are written by the MATLAB code


### <span style="text-decoration:underline;">the Case# folders</span>

Each case folder contains all the data and images related to that case (the CSV (written by the MATLAB code) and PNG for each solvent ratio combination; the CSV and PNG for the MS of each peak; and the PNG for the calibration of each peak). Note: the CSV files for the MS data are not written by MATLAB code.


### <span style="text-decoration:underline;">the MATLAB files</span>

makeCalib.m



*   Added an array of filenames to each compound so the data can be saved in a CSV
*   Changed all to plotChrom() to include the filename from the array of filenames

makeChrom.m



*   Changed call to plotChrom() to include a string of the filename

plotChrom.m



*   Changed function plotChrom() call to include parameter filename
*   Add some lines of code to write a CSV file of the chromatogram data


## <span style="text-decoration:underline;">the images folder</span>

Contains the following images:



*   BlueBottle.png: the big blue bottle with the label CH3CN
*   BlueBottleOld.pgn: the big blue bottle without a solvent label
*   Column.png: the HPLC column
*   GreenBottle.png: the little green bottle on top of the column with the label H2O
*   GreenBottleOld.png: the little green bottle on top of the column without a solvent label


## <span style="text-decoration:underline;">the src folder</span>


### <span style="text-decoration:underline;">instruction folder</span>:



*   <span style="text-decoration:underline;">instruc.css</span>: contains the styling for the instruc.html file
*   <span style="text-decoration:underline;">instruc.html</span>: shows the instructions for the web application
*   <span style="text-decoration:underline;">pic#.png</span>: the images used in the instruc.html file


### index.html: 

This file is the first page the user sees and is where the user selects the case they are going to run


### add-solvent.html: 

This file is the second page the user sees. It is where the user selects what solvent ratio they want to run a trial for.


### hover-real-time.html:

This file is the third page the user sees. It shows the real-time graph of the solvent ratio previously selected.


### select-best-separation.html: 

This file is the fourth page the user sees. It is where the user selects the trail with the best separation.


### Best-separation.html:

This file is the fifth page the user sees. It is where the user can click on peaks to see the mass spectra.


### mass-spectra.html: 

This file is the sixth page the user sees. It shows the mass spectra of the peak previously selected.


### calibration-selection.html: 

This file is the seventh page the user sees. It is where the user can select which compound they want to run a calibration trial for.


### calibration-real-time.html: 

This file is the eighth page the user sees. It shows the real-time calibration graph of the compound previously selected.


### calibration-overlay.html: 

This file is the ninth and final page the user sees. It is where the user can see the calibration graph and the best separation graph overlaid.


### doc.html: 

This file is the page the user is brought to any time they click on Documents in the header of any page. It has links to all supplemental documentation the user may need, as well as the instruc.html page. 


### index.css:

This file contains all the styling for the above .html files


### app.js: 

This file contains all the code that provides functionality to the above .html files


## the doc folder

This folder has the PDF files linked on the doc.html page


## The app.js file


### <span style="text-decoration:underline;">The structure:</span>

Each section is split up by a line of //

The sections are:



*   VARIABLES
*   ADD SOLVENT
*   SOLVENT RATIO REAL-TIME
*   SELECT BEST
*   BEST SEPARATION
*   MASS SPECTRA
*   CALIBRATION REAL-TIME
*   OVERLAY


### <span style="text-decoration:underline;">VARIABLES</span>

This section contains paths and file names. Blue variables are ones that contain data that can be changed.


#### Variables:



*   ratioNum: the current ratio selection listed 0-5
*   caseNum: the current case selection list 0-2
*   runStatus: array of boolean values that state if a ratioNum has been run. The order is ratioNum 0-5
*   caseBasePath: string of the base path to the folder that has all the Case folders
*   calibBasePath: string of the base path to the folder that has all the Calibration data
*   caseName: array of strings of the Case# folder names
*   chromNames: array of strings of the CSV file names for each solvent ratio in a Case
*   chromPics: array of strings of the PNG file names for each solvent ratio in a Case
*   MSNames: array of strings of the CSV file names for each peak of the best separation chromatogram 
*   MSPics: array of strings of the PNG file names for each peak of the best separation chromatogram 


### <span style="text-decoration:underline;">ADD SOLVENT</span>

This section contains the code to give functionality to the add-solvent.html page. Blue variables are ones that contain data that can be changed.


#### Variables:



*   percentsB: array of strings for the possible percents of the blue bottle. The order is ratioNum 0-5
*   percentsA: array of the strings for the possible percents of the green bottle. The order is ratioNum 0-5
*   solventA: string of the solvent in the green bottle
*   solventB: string of the solvent in the blue bottle


#### Methods:



*   changePercent(direction): where _direction_ is either 1 or -1. Changes the ratioNum and displayed percent values according to the direction. If the ratio has been run, the color of the displayed percent values get greyed out. Is called every time the up/down arrows are clicked.
*   statusCheck(): checks if the current ratioNum has been run and if it has greys out the displayed percent values. Is called on the loading of the add-solvent.html page
*   getPerc(): displays the percent values according to the current ratioNum. Is called on the loading of the add-solvent.html page.
*   ratioReset(): resets the runStatus to all false. Is called when...


### <span style="text-decoration:underline;">SOLVENT RATIO REAL-TIME</span>

This section contains code to make the real-time graphs on hover-real-time.html. Blue variables and methods are ones that contain data that can be changed.


#### Variables:



*   realTimeX: array to store the x values of the solvent real-time graph
*   realTimeY: array to store the y values of the solvent real-time graph
*   realTimeDict: a dictionary to allow access to the xy value pairs
*   maxY: the maximum y value in the data set. Used to set the y-axis of the graph
*   columnInfo: a string that is appended to the title of the graph to show the column information
*   areas: nested array of peak area values. The order is [[Case1Peak1, Case1Peak2, Case1Peak3], [Case2Peak1, Case2Peak2, Case2Peak3]...]
*   solventRatioSleep: the value used to delay the addition of data to the graph so it is in real-time. The larger the number, the bigger delay. 170 makes the graph take 10 minutes on Jenny’s computer


#### Methods:



*   runChroms(): changes the runStatus of the current ratio to true because the graph is being made. Gets the path to the appropriate Case and ratioNum CSV data. Pass that path into chartChrom(path)
*   chartChrom(path): waits for getChromData(path) to get the data, then makes the title of the graph and the chart without data, then calls sleep and addData to add the data, and when the graph is done, displays the buttons
*   getChromData(path): reads and parses the CSV files, stores the data in realTimeX, realTimeY, and realTimeDict
*   getMaxY(): finds maxY value in realTimeY
*   addData(chart, label, data): adds data to the chart
*   sleep(ms): delays adding the data so it is in real-time
*   getCursorPosition(event, ctx, canvas): converts cursor position in pixel values to the corresponding x and y values of the chart data and returns the xy coordinates
*   areaInfo(): makes strings that have the area information for the current chromatogram. Each solvent ratio in each Case has a unique area label.


### <span style="text-decoration:underline;">SELECT BEST</span>

This section gives functionality to the select-best.html page


#### Methods:



*   selectOption(): Adds the option based on the user's run trial(s).
*   submitChoice(): When clicking the submit button, it will check for the submitted value.


### <span style="text-decoration:underline;">BEST SEPARATION</span>

This section makes the graph of the best separation. 


#### Methods:



*   chartBest():  sets bestChromPath and waits for getChromData(bestChromPath) to get the data, then makes the title of the graph and the chart with data, then calls enableMSClick(ctx) since this is the best separation


### <span style="text-decoration:underline;">MASS SPECTRA</span>

This section makes the mass spectra graphs. Blue variables are ones that contain data that can be changed.


#### Variables:



*   xValsMS: array to store the x values of the MS data
*   yValsMS: array to store the y values of the MS data
*   ranges: nested arrays that contain the x values that define the start and end of each peak of the best separation for each Case. The order is [[[Case1Peak1Startx, Case1Peak1Endx], [Case1Peak2Startx, Case1Peak2Endx], [Case1Peak3Startx, Case1Peak3Endx]]...]


#### Methods:



*   enableMSClick(ctx): where _ctx_ is the chart. When the user clicks on the graph, calls getCursorPosition(elements, ctx, canvas) which returns the xy coordinates of the cursor. If the cursor is under a peak, the path to the appropriate MS graph  is set.
*   runMS(): calls chartMS(MSPath) and sets up the Download button
*   getMSData(path): reads and parses the CSV files, and stores the data in xValsMS and yValsMS
*   chartMS(path): waits for getMSData(path) to get the data, then makes the title of the graph and the chart with data


### <span style="text-decoration:underline;">CALIBRATION REAL-TIME</span>

This section contains code to make the real-time graphs on calibration-real-time.html. Blue variables and methods are ones that contain data that can be changed.


#### Variables:



*   Paths:
    *   first: string of the path to the file that contains the data for the first graph
    *   second: string of the path to the file that contains the data for the second graph
    *   third: string of the path to the file that contains the data for the third graph on this page 
    *   forth: string of the path to the file that contains the data for the fourth graph on this page 
*   Arrays that stores data
    *   x1: array to store the data for the x values in the first graph 
    *   y1: array to store the data for the y values in the first graph 
    *   x2: array to store the data for the x values in the second graph 
    *   y2: array to store the data for the y values in the second grap
    *   x3: array to store the data for the x values in the third graph 
    *   y3: array to store the data for the y values in the third grap
    *   x4: array to store the data for the x values in the fourth graph 
    *   y4: array to store the data for the y values in the fourth graph
*   Dictionaries that stores xy value pairs
    *   dict1: dictionary that stores xy value pairs of the first graph
    *   dict2: dictionary that stores xy value pairs of the second graph
    *   dict3: dictionary that stores xy value pairs of the third graph
    *   dict4: dictionary that stores xy value pairs of the fourth graph
*   selectedcmpd: a number that represents the compound selected by the user in the previous page(calibration-selection.html). The default value of this variable is -1, meaning that no compound is selected. 
*   calibrationArea: nested array of peak area values. The order is [[Compound1Graph1, Compound1Graph2, Compound1Graph3, Compound1Graph4], [Compound2Graph1, Compound2Graph2, Compound2Graph3, Compound2Graph4]...]
*   calibrationFilePaths: file names for the calibration compounds used to build the strings of the paths, so has to exactly match the actual file names. 
*   calibraitonDownloadNames: names of the images appear when they are downloaded, so can be different from the actual file names, for example, spaces can be added.
*   calibrationSleep: value of the time(ms) to delay adding the data to the graph to make it close to real-time. Currently, we have 2000 data to be added to the graph in 10 minutes, so adding each data should take 300ms. However, the CPU needs time to process for each process of adding data, so in reality, this value should be set to less than 300. According to the test we did, setting this variable to 265 makes it take exactly 10 min on Jenny's laptop computer.
*   calibrationChromTitles: array that stores the titles of the chromatograms.
*   calibratioChromColors: array that stores the rgba colors of the calibration chromatograms.
*   chartID: array that stores the id of each chart, used to refer to the charts. 
*   infoID: array that stores the id of the information displayed when hovering on each chart. 


#### Methods:



*   getCalibData(path, dict, x, y): reads and parses the CSV files, stores the data in x1, x2, x3, x4, y1, y2, y3, y4 and dict1, dict2, dict3, dict4 variables.
*   getCalibMaxY(): finds maxY value in y4, since y4 always has the highest peak.
*   chartCalib(): waits for getCalibData(path, dict, x, y) to get the data, makes the title of the graphs and the charts without data with makeCalibCharts, then calls sleep and addCalibData to add the data to each chart, and when the graph is done, displays the download button and the next button.
*   addCalibData(chart, label, data): adds the x and y data to the specific chart.
*   makeCalibCharts(ctx, index): makes a chart with title and color but no data.
*   getCursorPositionCalib(event, index): converts cursor position in pixel values to the corresponding x and y values of the chart data and returns the xy coordinates.
*   calibAreaInfo(peakNum): makes strings that have the area information for the current chromatogram. Each chart in each compound has a unique area label.
*   selectCmpd(num): checks the value of the selectCmpd variable, which is stored in the localStorage. Sets the corresponding paths, titles.


### <span style="text-decoration:underline;">OVERLAY</span>


#### Variables:



*   chromPathOverlay: the path to the solvent ratio with the best separation.


#### Methods:



*   chartOverlay(): waits for getCalibData(path, dict, x, y) and getChromData(path) to get the data for the calibration chart and the chromatogram for the best separation, makes the chart with both datasets, then displays the try-again button.



