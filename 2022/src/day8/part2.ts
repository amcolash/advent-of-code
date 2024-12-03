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

let highest = 0;

const score: number[][] = [];
for (let y = 0; y < lines.length; y++) {
  for (let x = 0; x < lines[0].length; x++) {
    const height = grid[y][x];

    // Left
    let left = 0;
    for (let checkX = x - 1; checkX >= 0; checkX--) {
      left++;
      if (grid[y][checkX] >= height) break;
    }

    // Right
    let right = 0;
    for (let checkX = x + 1; checkX < grid[0].length; checkX++) {
      right++;
      if (grid[y][checkX] >= height) break;
    }

    // Up
    let up = 0;
    for (let checkY = y - 1; checkY >= 0; checkY--) {
      up++;
      if (grid[checkY][x] >= height) break;
    }

    // Down
    let down = 0;
    for (let checkY = y + 1; checkY < grid.length; checkY++) {
      down++;
      if (grid[checkY][x] >= height) break;
    }

    const total = left * right * up * down;

    score[y] = score[y] || [];
    score[y][x] = total;

    highest = Math.max(highest, total);
  }
}

console.log(highest);
