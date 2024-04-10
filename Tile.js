class Tile {
  constructor(draw, edges) {
    this.draw = draw;
    this.edges = edges;
  }

  allowRight(i) {
    return this.edges[0] == TILES[i].edges[2];
  }
  allowBottom(i) {
    return this.edges[1] == TILES[i].edges[3];
  }
  allowLeft(i) {
    return this.edges[2] == TILES[i].edges[0];
  }
  allowTop(i) {
    return this.edges[3] == TILES[i].edges[1];
  }
}

const IMAGES = [];

function preload() {
  for (let i = 0; i < 30; i++) {
    const mi = loadImage(`tiles/${i}.png`);
    IMAGES.push(mi);
  }
}

function img(idx) {
  return function (xi, yi, w, h) {
    const x = xi * w;
    const y = yi * h;
    image(IMAGES[idx], x, y, w, h);
    console.log(idx);
  }
}

const EdgeType = Object.freeze({
  c1: 0,
  c2: 1,
  c3: 2,
  b: 3,
  c1c2: 4,
  c2c3: 5,
  c3c1: 6,
  c3c2: 7,
  c3b: 8,
  bc2: 9,
});

const TILES = [
  new Tile(img(0), [EdgeType.c3, EdgeType.c2c3, EdgeType.c2, EdgeType.c1]),
  new Tile(img(1), [EdgeType.c1, EdgeType.c2, EdgeType.c2, EdgeType.c1]),
  new Tile(img(2), [EdgeType.c3, EdgeType.c3, EdgeType.c1, EdgeType.c1]),
  new Tile(img(3), [EdgeType.c2, EdgeType.c1, EdgeType.c3, EdgeType.c3c2]),
  new Tile(img(4), [EdgeType.c2, EdgeType.c2, EdgeType.c2, EdgeType.c1c2]),
  new Tile(img(5), [EdgeType.c3, EdgeType.c2c3, EdgeType.c2, EdgeType.c2c3]),
  new Tile(img(6), [EdgeType.b, EdgeType.b, EdgeType.b, EdgeType.c2c3]),
  new Tile(img(7), [EdgeType.b, EdgeType.c1, EdgeType.b, EdgeType.b]),
  new Tile(img(8), [EdgeType.b, EdgeType.c1, EdgeType.c1, EdgeType.b]),
  new Tile(img(9), [EdgeType.c1, EdgeType.c1, EdgeType.b, EdgeType.b]),
  new Tile(img(10), [EdgeType.c2, EdgeType.b, EdgeType.b, EdgeType.c2]),
  new Tile(img(11), [EdgeType.b, EdgeType.b, EdgeType.c3, EdgeType.c3]),
  new Tile(img(12), [EdgeType.c3, EdgeType.c3, EdgeType.c3, EdgeType.c3c1]),
  new Tile(img(13), [EdgeType.c1, EdgeType.c3c2, EdgeType.c1, EdgeType.b]),
  new Tile(img(14), [EdgeType.c1, EdgeType.c3c2, EdgeType.c1, EdgeType.c1]),
  new Tile(img(15), [EdgeType.c1, EdgeType.c3c2, EdgeType.c1, EdgeType.c2c3]),
  new Tile(img(16), [EdgeType.c2, EdgeType.c3c2, EdgeType.c3, EdgeType.c3c2]),
  new Tile(img(17), [EdgeType.c2, EdgeType.bc2, EdgeType.b, EdgeType.bc2]),
  new Tile(img(18), [EdgeType.b, EdgeType.c3b, EdgeType.c3, EdgeType.c3b]),
  new Tile(img(19), [EdgeType.b, EdgeType.c3b, EdgeType.c1, EdgeType.b]),
  new Tile(img(20), [EdgeType.c1, EdgeType.bc2, EdgeType.b, EdgeType.b]),
  new Tile(img(21), [EdgeType.b, EdgeType.b, EdgeType.c3, EdgeType.c3b]),
  new Tile(img(22), [EdgeType.c2, EdgeType.b, EdgeType.b, EdgeType.bc2]),
  new Tile(img(23), [EdgeType.b, EdgeType.b, EdgeType.b, EdgeType.b]),
  new Tile(img(24), [EdgeType.c1, EdgeType.c1, EdgeType.c1, EdgeType.c1]),
  new Tile(img(25), [EdgeType.c2, EdgeType.c2, EdgeType.c2, EdgeType.c2]),
  new Tile(img(26), [EdgeType.c3, EdgeType.c3, EdgeType.c3, EdgeType.c3]),
  new Tile(img(27), [EdgeType.c1, EdgeType.c1c2, EdgeType.c1, EdgeType.b]),
  new Tile(img(28), [EdgeType.c1, EdgeType.c3c1, EdgeType.c1, EdgeType.b]),
  new Tile(img(29), [EdgeType.c2, EdgeType.b, EdgeType.c3, EdgeType.c3c2]),
];

const ALL_TILE_IDXS = TILES.map((_, i) => i);
