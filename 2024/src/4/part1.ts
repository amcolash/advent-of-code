import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const grid: string[][] = [];
const xCoords: { x: number; y: number }[] = [];

for (let y = 0; y < lines.length; y++) {
  grid[y] = [];
  for (let x = 0; x < lines[y].length; x++) {
    grid[y][x] = lines[y][x];

    if (grid[y][x] === 'X') xCoords.push({ x, y });
  }
}

let count = 0;

const dirs: { x: number; y: number }[] = [
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: -1 },
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
];

function checkDir(coord: { x: number; y: number }, expected: string, dir: { x: number; y: number }) {
  const x = coord.x + dir.x;
  const y = coord.y + dir.y;

  if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
    // console.log(`original: (${coord.x}, ${coord.y}), dir: (${dir.x}, ${dir.y}), new: (${x}, ${y}), expected: ${expected}`);

    const newLetter = grid[y][x];

    if (newLetter === expected) {
      // console.log('found', expected);

      let nextLetter;
      if (expected === 'M') nextLetter = 'A';
      if (expected === 'A') nextLetter = 'S';
      if (expected === 'S') {
        count++;
        return;
      }

      checkDir({ x, y }, nextLetter, dir);
    }
  }
}

xCoords.forEach((coord) => {
  dirs.forEach((dir) => {
    checkDir({ x: coord.x, y: coord.y }, 'M', dir);
  });
});

console.log(count);
