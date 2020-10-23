%% makeChrom.m
% @DB Collins, March 2019

%% build peaks in order of increasing retention on column
% use relative retention times that can be multiplied for MP changes
% all separations are isocratic, binary, on C18 column
% MP changes get more polar with increasing MP factor

%% CASE #1
rt = [];
wid = [];
%caffeine
rt(1) = 0.99;
wid(1) = 0.13;
quant(1) = 86674;
%acetaminophen
rt(2) = 1.3;
wid(2) = 0.13;
quant(2) = 99256;
%pseudoephedrine
rt(3) = 1.4;
wid(3) = 0.13;
quant(3) = 110955;

% ****plot****
% clf
% figure(1)
% subplot(5,1,1)
% plotChrom(rt,wid,quant,[30,25,25],1)
% title('CASE 1')
% subplot(5,1,2)
% plotChrom(rt,wid,quant,[40,40,40],2)
% subplot(5,1,3)
% plotChrom(rt,wid,quant,[45,70,85],3)
% subplot(5,1,4)
% plotChrom(rt,wid,quant,[55,95,170],4)
% subplot(5,1,5)
% plotChrom(rt,wid,quant,[75,155,300],5)

h1 = figure('Name','Case 1: 100% A, 0% B)');
h1.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[30,25,25],1,'Case1/Chrom1.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h1,'Case1/Chrom1.png')

h2 = figure('Name','Case 1: 85% A, 15% B)');
h2.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[40,40,40],2,'Case1/Chrom2.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h2,'Case1/Chrom2.png')

txt = 'Case 1: 70% A, 25% B)';
h3 = figure('Name',txt);
h3.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[45,70,80],3,'Case1/Chrom3.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h3,'Case1/Chrom3.png')

h4 = figure('Name','Case 1: 55% A, 45% B)');
h4.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[55,95,120],4,'Case1/Chrom4.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h4,'Case1/Chrom4.png')

h5 = figure('Name','Case 1: 30% A, 70% B)');
h5.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[75,155,300],5,'Case1/Chrom5.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h5,'Case1/Chrom5.png')

%% CASE #2
rt = [];
wid = [];
%caffeine
rt(1) = 0.99;
wid(1) = 0.13;
quant(1) = 21250;
%ephedrine
rt(2) = 1.4;
wid(2) = 0.25;
quant(2) = 141568;
%amphetamine (Adderall)
rt(3) = 1.502;
wid(3) = 0.2;
quant(3) = 6225;

%plot
% figure(2)
% subplot(5,1,1)
% plotChrom(rt,wid,quant,[30,25,25],1)
% title('CASE 2')
% subplot(5,1,2)
% plotChrom(rt,wid,quant,[40,40,40],2)
% subplot(5,1,3)
% plotChrom(rt,wid,quant,[45,80,95],3)
% subplot(5,1,4)
% plotChrom(rt,wid,quant,[55,110,175],4)
% subplot(5,1,5)
% plotChrom(rt,wid,quant,[75,160,250],5)

h1 = figure('Name','Case 1: 100% A, 0% B)');
h1.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[30,25,25],1,'Case2/Chrom1.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h1,'Case2/Chrom1.png')

h2 = figure('Name','Case 1: 85% A, 15% B)');
h2.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[40,40,40],2,'Case2/Chrom2.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h2,'Case2/Chrom2.png')

txt = 'Case 1: 70% A, 25% B)';
h3 = figure('Name',txt);
h3.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[45,80,95],3,'Case2/Chrom3.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h3,'Case2/Chrom3.png')

h4 = figure('Name','Case 1: 55% A, 45% B)');
h4.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[55,110,175],4,'Case2/Chrom4.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h4,'Case2/Chrom4.png')

h5 = figure('Name','Case 1: 30% A, 70% B)');
h5.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[75,160,270],5,'Case2/Chrom5.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h5,'Case2/Chrom5.png')

%% CASE #3
rt = [];
wid = [];
%caffeine
rt(1) = 0.99;
wid(1) = 0.13;
quant(1) = 15203;
%acetaminophen
rt(2) = 1.3;
wid(2) = 0.25;
quant(2) = 42560;
%amphetamine (Adderall)
rt(3) = 1.502;
wid(3) = 0.25;
quant(3) = 10525;

%plot
% figure(3)
% subplot(5,1,1)
% plotChrom(rt,wid,quant,[30,25,25],1)
% title('CASE 3')
% subplot(5,1,2)
% plotChrom(rt,wid,quant,[40,40,40],2)
% subplot(5,1,3)
% plotChrom(rt,wid,quant,[45,50,95],3)
% subplot(5,1,4)
% plotChrom(rt,wid,quant,[55,80,175],4)
% subplot(5,1,5)
% plotChrom(rt,wid,quant,[75,160,250],5)

h1 = figure('Name','Case 1: 100% A, 0% B)');
h1.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[30,25,25],1,'Case3/Chrom1.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h1,'Case3/Chrom1.png')

h2 = figure('Name','Case 1: 85% A, 15% B)');
h2.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[40,40,40],2,'Case3/Chrom2.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h2,'Case3/Chrom2.png')

txt = 'Case 1: 75% A, 25% B)';
h3 = figure('Name',txt);
h3.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[45,50,95],3,'Case3/Chrom3.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h3,'Case3/Chrom3.png')

h4 = figure('Name','Case 1: 55% A, 45% B)');
h4.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[55,95,175],4,'Case3/Chrom4.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h4,'Case3/Chrom4.png')

h5 = figure('Name','Case 1: 30% A, 70% B)');
h5.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[75,160,280],5,'Case3/Chrom5.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h5,'Case3/Chrom5.png')

%% CASE #4
rt = [];
wid = [];
%amphetamine
rt(1) = 1.502;
wid(1) = 0.20;
quant(1) = 2256;
%methamphetamine
rt(2) = 1.6;
wid(2) = 0.20;
quant(2) = 9536;
%ethacrynic acid methyl ester
rt(3) = 1.82;
wid(3) = 0.25;
quant(3) = 25638;

%plot
% figure(4)
% subplot(5,1,1)
% plotChrom(rt,wid,quant,[30,25,25],1)
% title('CASE 4')
% subplot(5,1,2)
% plotChrom(rt,wid,quant,[40,40,40],2)
% subplot(5,1,3)
% plotChrom(rt,wid,quant,[45,60,95],3)
% subplot(5,1,4)
% plotChrom(rt,wid,quant,[55,100,175],4)
% subplot(5,1,5)
% plotChrom(rt,wid,quant,[75,160,250],5)

h1 = figure('Name','Case 1: 80% A, 20% B)');
h1.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[30,25,25],1,'Case4/Chrom1.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h1,'Case4/Chrom1.png')

h2 = figure('Name','Case 1: 70% A, 30% B)');
h2.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[40,40,40],2,'Case4/Chrom2.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h2,'Case4/Chrom2.png')

txt = 'Case 1: 50% A, 50% B)';
h3 = figure('Name',txt);
h3.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[45,50,95],3,'Case4/Chrom3.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h3,'Case4/Chrom3.png')

h4 = figure('Name','Case 1: 30% A, 70% B)');
h4.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[55,80,175],4,'Case4/Chrom4.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h4,'Case4/Chrom4.png')

h5 = figure('Name','Case 1: 5% A, 95% B)');
h5.Position = [500,500,900,300];
plotChrom(rt,wid,quant,[75,160,250],5,'Case4/Chrom5.csv')
xticks(0:0.5:10)
ax = gca;
ax.XMinorTick = 'on';
saveas(h5,'Case4/Chrom5.png')