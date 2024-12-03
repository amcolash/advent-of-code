import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'sample1.txt')).toString();
const lines = data.trim().split('\n');

// Expand Galaxies
const expansions: { rows: number[]; columns: number[] } = {
  rows: [],
  columns: [],
};

for (let y = 0; y < lines.length; y++) {
  if (!lines[y].includes('#')) expansions.rows.push(y);
}

for (let x = lines[0].length - 1; x >= 0; x--) {
  let expanded = true;
  for (let y = 0; y < lines.length; y++) {
    if (lines[y][x] === '#') {
      expanded = false;
      break;
    }
  }
  if (expanded) expansions.columns.push(x);
}

// Parse Galaxies
const galaxies: { x: number; y: number; id: number }[] = [];
let id = 1;

lines.forEach((line, y) => {
  line.split('').forEach((char, x) => {
    if (char === '#') {
      galaxies.push({ x, y, id });
      id++;
    }
  });
});

// Calculate Distances
const distances: { [key: string]: number } = {};

galaxies.forEach((g1) => {
  galaxies.forEach((g2) => {
    const key1 = `${g1.id}-${g2.id}`;
    const key2 = `${g2.id}-${g1.id}`;
    if (g1.id !== g2.id && !distances[key1] && !distances[key2]) {
      const rowExpansions = expansions.rows.filter((row) => row >= g1.y && row <= g2.y);
      const columnExpansions = expansions.columns.filter((column) => column >= g1.x && column <= g2.x);

      distances[key1] = Math.abs(g1.x - g2.x) + columnExpansions.length * 1 + Math.abs(g1.y - g2.y) + rowExpansions.length * 1``;
      if (key1 === '8-9') console.log(rowExpansions, columnExpansions, distances[key1]);
    }
  });
});

// console.log(rows[0].length, rows.length);
// console.log(distances['5-9']);
console.log(Object.values(distances).length);
console.log(Object.values(distances).reduce((prev, cur) => prev + cur, 0));
