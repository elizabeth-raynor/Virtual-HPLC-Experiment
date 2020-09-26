function [h,ax] = plotMS(data,title)
%plotMS plots a mass spectrum from 2 column data
% Ref MS data come from the NIST Library via Agilent software
%   INPUTS
%   data : a 2 column matrix with m/z in Col 1, Sig in Col 2
%   title : a string to be placed in the figure header
%   OUTPUTS
%   h : the figure handle
%   ax : the axis handle

% organize the data
mz = data(:,1);
sig = data(:,2);
normsig = sig / 9999; %normalize to tallest peak (9999)

[bigint,bigmz] = maxk(normsig,10);

% make the figure
h = figure('Name',title);
h.Position = [500,500,900,400];
bar(mz,normsig)
ylim([0 1.05])
xticks(0:10:400)
ax = gca;
ax.XMinorTick = 'on';
ylabel('Relative abundance')
xlabel('Mass-to-Charge Ratio (m/z)')
grid on

for j = 1:length(bigmz)
    tx = sprintf('%d',mz(bigmz(j)));
    text(mz(bigmz(j))-3,bigint(j)+0.02,tx)
end

end

