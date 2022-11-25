import fs from 'fs';

function generateHash() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function generateNodes(size, bomCount) {
  // generate parts
  const data = [];
  for (let i = 0; i < size; i++) {
    data.push({
      id: generateHash(),
      name: `PRT${i}`,
      description: `Description for part ${i}`,
      weight: 1,
      parents: [],
    });
  }
  // define the bomCount first parts as BOMheads
  let bomHeads = data.slice(0, bomCount);
  bomHeads = bomHeads.map((bomHead) => {
    bomHead.top = true;
    return bomHead;
  });

  return { data, bomHeads };
}



export function populateChildren(part, level, bomDepthSet, data) {
  // select a random part where top is false and parent is not in part.parents
  const children = [];
  let fillAtempts = 0;
  // set bomWidth to be randomly between bomWidth[0] and bomWidth[1]
  const bomWidthSet = global.config.bomWidth.length > 1 ? (Math.floor(Math.random() * (global.config.bomWidth[1] - global.config.bomWidth[0] + 1)) + global.config.bomWidth[0]) - 1 : global.config.bomWidth[0];


  while ((children.length < bomWidthSet + 1) && (fillAtempts < 10)) {
    fillAtempts++;

    const potentialChildren = data.filter((p) => !p.top && !part.parents.includes(p.id) && !p.parents.includes(part.id) && p.id !== part.id && (p.level === undefined || p.level == level));
    // sort potentialChildren by weight
    potentialChildren.sort((a, b) => a.weight - b.weight);
    const index = Math.floor((Math.random() ** 4) * potentialChildren.length)
    const child = potentialChildren[index];
    if (child) {

      global.cyEdges.push({
        group: 'edges',
        data: {
          id: `${part.id}-${child.id}-${Date.now()}`,
          source: part.id,
          target: child.id,
          // set random quantity between 1 and 20
          qty: Math.floor(Math.random() * 20) + 1,
        },
      });
      // merge child parents and part parents
      child.parents = [...child.parents, ...part.parents, part.id];
      child.level = level;
      child.parents.push(part.id);
      child.weight = part.weight + child.weight;
      // remove duplicates from child parents
      child.parents = [...new Set(child.parents)];
      children.push(child);

      if (level < bomDepthSet && !child.hasChildren) {
        populateChildren(child, level + 1, bomDepthSet, data);
      }
    }
  }
  part.hasChildren = true;

  // part.children = children;
  return part;
};



export function convertDataToNodes(data) {
  const cyNodes = data.map((part) => {
    const element = {
      group: 'nodes',
      data: {
        id: part.id,
        name: part.name,
        weight: part.weight,
        description: part.description,
        level: part.level,
      },
    };
    if (part.top) {
      element.data.top = true;
    }
    return element;
  });
  return cyNodes;
}


export function saveDataToJson(data, cyNodes, cyEdges) {
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
  fs.writeFileSync('output/cyNodes.json', JSON.stringify(cyNodes, null, 2));
  fs.writeFileSync('output/cyEdges.json', JSON.stringify(cyEdges, null, 2));
}