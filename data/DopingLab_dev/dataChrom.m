function [x, chrom] = dataChrom(rt,wid,quant,mPhaseFac,fignum)
%PLOTCHROM.M plots a chromatogram given info about compounds
%   rt is an array of retention times
%   wid is an array (same size as rt) of peak widths
%   quant is an array (same size as rt) of peak area factors
%   mPhaseFac is an array of factors that increase with retention due to
%   changing MP composition
%   fignum is the number to assign to the output figure
%   @Elizabeth Raynor, Sept 2020

% mPhaseFac = 50;
num = fignum; % not used anymore
rtfac = 2.25 .* mPhaseFac;
widfac = 1.01 .* mPhaseFac;
x = 0:0.5:1000;
A = NaN(length(x),length(rt));
for j = 1:length(rt)
    A(:,j) = quant(j) * normpdf(x,rtfac(j)*rt(j),widfac(j)*wid(j));
end
chrom = sum(A,2);

sat = 1e4;
for j = 1:length(chrom)
    if chrom(j) > sat
        chrom(j) = sat;
    end
end

x = x/100;