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
      case 1: FlagR = (otherL == 1) || (otherL == 2) || (otherL == 3); break;
      case 2: FlagR = true; break;
      case 3: FlagR = true; break;
      // case 0: FlagR = (thisR == otherL) || (otherL == 2); break;
      case 0: FlagR = (otherL == 0) || (otherL == 2) || (otherL == 3); break;
    }
    return FlagR;
    // return true;
    // return this.edges[0] == TILES[i].edges[2];
  }
  allowBottom(i) {
    return this.edges[1] == TILES[i].edges[3];
  }
  allowLeft(i) {
    let FlagL;
    let thisL = this.edges[2];
    let otherR = TILES[i].edges[0];
    switch (thisL) {
      case 1: FlagL = (otherR == 1) || (otherR == 3) || (otherR == 2); break;
      case 2: FlagL = true; break;
      case 3: FlagL = true; break;
      // case 0: FlagL = (thisL == otherR) || (otherR == 3); break;
      case 0: FlagL = (otherR == 0) || (otherR == 3) || (otherR == 2); break;
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
// let ALL_TILE_IDXS = TILES.map((_, i) => i);
// const EdgeType = Object.freeze({
//   b: 0,
//   c1: 1,
//   c2: 2,
//   c3: 3,  
//   c1c2: 4,
//   c2c3: 5,
//   c3c1: 6,
//   c3c2: 7,
//   c3b: 8,
//   bc2: 9,
// });

function preload() {
  // Load csv file
  table = loadTable("City of Surface Tiles Data Small.csv", "csv", "header");

  // Load images
  for (let i = 0; i < 28; i++) {
    // TILES.push(new Tile(drawImg(tileIdx), [EdgeType.tileRight, EdgeType.c2c3, EdgeType.c2, EdgeType.c1]));
    const mi = loadImage(`tiles/tiles-small/${i}.png`);
    IMAGES.push(mi);
  }
  // print(IMAGES);
}




// const TILES = [
//   new Tile(drawImg(0), [EdgeType.c3, EdgeType.c2c3, EdgeType.c2, EdgeType.c1]),
//   new Tile(drawImg(1), [EdgeType.c1, EdgeType.c2, EdgeType.c2, EdgeType.c1]),
//   new Tile(drawImg(2), [EdgeType.c3, EdgeType.c3, EdgeType.c1, EdgeType.c1]),
//   new Tile(drawImg(3), [EdgeType.c2, EdgeType.c1, EdgeType.c3, EdgeType.c3c2]),
//   new Tile(drawImg(4), [EdgeType.c2, EdgeType.c2, EdgeType.c2, EdgeType.c1c2]),
//   new Tile(drawImg(5), [EdgeType.c3, EdgeType.c2c3, EdgeType.c2, EdgeType.c2c3]),
//   new Tile(drawImg(6), [EdgeType.b, EdgeType.b, EdgeType.b, EdgeType.c2c3]),
//   new Tile(drawImg(7), [EdgeType.b, EdgeType.c1, EdgeType.b, EdgeType.b]),
//   new Tile(drawImg(8), [EdgeType.b, EdgeType.c1, EdgeType.c1, EdgeType.b]),
//   new Tile(drawImg(9), [EdgeType.c1, EdgeType.c1, EdgeType.b, EdgeType.b]),
//   new Tile(drawImg(10), [EdgeType.c2, EdgeType.b, EdgeType.b, EdgeType.c2]),
//   new Tile(drawImg(11), [EdgeType.b, EdgeType.b, EdgeType.c3, EdgeType.c3]),
//   new Tile(drawImg(12), [EdgeType.c3, EdgeType.c3, EdgeType.c3, EdgeType.c3c1]),
//   new Tile(drawImg(13), [EdgeType.c1, EdgeType.c3c2, EdgeType.c1, EdgeType.b]),
//   new Tile(drawImg(14), [EdgeType.c1, EdgeType.c3c2, EdgeType.c1, EdgeType.c1]),
//   new Tile(drawImg(15), [EdgeType.c1, EdgeType.c3c2, EdgeType.c1, EdgeType.c2c3]),
//   new Tile(drawImg(16), [EdgeType.c2, EdgeType.c3c2, EdgeType.c3, EdgeType.c3c2]),
//   new Tile(drawImg(17), [EdgeType.c2, EdgeType.bc2, EdgeType.b, EdgeType.bc2]),
//   new Tile(drawImg(18), [EdgeType.b, EdgeType.c3b, EdgeType.c3, EdgeType.c3b]),
//   new Tile(drawImg(19), [EdgeType.b, EdgeType.c3b, EdgeType.c1, EdgeType.b]),
//   new Tile(drawImg(20), [EdgeType.c1, EdgeType.bc2, EdgeType.b, EdgeType.b]),
//   new Tile(drawImg(21), [EdgeType.b, EdgeType.b, EdgeType.c3, EdgeType.c3b]),
//   new Tile(drawImg(22), [EdgeType.c2, EdgeType.b, EdgeType.b, EdgeType.bc2]),
//   new Tile(drawImg(23), [EdgeType.b, EdgeType.b, EdgeType.b, EdgeType.b]),
//   new Tile(drawImg(24), [EdgeType.c1, EdgeType.c1, EdgeType.c1, EdgeType.c1]),
//   new Tile(drawImg(25), [EdgeType.c2, EdgeType.c2, EdgeType.c2, EdgeType.c2]),
//   new Tile(drawImg(26), [EdgeType.c3, EdgeType.c3, EdgeType.c3, EdgeType.c3]),
//   new Tile(drawImg(27), [EdgeType.c1, EdgeType.c1c2, EdgeType.c1, EdgeType.b]),
//   new Tile(drawImg(28), [EdgeType.c1, EdgeType.c3c1, EdgeType.c1, EdgeType.b]),
//   new Tile(drawImg(29), [EdgeType.c2, EdgeType.b, EdgeType.c3, EdgeType.c3c2]),
// ];



// const ALL_TILE_IDXS = TILES.map((_, i) => i);
// print(typeof(ALL_TILE_IDXS));