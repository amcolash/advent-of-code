import { readFileSync } from 'fs';
import { join } from 'path';
import { buildStringGrid, printGrid } from '../util/grid';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const grid = buildStringGrid(lines);

const width = grid[0].length;
const height = grid.length;

const START = 'S';
const EMPTY = '.';
const SPLIT = '^';
const BEAM = '|';

let splits = 0;
function update(y) {
  for (let x = 0; x < width; x++) {
    if (grid[y][x] === START) grid[y + 1][x] = BEAM;
    if (grid[y][x] === BEAM) {
      if (grid[y + 1][x] === SPLIT) {
        grid[y + 1][x - 1] = BEAM;
        grid[y + 1][x + 1] = BEAM;

        splits++;
      } else {
        grid[y + 1][x] = BEAM;
      }
    }
  }
}

// printGrid(grid);
// console.log();
for (let y = 0; y < height - 1; y++) {
  update(y);
  // printGrid(grid);
  // console.log();
}

console.log(splits);
