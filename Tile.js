function drawImg(idx) {  
  return function (xi, yi, w, h=0) {
    const x = xi * w;
    const y = yi * h;    
    image(IMAGES[idx], x, y, w, h);     
  }
}

class Tile {
  constructor(draw, edges) {
    this.draw = draw;
    this.edges = edges;
  }

  allowRight(i) {
    let FlagR;
    let thisR = this.edges[0];
    let otherL = TILES[i].edges[2];
    switch (thisR) {
      case 1: FlagR = (otherL == 1); break;
      case 2: FlagR = (otherL != 0) && (otherL != 1); break;
      case 3: FlagR = (otherL != 1); break;
      case 0: FlagR = (otherL != 1) && (otherL != 3); break;
    }
    return FlagR;
    // return true;
    // return (this.edges[0] == TILES[i].edges[2]);
  }
  allowBottom(i) {
    return this.edges[1] == TILES[i].edges[3];
  }
  allowLeft(i) {
    let FlagL;
    let thisL = this.edges[2];
    let otherR = TILES[i].edges[0];
    switch (thisL) {
      case 1: FlagL = (otherR == 1); break;
      case 2: FlagL = (otherR != 1); break;
      case 3: FlagL = (otherR != 0) && (otherR != 1); break;
      case 0: FlagL = (otherR != 1) && (otherR != 2); break;
    }
    return FlagL;
    // return true;
    // return this.edges[2] == TILES[i].edges[0];
  }
  allowTop(i) {
    return this.edges[3] == TILES[i].edges[1];
  }
}

const IMAGES = [];
const TILES = [];
let table;

function preload() {
  // Load csv file
  table = loadTable("City of Surface Tiles Data - Sheet1.csv", "csv", "header");

  // Load images
  for (let i = 0; i < 40; i++) {
    const mi = loadImage(`tiles/${i}.png`);
    IMAGES.push(mi);
  }
  print(IMAGES);
}