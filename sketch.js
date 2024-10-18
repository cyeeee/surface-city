const GRID_HEIGHT = 101 / 2.5;
const GRID_WIDTH = 174 / 2.5; // width = height * sqrt(3)
let NUM_COLS;
let NUM_ROWS;
let ALL_TILE_IDXS;
let story;
let storyX, storyY, storyWidth, storyHeight;
let scrollPos=0;
let pg;

let buttonGenerate;
let dropdownMenu;
let selectedCityIdx = "0";
let cityIdx = "0";

let grid = [];
const updateQueue = [];
let hasUpdated = {};

let uiVisible = true;
let storyVisible = true;

function toI(xi, yi) {
  return yi * NUM_COLS + xi;
}

function addToQueue(idx, oSize = -1) {
  const changed = oSize == -1 || grid[idx].possibilities.length < oSize;

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

function initializeTiles() {
  // Clear the TILES array to avoid adding to the previous set
  TILES.length = 0;

  // Get columns in the csv file
  let tileIdx = table.getColumn("Tile Name");
  let tileRight = table.getColumn("Right Label");
  let tileBottom = table.getColumn("Bottom Label");
  let tileLeft = table.getColumn("Left Label");
  let tileTop = table.getColumn("Top Label");
  let tileUsed = table.getColumn(
    "Used - " + dropdownMenu.selected().toString()
  ); // Change the number 68 to the district you want to see. Current available districts: 0, 1, 2, 3, 4, 39, 41, 68, 97

  for (let i = 0; i < tileIdx.length; i++) {
    if (parseInt(tileUsed[i]) == 1) {
      TILES.push(
        new Tile(drawImg(parseInt(tileIdx[i])), [
          parseInt(tileRight[i]),
          parseInt(tileBottom[i]),
          parseInt(tileLeft[i]),
          parseInt(tileTop[i]),
        ])
      );
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
  initializeGrid(); // Reinitialize the grid
  cityIdx = selectedCityIdx;
  draw(); // Manually trigger draw once
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  NUM_COLS = ceil(width / GRID_WIDTH);
  NUM_ROWS = ceil(height / GRID_HEIGHT);

  storyX = width / 6;
  storyY = width/1920*20;
  storyWidth = (width / 6) * 4;
  storyHeight = (height / 3) * 2 - 40; // Scroll window height
  pg = createGraphics(storyWidth - 50, storyHeight - 105);

  noStroke();

  dropdownMenu = createSelect();
  dropdownMenu.position((width - dropdownMenu.width) / 2, height - 120/903*height);
  dropdownMenu.option("0");
  dropdownMenu.option("1");
  dropdownMenu.option("2");
  dropdownMenu.option("3");
  dropdownMenu.option("4");
  dropdownMenu.option("14");
  dropdownMenu.option("20");
  dropdownMenu.option("39");
  dropdownMenu.option("41");
  dropdownMenu.option("68");
  dropdownMenu.option("97");
  dropdownMenu.changed(() => {
    selectedCityIdx = dropdownMenu.selected().toString();
  });

  buttonGenerate = createButton("Go!");
  buttonGenerate.position((width - buttonGenerate.width)/2, height - 90/903*height);
  buttonGenerate.mouseClicked(() => {
    resetGrid();
  });

  initializeTiles();
  initializeGrid();

  // Draw story content to the buffer only once in setup (or when necessary)
  drawStoryToBuffer();
}

function drawStoryToBuffer() {
  pg.textSize(15);
  pg.textWrap(WORD);
  pg.clear();
  pg.fill(0);
  pg.textFont("monospace");
  pg.textAlign(LEFT, TOP);

  let offset_y = -scrollPos; // Initial offset
  for (let i = 0; i < story.length; i++) {
    let currentText = story[i];
    let textHeight = pg.textLeading() * ceil(pg.textWidth(currentText) / (pg.width)); // Estimate height
    pg.text(currentText, 0, offset_y, pg.width); // Draw paragraph within the buffer
    offset_y += textHeight + width/1920*20; // Adjust Y position
  }
}

function UIPanel() {
  fill("rgba(255, 255, 255, 0.7)");

  // Panel
  translate(width / 2 - 250, (height / 3) * 2 + 40);
  rect(0, 0, 500, height / 3, 20, 20, 0, 0);
  translate(-width / 2 + 250, (-height / 3) * 2 - 40);

  // UI Text
  fill(0);
  textFont("monospace", 30);
  textAlign(CENTER, CENTER);
  translate(width / 2, (height / 3) * 2 + 20/903*height);
  text("The Surface City", 0, 60/903*height);
  textSize(30);
  let districtName = "SC-" + cityIdx;
  text(districtName, 0, 100/903*height);
  textSize(16);
  text("Change To District Index: ", 0, 145/903*height);
  fill("#65767f");
  textSize(15);
  text('Press "p" to toggle this panel', 0, 240/903*height);
  textSize(15);
  text('Press "s" to toggle Story of The Surface City', 0, 270/903*height);
  translate(-width / 2, (-height / 3) * 2);
}

function StoryPanel(storyX, storyY, storyWidth, storyHeight) {
  // Panel Background
  fill("rgba(255, 255, 255, 0.7)");
  rect(storyX, storyY, storyWidth, storyHeight, 20, 20, 20, 20);

  // Draw the off-screen buffer onto the main canvas within the defined panel
  image(pg, storyX + 25, storyY + 80);

  // Title text (outside of the clipping area)
  fill(0);
  textFont("monospace", 30);
  textAlign(CENTER, CENTER);
  text("Story of The Surface City", width / 2, 60); // Title centered at the top
}


function draw() {
  background(220, 0);

  // Define the scrollable area (a "window" where the story will be displayed)
  let storyX = width / 6;
  let storyY = 20;
  let storyWidth = (width / 6) * 4;
  let storyHeight = (height / 3) * 2 - 40; // Scroll window height

  const byPossibilities = grid.toSorted(
    (a, b) => a.possibilities.length - b.possibilities.length
  );
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

    if (mGridy.possibilities.length > 0) {
      const mTile = TILES[mGridy.possibilities[0]];

      if (mTile) {
        mTile.draw(mGridy.xi, mGridy.yi, GRID_WIDTH, GRID_HEIGHT);
      } else {
        console.error(
          `Error: Tile at index ${mGridy.possibilities[0]} is undefined.`
        );
        resetGrid();
      }
    } else {
      console.error(`Error: Grid element ${i} has no valid possibilities.`);
      resetGrid();
    }
  }
  if (uiVisible) {
    UIPanel();
  }
  if (storyVisible) {
    StoryPanel(storyX, storyY, storyWidth, storyHeight);
  }
}

function keyPressed() {
  if (key == "p") {
    uiVisible = !uiVisible; // Toggle UI visibility state

    // Show or hide UI elements based on the new state
    if (uiVisible) {
      dropdownMenu.show();
      buttonGenerate.show();
    } else {
      dropdownMenu.hide();
      buttonGenerate.hide();
    }
  }
  if (key == 's') {
    storyVisible = !storyVisible; // Toggle Story visibility state
  }
}

function mouseWheel(event) {
  scrollPos += event.deltaY * 0.1; // Adjust scroll speed
  scrollPos = constrain(scrollPos, 0, min(scrollPos, 600)); // Limit scrolling
  drawStoryToBuffer();
}