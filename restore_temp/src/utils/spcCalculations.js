// spcCalculations.js
// Statistical Process Control (X & R charts) formulas based on user's PDF

// Constants for subgroup size n=5
const CONSTANTS = {
  A2: 0.577,
  D3: 0,
  D4: 2.114,
  d2: 2.326
};

export const calculateSPC = (readings, ltl = 20.012, utl = 20.022) => {
  if (!readings || readings.length < 5) {
    return null; // Not enough data to form even one subgroup
  }

  const n = 5; // Subgroup size
  const subgroups = [];
  
  // Group readings into subgroups of size 5
  for (let i = 0; i < readings.length; i += n) {
    const chunk = readings.slice(i, i + n);
    if (chunk.length === n) {
      subgroups.push(chunk);
    }
  }

  if (subgroups.length === 0) return null;

  // Calculate Ranges and X_bars for each subgroup
  const subgroupRanges = [];
  const subgroupAverages = [];

  subgroups.forEach(group => {
    const max = Math.max(...group);
    const min = Math.min(...group);
    const sum = group.reduce((acc, val) => acc + val, 0);
    
    subgroupRanges.push(max - min);
    subgroupAverages.push(sum / n);
  });

  // Calculate overall X_bar (Average of averages)
  const xBar = subgroupAverages.reduce((acc, val) => acc + val, 0) / subgroups.length;
  
  // Calculate R_bar (Average of ranges)
  const rBar = subgroupRanges.reduce((acc, val) => acc + val, 0) / subgroups.length;

  // Control Limits (X-bar & R Charts)
  const uclX = xBar + (CONSTANTS.A2 * rBar);
  const lclX = xBar - (CONSTANTS.A2 * rBar);
  const uclR = rBar * CONSTANTS.D4;
  const lclR = rBar * CONSTANTS.D3;

  // Standard Deviation for CPK (estimated from R_bar)
  const sigma = rBar / CONSTANTS.d2;

  // CP and CPK
  let cp = 0, cpk = 0;
  if (sigma > 0) {
    const cpkL = (xBar - ltl) / (3 * sigma);
    const cpkU = (utl - xBar) / (3 * sigma);
    cpk = Math.min(cpkL, cpkU);
    cp = (utl - ltl) / (6 * sigma);
  }

  // Standard Deviation for PPK (overall sample standard deviation S)
  const flatReadings = subgroups.flat();
  const overallMean = flatReadings.reduce((acc, val) => acc + val, 0) / flatReadings.length;
  const varianceSum = flatReadings.reduce((acc, val) => acc + Math.pow(val - overallMean, 2), 0);
  const s = Math.sqrt(varianceSum / (flatReadings.length - 1));

  // PP and PPK
  let pp = 0, ppk = 0;
  if (s > 0) {
    const ppkL = (overallMean - ltl) / (3 * s);
    const ppkU = (utl - overallMean) / (3 * s);
    ppk = Math.min(ppkL, ppkU);
    pp = (utl - ltl) / (6 * s);
  }

  return {
    xBar: xBar.toFixed(4),
    rBar: rBar.toFixed(4),
    uclX: uclX.toFixed(4),
    lclX: lclX.toFixed(4),
    sigma: sigma.toFixed(5),
    cp: cp.toFixed(2),
    cpk: cpk.toFixed(2),
    s: s.toFixed(5),
    pp: pp.toFixed(2),
    ppk: ppk.toFixed(2)
  };
};
