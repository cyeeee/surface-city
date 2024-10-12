const GRID_HEIGHT = 101/2.5;
const GRID_WIDTH = 174/2.5; // width = height * sqrt(3)
let NUM_COLS;
let NUM_ROWS;
let ALL_TILE_IDXS;

let buttonGenerate;
let dropdownMenu;
let selectedCityIdx = "0";
let cityIdx = "68";

let grid = [];
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

  NUM_COLS = ceil(width / GRID_WIDTH);
  NUM_ROWS = ceil(height / GRID_HEIGHT);

  noStroke();

  dropdownMenu = createSelect();
  dropdownMenu.position(windowWidth / 2 + 10, windowHeight - 103);
  dropdownMenu.option('0');
  dropdownMenu.option('1');
  dropdownMenu.option('2');
  dropdownMenu.option('3');
  dropdownMenu.option('4');
  dropdownMenu.option('39');
  dropdownMenu.option('41');
  dropdownMenu.option('68');
  dropdownMenu.option('97');
  dropdownMenu.changed(()=>{
    selectedCityIdx = dropdownMenu.selected().toString();
  });

  buttonGenerate = createButton("Go!");
  buttonGenerate.position(windowWidth / 2 + 100, windowHeight - 115);
  buttonGenerate.mouseClicked(() => {
    resetGrid();
  });

  initializeTiles();
  initializeGrid();
}

function initializeTiles() {
  // Get columns in the csv file
  let tileIdx = table.getColumn("Tile Name");  
  let tileRight = table.getColumn("Right Label");
  let tileBottom = table.getColumn("Bottom Label");
  let tileLeft = table.getColumn("Left Label");
  let tileTop = table.getColumn("Top Label");
  let tileUsed = table.getColumn("Used - " + dropdownMenu.selected().toString()); // Change the number 68 to the district you want to see. Current available districts: 0, 1, 2, 3, 4, 39, 41, 68, 97
  
  for (let i=0; i<tileIdx.length; i++) {
    if (parseInt(tileUsed[i]) == 1) {
      TILES.push(new Tile(drawImg(parseInt(tileIdx[i])), [parseInt(tileRight[i]),parseInt(tileBottom[i]),parseInt(tileLeft[i]),parseInt(tileTop[i])])); 
    }
    
  }
  ALL_TILE_IDXS = TILES.map((_, i) => i);
}

function initializeGrid() {
  grid = [];
  for (let yi = 0; yi < NUM_ROWS; yi++) {
    for (let xi = 0; xi < NUM_COLS; xi++) {
      grid.push(new Gridy(xi, yi, grid.length));
    }
  }
}

function resetGrid() {
  initializeTiles(); // Reinitialize the TILES array
  initializeGrid();  // Reinitialize the grid
  cityIdx = selectedCityIdx;
  draw(); // Manually trigger draw once
}

function draw() {
  background(220, 0);

  const byPossibilities = grid.toSorted((a, b) => a.possibilities.length - b.possibilities.length);
  const candidates = byPossibilities.filter((p) => p.possibilities.length > 1);

  if (candidates.length > 0) {
    const candidate = candidates[0];
    // print("collapsing", candidate.i);
    collapse(grid[candidate.i]);

    updateQueue.push(candidate.i);
    hasUpdated[candidate.i] = candidate.i;
  }

  while (updateQueue.length > 0) {
    const updateIdx = updateQueue.shift();
    updateGridElement(grid[updateIdx]);
  }
  hasUpdated = {};

  for (let i = 0; i < grid.length; i++) {
    const mGridy = grid[i];
    let mTile = TILES[mGridy.possibilities[0]];
    mTile.draw(mGridy.xi, mGridy.yi, GRID_WIDTH, GRID_HEIGHT);
  }

  fill("rgba(255, 255, 255, 0.25)");
  rect(width / 2 - 300, height - 300, 600, 300);
  fill(0);
  textFont("monospace", 40);
  textAlign(CENTER, CENTER);
  text("The Surface City", windowWidth / 2, windowHeight - 200);
  textSize(30);
  let districtName = "SC-" + cityIdx;
  text(districtName, windowWidth / 2, windowHeight - 150);
  textSize(20);
  text("Change District: ", windowWidth / 2 - 80, windowHeight - 90);
}
