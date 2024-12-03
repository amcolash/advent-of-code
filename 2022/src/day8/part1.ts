import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.split('\n');

const grid: number[][] = [];

for (let y = 0; y < lines.length; y++) {
  for (let x = 0; x < lines[0].length; x++) {
    grid[y] = grid[y] || [];
    grid[y][x] = Number.parseInt(lines[y][x]);
  }
}

let visibleCount = 0;

const visible: string[][] = [];
for (let y = 0; y < lines.length; y++) {
  for (let x = 0; x < lines[0].length; x++) {
    const height = grid[y][x];

    let v = false;

    // Check if on outside
    if (x - 1 < 0) v = true;
    if (x + 1 >= grid[0].length) v = true;
    if (y - 1 < 0) v = true;
    if (y + 1 >= grid.length) v = true;

    // If inside
    if (!v) {
      let max;

      // Left
      max = 0;
      for (let checkX = 0; checkX < x; checkX++) {
        max = Math.max(max, grid[y][checkX]);
      }
      if (height > max) v = true;

      // Right
      max = 0;
      for (let checkX = x + 1; checkX < grid[0].length; checkX++) {
        max = Math.max(max, grid[y][checkX]);
      }
      if (height > max) v = true;

      // Up
      max = 0;
      for (let checkY = 0; checkY < y; checkY++) {
        max = Math.max(max, grid[checkY][x]);
      }
      if (height > max) v = true;

      // Down
      max = 0;
      for (let checkY = y + 1; checkY < grid.length; checkY++) {
        max = Math.max(max, grid[checkY][x]);
      }
      if (height > max) v = true;
    }

    visible[y] = visible[y] || [];
    visible[y][x] = v ? 'V' : 'H';

    if (v) visibleCount++;
  }
}

console.log(visibleCount);
