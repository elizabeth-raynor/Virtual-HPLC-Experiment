function plotChrom(rt,wid,quant,mPhaseFac,fignum, filename)
%PLOTCHROM.M plots a chromatogram given info about compounds
%   rt is an array of retention times
%   wid is an array (same size as rt) of peak widths
%   quant is an array (same size as rt) of peak area factors
%   mPhaseFac is an array of factors that increase with retention due to
%   changing MP composition
%   fignum is the number to assign to the output figure
%   @DB Collins, March 2019

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
% figure(fignum)
plot(x,chrom,'-k','linewidth',2)
hold on
% plot(x,A,'-r')
% plot(x,B,'-b')
% plot(x,C,'-g')
hold off
xlabel('Retention Time (min)')
ylabel('Signal (arb. units)')
xlim([0 10])
xticks(0:0.5:10)
% ylim([0 sat+100])

%% make CSV- Elizabeth Raynor
x1 = x';
chrom1 = chrom;
T = table(x1, chrom1, 'VariableNames', ["Retention Time (min)", "Signal (arb. units)"]);
writetable(T, filename) %MATLAB built-in function since 2019a version
end

