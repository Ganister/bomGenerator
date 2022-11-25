import BuildExcel from './utils/buildExcel.js';
import { generateNodes, populateChildren, convertDataToNodes, saveDataToJson } from './utils/tools.js';

const config = {
  bomDepth: [6, 9],
  bomCount: 40,
  partCount: 2000,
  bomWidth: [2, 12],
}
global.config = config;
global.cyEdges = [];


console.time('generateData');

// init nodes
const { data, bomHeads } = generateNodes(config.partCount, config.bomCount);

// start populating BOMs
for (let i = 0; i < bomHeads.length; i++) {
  console.time(`Populating children for ${bomHeads[i].id}`);
  // set BOM depth
  const bomDepthSet = config.bomDepth.length > 1 ? (Math.floor(Math.random() * (config.bomDepth[1] - config.bomDepth[0] + 1)) + config.bomDepth[0]) : config.bomDepth[0];

  // start recursive population
  populateChildren(bomHeads[i], 0, bomDepthSet, data);

  console.timeEnd(`Populating children for ${bomHeads[i].id}`);
}


global.cyNodes = convertDataToNodes(data);

console.timeEnd('generateData');



console.time('Build Excel');

BuildExcel(cyNodes, cyEdges,);

console.timeEnd('Build Excel');



