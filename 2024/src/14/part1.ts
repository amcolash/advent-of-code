import { readFileSync } from 'fs';
import { join } from 'path';
import { Point } from '../util/types';
import { stdout } from 'process';
import { mod } from '../util/utils';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const robots: { p: Point; v: Point }[] = [];
lines.forEach((l) => {
  const sections = l.split(' ');
  const pos = sections[0]
    .replace('p=', '')
    .split(',')
    .map((n) => Number(n));
  const vel = sections[1]
    .replace('v=', '')
    .split(',')
    .map((n) => Number(n));

  robots.push({ p: { x: pos[0], y: pos[1] }, v: { x: vel[0], y: vel[1] } });
});

const dims: Point = robots.length < 15 ? { x: 11, y: 7 } : { x: 101, y: 103 };
const center = { x: Math.floor(dims.x / 2), y: Math.floor(dims.y / 2) };

function drawMap() {
  const map = Array.from({ length: dims.y }, () => Array(dims.x).fill(0));

  robots.forEach((r) => map[r.p.y][r.p.x]++);

  for (let y = 0; y < dims.y; y++) {
    for (let x = 0; x < dims.x; x++) {
      if (x === center.x || y === center.y) stdout.write(' ');
      else if (map[y][x]) stdout.write(map[y][x].toString());
      else stdout.write('.');
    }
    stdout.write('\n');
  }
}

for (let t = 0; t < 100; t++) {
  robots.forEach((r) => {
    r.p.x = mod(r.p.x + r.v.x, dims.x);
    r.p.y = mod(r.p.y + r.v.y, dims.y);
  });
}

// console.log(robots.map((r) => `p: ${r.p.x}, ${r.p.y}, v: ${r.v.x}, ${r.v.y}`));
// drawMap();

const quads = [0, 0, 0, 0];

robots.forEach((r) => {
  const { x, y } = r.p;
  if (x < center.x && y < center.y) quads[0]++;
  else if (x > center.x && y < center.y) quads[1]++;
  else if (x < center.x && y > center.y) quads[2]++;
  else if (x > center.x && y > center.y) quads[3]++;
});

// console.log(quads);
console.log(quads[0] * quads[1] * quads[2] * quads[3]);
