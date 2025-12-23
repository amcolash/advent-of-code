import { readFileSync } from 'fs';
import { join } from 'path';
import {
  buildStringGrid,
  Color,
  color,
  getNeighborCells,
  getPointWithValue,
  iterateGrid,
  printGrid,
} from '../util/utils';
import { PointWithValue } from '../util/types';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const EMPTY = '.';
const PAPER = '@';

const grid = buildStringGrid(lines);
const accessible: PointWithValue<string>[] = [];

iterateGrid(grid, (x, y, value) => {
  if (value === PAPER) {
    const neighbors = getNeighborCells({ x, y }, grid);
    let rolls = 0;

    if (neighbors.N.value === PAPER) rolls++;
    if (neighbors.S.value === PAPER) rolls++;
    if (neighbors.E.value === PAPER) rolls++;
    if (neighbors.W.value === PAPER) rolls++;

    if (neighbors.NE.value === PAPER) rolls++;
    if (neighbors.NW.value === PAPER) rolls++;
    if (neighbors.SE.value === PAPER) rolls++;
    if (neighbors.SW.value === PAPER) rolls++;

    if (rolls < 4) {
      accessible.push(getPointWithValue(x, y, grid));
    }
  }
});

for (let i = 0; i < accessible.length; i++) {
  const point = accessible[i];
  grid[point.y][point.x] = color('x', Color.Red);
}

printGrid(grid);
console.log();
console.log(accessible.length);
