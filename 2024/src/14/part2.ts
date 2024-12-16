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

const dims: Point = { x: 101, y: 103 };

function getMap() {
  const map = Array.from({ length: dims.y }, () => Array(dims.x).fill(0));
  robots.forEach((r) => map[r.p.y][r.p.x]++);

  return map;
}

function drawMap() {
  console.clear();

  const map = getMap();

  for (let y = 0; y < dims.y; y++) {
    for (let x = 0; x < dims.x; x++) {
      if (map[y][x]) stdout.write(map[y][x].toString());
      else stdout.write('.');
    }
    stdout.write('\n');
  }
}

function checkOverlaps() {
  const map = getMap();

  for (let y = 0; y < dims.y; y++) {
    for (let x = 0; x < dims.x; x++) {
      if (map[y][x] > 1) return true;
    }
  }

  return false;
}

for (let t = 1; t < 1000000; t++) {
  robots.forEach((r) => {
    r.p.x = mod(r.p.x + r.v.x, dims.x);
    r.p.y = mod(r.p.y + r.v.y, dims.y);
  });

  if (!checkOverlaps()) {
    drawMap();
    console.log('\n', t);
    break;
  }
}
