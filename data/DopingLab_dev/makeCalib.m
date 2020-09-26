%% makeCalib.m
% @DB Collins, March 2019

% make calibration chromatograms for each compound in makeChrom.m

%% caffeine
rt = 0.99;
wid = 0.13;
quant = [3684 12718 46383 118860];
mPhaseFac = 55;

h = figure(1);
h.Position = [200,200,550,750];
for j = 1:length(quant)
    subplot(4,1,j)
    plotChrom(rt,wid,quant(j),mPhaseFac,1,'Calibrations/Caffeine.csv')
    ylim([0 7000])
    xticks(0:0.5:10)
    tx = sprintf('Peak Area = %d',quant(j));
    title(tx)
    ax = gca;
    ax.XMinorTick = 'on';
    grid on
end
saveas(h,'Calibrations/Caffeine.png')

%% acetaminophen
rt = 1.3;
wid = 0.13;
quant = [7370 23804 86891 150534];
mPhaseFac = 95;

h = figure(2);
h.Position = [200,200,550,750];
for j = 1:length(quant)
    subplot(4,1,j)
    plotChrom(rt,wid,quant(j),mPhaseFac,1,'Calibrations/Acetaminophen.csv')
    ylim([0 5000])
    xticks(0:0.5:10)
    tx = sprintf('Peak Area = %d',quant(j));
    title(tx)
    ax = gca;
    ax.XMinorTick = 'on';
    grid on
end
saveas(h,'Calibrations/Acetaminophen.png')

%% pseudoephedrine
rt = 1.4;
wid = 0.13;
quant = [9597 23319 91002 227054];
mPhaseFac = 120;

h = figure(3);
h.Position = [200,200,550,750];
for j = 1:length(quant)
    subplot(4,1,j)
    plotChrom(rt,wid,quant(j),mPhaseFac,1,'Calibrations/Pseudoephedrine.csv')
    ylim([0 6000])
    xticks(0:0.5:10)
    tx = sprintf('Peak Area = %d',quant(j));
    title(tx)
    ax = gca;
    ax.XMinorTick = 'on';
    grid on
end
saveas(h,'Calibrations/Pseudoephedrine.png')

%% ephedrine
rt = 1.4;
wid = 0.25;
quant = [6574 23554 89508 233279];
mPhaseFac = 110;

h = figure(4);
h.Position = [200,200,550,750];
for j = 1:length(quant)
    subplot(4,1,j)
    plotChrom(rt,wid,quant(j),mPhaseFac,1,'Calibrations/Ephedrine.csv')
    ylim([0 4000])
    xticks(0:0.5:10)
    tx = sprintf('Peak Area = %d',quant(j));
    title(tx)
    ax = gca;
    ax.XMinorTick = 'on';
    grid on
end
saveas(h,'Calibrations/Ephedrine.png')

%% amphetamine (Adderall)
%Cases 2 and 3
rt = 1.502;
wid = 0.25;
quant = [1072 18291 39363 55005];
mPhaseFac = 175;

h = figure(5);
h.Position = [200,200,550,750];
for j = 1:length(quant)
    subplot(4,1,j)
    plotChrom(rt,wid,quant(j),mPhaseFac,1,'Calibrations/Amphetamine_Case123.csv')
    ylim([0 1000])
    xticks(0:0.5:10)
    tx = sprintf('Peak Area = %d',quant(j));
    title(tx)
    ax = gca;
    ax.XMinorTick = 'on';
    grid on
end
saveas(h,'Calibrations/Amphetamine_Case123.png')

%Case 4
mPhaseFac = 55;

h = figure(6);
h.Position = [200,200,550,750];
for j = 1:length(quant)
    subplot(4,1,j)
    plotChrom(rt,wid,quant(j),mPhaseFac,1,'Calibrations/Amphetamine_Case4.csv')
    ylim([0 2000])
    xticks(0:0.5:10)
    tx = sprintf('Peak Area = %d',quant(j));
    title(tx)
    ax = gca;
    ax.XMinorTick = 'on';
    grid on
end
saveas(h,'Calibrations/Amphetamine_Case4.png')

%% methamphetamine
rt = 1.6;
wid = 0.23;
quant = [2090 17676 41710 57836];
mPhaseFac = 80;

h = figure(7);
h.Position = [200,200,550,750];
for j = 1:length(quant)
    subplot(4,1,j)
    plotChrom(rt,wid,quant(j),mPhaseFac,1,'Calibrations/Methamphetamine.csv')
    ylim([0 1500])
    xticks(0:0.5:10)
    tx = sprintf('Peak Area = %d',quant(j));
    title(tx)
    ax = gca;
    ax.XMinorTick = 'on';
    grid on
end
saveas(h,'Calibrations/Methamphetamine.png')

