import { readFileSync } from 'fs';
import { join } from 'path';

import { Point } from '../util/types';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const dims = { x: lines[0].length, y: lines.length };

type Antenna = { pos: Point; name: string };

const antennas: { [key: string]: Point[] } = {};
const antennasFlat: Antenna[] = [];

const antiNodes: { [key: string]: Point } = {};

lines.forEach((l, y) => {
  const chars = l.split('');
  chars.forEach((c, x) => {
    if (c !== '.') {
      antennas[c] = antennas[c] || [];
      antennas[c].push({ x, y });
      antennasFlat.push({ pos: { x, y }, name: c });
    }
  });
});

// fn from https://stackoverflow.com/a/1431113/2303432
function replaceChar(str, index, char) {
  return str.substring(0, index) + char + str.substring(index + char.length);
}

function drawMap() {
  for (let y = 0; y < dims.y; y++) {
    let row = '.'.repeat(dims.x);

    Object.values(antiNodes).forEach((a) => {
      if (y === a.y) {
        row = replaceChar(row, a.x, '#');
      }
    });

    antennasFlat.forEach((a) => {
      if (y === a.pos.y) row = replaceChar(row, a.pos.x, a.name);
    });

    if (row.length !== dims.x) throw `Invalid Map, should be ${dims.x}, not ${row.length}`;

    console.log(row);
  }
}

function findAntiNode(a1: Point, a2: Point): Point {
  const dX = a1.x - a2.x;
  const dY = a1.y - a2.y;

  return { x: a1.x + dX, y: a1.y + dY };
}

function addAntiNode(a1: Point, a2: Point) {
  const found = findAntiNode(a1, a2);
  if (insideBounds(found)) antiNodes[`${found.x}|${found.y}`] = found;
}

function insideBounds(point: Point) {
  return point.x >= 0 && point.x < dims.x && point.y >= 0 && point.y < dims.y;
}

Object.entries(antennas).forEach((e) => {
  const list = e[1];

  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length; j++) {
      if (i === j) continue;

      addAntiNode(list[i], list[j]);
    }
  }
});

// console.log(JSON.stringify(Object.keys(antiNodes).sort(), undefined, 2));

drawMap();

console.log(Object.keys(antiNodes).length);
