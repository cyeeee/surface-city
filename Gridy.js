class Gridy {
  constructor(xi, yi, i) {
    this.xi = xi;
    this.yi = yi;
    this.i = i;
    this.possibilities = ALL_TILE_IDXS.slice();
  }

  static setUnion(s0, s1) {
    const newSet = new Set();
    s0.forEach(v => newSet.add(v));
    s1.forEach(v => newSet.add(v));
    return newSet;
  }

  debug(w, h = 0) {
    h = h || w;
    const t = `${this.xi}x${this.yi} (${this.i}): ${this.possibilities}`;
    text(t, this.xi * w, this.yi * h, w, h);
  }

  updateFromRight(tileIdxs) {
    let newPossibilities = new Set([]);
    for (let ti = 0; ti < tileIdxs.length; ti++) {
      const allowed = this.possibilities.filter((p) => TILES[p].allowRight(tileIdxs[ti]));
      newPossibilities = Gridy.setUnion(newPossibilities, new Set(allowed));
    }
    this.possibilities = Array.from(newPossibilities);
  }

  updateFromBottom(tileIdxs) {
    let newPossibilities = new Set([]);
    for (let ti = 0; ti < tileIdxs.length; ti++) {
      const allowed = this.possibilities.filter((p) => TILES[p].allowBottom(tileIdxs[ti]));
      newPossibilities = Gridy.setUnion(newPossibilities, new Set(allowed));
    }
    this.possibilities = Array.from(newPossibilities);
  }

  updateFromLeft(tileIdxs) {
    let newPossibilities = new Set([]);
    for (let ti = 0; ti < tileIdxs.length; ti++) {
      const allowed = this.possibilities.filter((p) => TILES[p].allowLeft(tileIdxs[ti]));
      newPossibilities = Gridy.setUnion(newPossibilities, new Set(allowed));
    }
    this.possibilities = Array.from(newPossibilities);
  }

  updateFromTop(tileIdxs) {
    let newPossibilities = new Set([]);
    for (let ti = 0; ti < tileIdxs.length; ti++) {
      const allowed = this.possibilities.filter((p) => TILES[p].allowTop(tileIdxs[ti]));
      newPossibilities = Gridy.setUnion(newPossibilities, new Set(allowed));
    }
    this.possibilities = Array.from(newPossibilities);
  }
}
