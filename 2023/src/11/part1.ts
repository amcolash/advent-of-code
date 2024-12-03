import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

// Expand Galaxies
const rows: string[] = [];

for (let y = 0; y < lines.length; y++) {
  const row = lines[y];
  rows.push(row);
  if (!row.includes('#')) rows.push(row);
}

for (let x = rows[0].length - 1; x >= 0; x--) {
  let expanded = true;
  for (let y = 0; y < rows.length; y++) {
    if (rows[y][x] === '#') {
      expanded = false;
      break;
    }
  }
  if (expanded) {
    for (let y = 0; y < rows.length; y++) {
      rows[y] = rows[y].substring(0, x + 1) + '.' + rows[y].substring(x + 1);
    }
  }
}

// Parse Galaxies
const galaxies: { x: number; y: number; id: number }[] = [];
let id = 1;

rows.forEach((line, y) => {
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
      distances[key1] = Math.abs(g1.x - g2.x) + Math.abs(g1.y - g2.y);
    }
  });
});

// console.log(rows[0].length, rows.length);
// console.log(distances['5-9']);
console.log(Object.values(distances).reduce((prev, cur) => prev + cur, 0));
