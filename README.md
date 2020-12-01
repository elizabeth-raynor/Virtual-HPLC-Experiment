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
Our clients, CHEM230L professors Patrick Martino and Douglas Collins, would like a virtual drug doping experiemnt for their students. The objective of the experiment is to use high-perfomace liquid chromatography (HPLC) to determine if a ficitonal athlete has used illicit drugs. 

The experiment involves students choosing various solvent ratios to run HPLC trials for and then obtaining the resulting chromtograms. The old lab has students wait until a timer runs out and then the professors hand them paper data; however, this method is not very interactive and engaging. Our solution is a web applicaiton that lets students see the chromatograms being drawn in real-time, similar to if they were using a realy HPLC column. Students can then interact with the chromtograms to obtain more information such as the area of peaks, the xy values of each data point, and the corresponding mass spectra of each peak. Additionally, students are able to run claibraiton trials for various compounds and see the chromatograms drawn in real-time. Lastly, students can compare the calirbation data with the sample data by overalying the graphs. This feature makes the analysis easier and more accurate. 

The primary features are:
* 4 different cases (representing different smaples) can be run
* Up to 5 solvent ratios can be tested for each case
* The chromatograms for each solvent ratio are drawn in real-time
* The area of the peaks is shown when they are hovered over
* The xy values of each data point is shown when they are hovered over
* The mass spectra of each peak is shown when the peaks of the chromatogram with the best separation are clicked on
* The calibration chromatograms are drawn in real-time
* The calibration and best separation chromatrograms can be analyzed with an overlay of the graphs

## Infromation for Running the Application
Students can access the official application that is hosted on the Bucknell server using this [Bucknell link](https://www.projects.bucknell.edu/drugdopinglab/). During devlopement, the application was hosted on GitHub and can be accessed using this [GitHub link](https://jw4590.github.io/Virtual-Chem-Lab/src/) .

