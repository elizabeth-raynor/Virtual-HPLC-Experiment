function [x,y] = makeGauss(mu,sd)
%UNTITLED6 Summary of this function goes here
%   Detailed explanation goes here
x = linspace(-4*sd,4*sd,1000);
y = 1/(2*pi*sd)*exp(-(x-mu).^2/(2*sd^2));
plot(x,y);

end

