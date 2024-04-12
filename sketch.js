const GRID_HEIGHT = 101/2;
var GRID_WIDTH = 174/2; // grid_height * sqrt(3)
let NUM_COLS;
let NUM_ROWS;
let ALL_TILE_IDXS;

const grid = [];
const updateQueue = [];
let hasUpdated = {};

function toI(xi, yi) {
  return yi * NUM_COLS + xi;
}

function addToQueue(idx, oSize = -1) {
  const changed = (oSize == -1) || grid[idx].possibilities.length < oSize;

  if (!(idx in hasUpdated) && changed) {
    updateQueue.push(idx);
    hasUpdated[idx] = idx;
  }
}

function updateGridElement(aGridy) {
  const mX = aGridy.xi;
  const mY = aGridy.yi;

  // update RIGHT
  if (mX + 1 < NUM_COLS) {
    const gIdx = toI(mX + 1, mY);
    const oSize = grid[gIdx].possibilities.length;
    grid[gIdx].updateFromLeft(aGridy.possibilities);
    addToQueue(gIdx, oSize);
  }

  // update BOTTOM
  if (mY + 1 < NUM_ROWS) {
    const gIdx = toI(mX, mY + 1);
    const oSize = grid[gIdx].possibilities.length;
    grid[gIdx].updateFromTop(aGridy.possibilities);
    addToQueue(gIdx, oSize);
  }

  // update LEFT
  if (mX > 0) {
    const gIdx = toI(mX - 1, mY);
    const oSize = grid[gIdx].possibilities.length;
    grid[gIdx].updateFromRight(aGridy.possibilities);
    addToQueue(gIdx, oSize);
  }

  // update TOP
  if (mY > 0) {
    const gIdx = toI(mX, mY - 1);
    const oSize = grid[gIdx].possibilities.length;
    grid[gIdx].updateFromBottom(aGridy.possibilities);
    addToQueue(gIdx, oSize);
  }
}

function collapse(aGridy) {
  aGridy.possibilities = [random(aGridy.possibilities)];
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // GRID_WIDTH = GRID_HEIGHT*sqrt(3);

  NUM_COLS = ceil(width / GRID_WIDTH);
  NUM_ROWS = ceil(height / GRID_HEIGHT);

  // noLoop();
  noStroke();

  // Get columns in the csv file
  let tileIdx = table.getColumn("Tile Name");  
  let tileRight = table.getColumn("Right Label");
  let tileBottom = table.getColumn("Bottom Label");
  let tileLeft = table.getColumn("Left Label");
  let tileTop = table.getColumn("Top Label");
  
  for (let i=0; i<tileIdx.length; i++) {
    TILES.push(new Tile(drawImg(parseInt(tileIdx[i])), [parseInt(tileRight[i]),parseInt(tileBottom[i]),parseInt(tileLeft[i]),parseInt(tileTop[i])])); 
    
  }
  print("pushed");
  ALL_TILE_IDXS = TILES.map((_, i) => i);

  for (let yi = 0; yi < NUM_ROWS; yi++) {
    for (let xi = 0; xi < NUM_COLS; xi++) {
      grid.push(new Gridy(xi, yi, grid.length));
    }
  }
}

function draw() {
  background(220);

  const byPossibilities = grid.toSorted((a, b) => a.possibilities.length - b.possibilities.length);
  const candidates = byPossibilities.filter((p) => p.possibilities.length > 1);

  if (candidates.length > 0) {
    const candidate = candidates[0];
    print("collapsing", candidate.i);
    collapse(grid[candidate.i]);

    updateQueue.push(candidate.i);
    hasUpdated[candidate.i] = candidate.i;
  } else {
    noLoop();
  }

  while (updateQueue.length > 0) {
    const updateIdx = updateQueue.shift();
    updateGridElement(grid[updateIdx]);
  }
  hasUpdated = {};

  for (let i = 0; i < grid.length; i++) {
    const mGridy = grid[i];
    // print(mGridy);
    let mTile = TILES[mGridy.possibilities[0]];
    // print(mGridy.possibilities[0]);
    // print(TILES[mGridy.possibilities[0]]);
    // if (mTile != [])
    mTile.draw(mGridy.xi, mGridy.yi, GRID_WIDTH, GRID_HEIGHT);
  }
}

function mouseClicked() {
  redraw();
}
