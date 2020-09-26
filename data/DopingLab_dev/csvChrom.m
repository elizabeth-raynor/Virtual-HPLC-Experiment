function csvChrom(x,chrom,filename)
% writes a csv file with the arrays x and chrom
% Elizabeth Raynor, Sept 2020

x = x';
chrom = chrom';
A = [x, chrom];

writematrix(A, filename);