%% ethacrynic acid methyl ester (Edecrin)
rt = 1.82;
wid = 0.23;
quant = [13598 69753 127019 452253];
mPhaseFac = 175;

h = figure(8);
h.Position = [200,200,550,750];
for j = 1:length(quant)
    subplot(4,1,j)
    plotChrom(rt,wid,quant(j),mPhaseFac,1,'Calibrations/EthacrynicAcidMethylEster.csv')
    ylim([0 5000])
    xticks(0:0.5:10)
    tx = sprintf('Peak Area = %d',quant(j));
    title(tx)
    ax = gca;
    ax.XMinorTick = 'on';
    grid on
end
saveas(h,'Calibrations/EthacrynicAcidMethylEster.png')

%% DUMMY COMPOUNDS

%% methylphenidate

rt = 1.72;
wid = 0.23;
quant = [13598 69753 127019 452253];
mPhaseFac = 150;

h = figure(9);
h.Position = [200,200,550,750];
for j = 1:length(quant)
    subplot(4,1,j)
    plotChrom(rt,wid,quant(j),mPhaseFac,1,'Calibrations/Methylphenidate.csv')
    ylim([0 6000])
    xticks(0:0.5:10)
    tx = sprintf('Peak Area = %d',quant(j));
    title(tx)
    ax = gca;
    ax.XMinorTick = 'on';
    grid on
end
saveas(h,'Calibrations/Methylphenidate.png')

%% THC

rt = 2.0;
wid = 0.23;
quant = [13598 69753 127019 452253];
mPhaseFac = 170;

h = figure(10);
h.Position = [200,200,550,750];
for j = 1:length(quant)
    subplot(4,1,j)
    plotChrom(rt,wid,quant(j),mPhaseFac,1,'Calibrations/THC.csv')
    ylim([0 6000])
    xticks(0:0.5:10)
    tx = sprintf('Peak Area = %d',quant(j));
    title(tx)
    ax = gca;
    ax.XMinorTick = 'on';
    grid on
end
saveas(h,'Calibrations/THC.png')

%% chlorothiazide

rt = 1;
wid = 0.23;
quant = [3684 12718 46383 118860];
mPhaseFac = 60;

h = figure(11);
h.Position = [200,200,550,750];
for j = 1:length(quant)
    subplot(4,1,j)
    plotChrom(rt,wid,quant(j),mPhaseFac,1,'Calibrations/Chlorothiazide.csv')
    ylim([0 4000])
    xticks(0:0.5:10)
    tx = sprintf('Peak Area = %d',quant(j));
    title(tx)
    ax = gca;
    ax.XMinorTick = 'on';
    grid on
end
saveas(h,'Calibrations/Chlorothiazide.png')

%% phenylephrine

rt = 1.05;
wid = 0.13;
quant = [9597 23319 91002 227054];
mPhaseFac = 70;

h = figure(12);
h.Position = [200,200,550,750];
for j = 1:length(quant)
    subplot(4,1,j)
    plotChrom(rt,wid,quant(j),mPhaseFac,1,'Calibrations/Phenylephrine.csv')
    ylim([0 10000])
    xticks(0:0.5:10)
    tx = sprintf('Peak Area = %d',quant(j));
    title(tx)
    ax = gca;
    ax.XMinorTick = 'on';
    grid on
end
saveas(h,'Calibrations/Phenylephrine.png')

%% ibuprofen

rt = 1.7;
wid = 0.13;
quant = [9597 23319 91002 227054];
mPhaseFac = 180;

h = figure(13);
h.Position = [200,200,550,750];
for j = 1:length(quant)
    subplot(4,1,j)
    plotChrom(rt,wid,quant(j),mPhaseFac,1,'Calibrations/Ibuprofen.csv')
    ylim([0 4000])
    xticks(0:0.5:10)
    tx = sprintf('Peak Area = %d',quant(j));
    title(tx)
    ax = gca;
    ax.XMinorTick = 'on';
    grid on
end
saveas(h,'Calibrations/Ibuprofen.png')

%% acetylsalicylic acid

rt = 1.27;
wid = 0.13;
quant = [9597 23319 91002 227054];
mPhaseFac = 70;

h = figure(14);
h.Position = [200,200,550,750];
for j = 1:length(quant)
    subplot(4,1,j)
    plotChrom(rt,wid,quant(j),mPhaseFac,1,'Calibrations/AcetylsalicylicAcid.csv')
    ylim([0 10000])
    xticks(0:0.5:10)
    tx = sprintf('Peak Area = %d',quant(j));
    title(tx)
    ax = gca;
    ax.XMinorTick = 'on';
    grid on
end
saveas(h,'Calibrations/AcetylsalicylicAcid.png')

