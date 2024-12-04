import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const grid: string[][] = [];
const aCoords: { x: number; y: number }[] = [];

for (let y = 0; y < lines.length; y++) {
  grid[y] = [];
  for (let x = 0; x < lines[y].length; x++) {
    grid[y][x] = lines[y][x];

    if (grid[y][x] === 'A') aCoords.push({ x, y });
  }
}

let count = 0;

const patternA = [
  ['M', undefined, 'M'],
  [undefined, 'A', undefined],
  ['S', undefined, 'S'],
];
const patternB = [
  ['S', undefined, 'S'],
  [undefined, 'A', undefined],
  ['M', undefined, 'M'],
];
const patternC = [
  ['M', undefined, 'S'],
  [undefined, 'A', undefined],
  ['M', undefined, 'S'],
];
const patternD = [
  ['S', undefined, 'M'],
  [undefined, 'A', undefined],
  ['S', undefined, 'M'],
];

function checkPattern(center: { x: number; y: number }, pattern: string[][]) {
  const topLeft = { x: center.x - 1, y: center.y - 1 };

  if (topLeft.y >= 0 && topLeft.y < grid.length - 2 && topLeft.x >= 0 && topLeft.x < grid[0].length - 2) {
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const actual = { x: topLeft.x + x, y: topLeft.y + y };
        const expected = pattern[y][x];
        if (expected && grid[actual.y][actual.x] !== expected) {
          return;
        }
      }
    }

    count++;
  }
}

aCoords.forEach((coord) => {
  [patternA, patternB, patternC, patternD].forEach((pattern) => {
    checkPattern(coord, pattern);
  });
});

console.log(count);
