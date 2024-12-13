import { readFileSync } from 'fs';
import { join } from 'path';
import { Point } from '../util/types';
import { stdout } from 'process';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

type Region = { label: string; points: Point[]; area: number; sides: number };

const regions: Region[] = [];
const visited: Set<string> = new Set<string>();

const map: string[][] = [];

lines.forEach((l, y) => {
  map[y] = [];
  l.split('').forEach((r, x) => {
    map[y][x] = r;
  });
});

const dims: Point = { x: map[0].length, y: map.length };

function findRegion(point: Point): Point[] {
  const { x, y } = point;
  const label = map[y][x];

  const shape: Point[] = [];
  shape.push(point);
  visited.add(`${x}|${y}`);

  const up = { x, y: y - 1 };
  if (map[up.y]?.[up.x] === label && !visited.has(`${up.x}|${up.y}`)) shape.push(...findRegion(up));

  const down = { x, y: y + 1 };
  if (map[down.y]?.[down.x] === label && !visited.has(`${down.x}|${down.y}`)) shape.push(...findRegion(down));

  const left = { x: x - 1, y };
  if (map[left.y][left.x] === label && !visited.has(`${left.x}|${left.y}`)) shape.push(...findRegion(left));

  const right = { x: x + 1, y };
  if (map[right.y][right.x] === label && !visited.has(`${right.x}|${right.y}`)) shape.push(...findRegion(right));

  // console.log({ label, up, down, left, right });

  return shape;
}

// console.log(findRegion({ x: 0, y: 1 }));

function generateShape(points: Point[], label?: string): string[][] {
  const shape = Array.from({ length: dims.y }, () => Array(dims.x).fill('.'));

  points.forEach((p) => (shape[p.y][p.x] = label || 'A'));

  return shape;
}

function calculateSides(shape: string[][]): number {
  let sides = 0;

  sides += checkVerticalSides(shape, -1);
  sides += checkVerticalSides(shape, 1);

  sides += checkHorizontalSides(shape, -1);
  sides += checkHorizontalSides(shape, 1);

  return sides;
}

function checkVerticalSides(shape: string[][], dir: -1 | 1): number {
  let sides = 0;

  let sideActive = false;
  for (let y = 0; y < dims.y; y++) {
    sideActive = false;

    for (let x = 0; x < dims.x; x++) {
      if (shape[y][x] !== '.' && shape[y + dir]?.[x] !== shape[y][x]) {
        sideActive = true;
      } else {
        if (sideActive) sides++;

        sideActive = false;
      }
    }

    if (sideActive) sides++;
  }

  return sides;
}

function checkHorizontalSides(shape: string[][], dir: -1 | 1): number {
  let sides = 0;

  let sideActive = false;
  for (let x = 0; x < dims.x; x++) {
    sideActive = false;

    for (let y = 0; y < dims.y; y++) {
      if (shape[y][x] !== '.' && shape[y][x + dir] !== shape[y][x]) {
        sideActive = true;
      } else {
        if (sideActive) sides++;

        sideActive = false;
      }
    }

    if (sideActive) sides++;
  }

  return sides;
}

function drawShape(shape: string[][]) {
  for (let y = 0; y < dims.y; y++) {
    for (let x = 0; x < dims.x; x++) {
      stdout.write(shape[y][x]);
    }
    stdout.write('\n');
  }
}

function drawRegion(region: Region) {
  const shape = generateShape(region.points, region.label);
  drawShape(shape);
}

for (let x = 0; x < dims.x; x++) {
  for (let y = 0; y < dims.y; y++) {
    if (!visited.has(`${x}|${y}`)) {
      const label = map[y][x];
      const found = findRegion({ x, y });

      const shape = generateShape(found, label);
      const sides = calculateSides(shape);

      const region: Region = { label, points: found, area: found.length, sides };
      regions.push(region);
    }
  }
}

// const toCheck = regions[4];

// drawRegion(toCheck);
// console.log(toCheck.sides);
// console.log();

let total = 0;
regions.forEach((r) => (total += r.area * r.sides));

console.log(total);
