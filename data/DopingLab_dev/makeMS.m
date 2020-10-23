%% makeMS.m
% make mass spectra from ref data

load MSrefdata.mat
% MS ref data are 2 column matrices, m/z in col 1, sig in col 2

%% make MS spectra

[ms1,ax] = plotMS(caffeine,'Caffeine');
saveas(ms1,'Case1/Peak1_MS.png')
saveas(ms1,'Case2/Peak1_MS.png')
saveas(ms1,'Case3/Peak1_MS.png')

[ms2,ax] = plotMS(acetaminophen,'Acetaminophen');
saveas(ms2,'Case1/Peak2_MS.png')
saveas(ms2,'Case3/Peak2_MS.png')

[ms3,ax] = plotMS(amphetamine,'Amphetamine');
saveas(ms3,'Case2/Peak3_MS.png')
saveas(ms3,'Case3/Peak3_MS.png')
saveas(ms3,'Case4/Peak1_MS.png')

[ms4,ax] = plotMS(ephed_pseudephed,'Ephedrine');
saveas(ms4,'Case1/Peak3_MS.png') %pseudoephedrine
saveas(ms4,'Case2/Peak2_MS.png') %ephedrine

[ms5,ax] = plotMS(ethacrynic_acid_methyl,'Ethacrynic Acid ME');
saveas(ms5,'Case4/Peak3_MS.png')

[ms6,ax] = plotMS(methamphetamine,'Methamphetamine');
saveas(ms6,'Case4/Peak2_MS.png')
