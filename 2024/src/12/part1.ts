import { readFileSync } from 'fs';
import { join } from 'path';
import { Point } from '../util/types';
import { stdout } from 'process';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

type Region = { label: string; points: Point[]; area: number; perimeter: number };

const regions: Region[] = [];
const visited: string[] = [];

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
  visited.push(`${x}|${y}`);

  const up = { x, y: y - 1 };
  if (map[up.y]?.[up.x] === label && !visited.includes(`${up.x}|${up.y}`)) shape.push(...findRegion(up));

  const down = { x, y: y + 1 };
  if (map[down.y]?.[down.x] === label && !visited.includes(`${down.x}|${down.y}`)) shape.push(...findRegion(down));

  const left = { x: x - 1, y };
  if (map[left.y][left.x] === label && !visited.includes(`${left.x}|${left.y}`)) shape.push(...findRegion(left));

  const right = { x: x + 1, y };
  if (map[right.y][right.x] === label && !visited.includes(`${right.x}|${right.y}`)) shape.push(...findRegion(right));

  // console.log({ label, up, down, left, right });

  return shape;
}

// console.log(findRegion({ x: 0, y: 1 }));

function generateShape(points: Point[], label?: string): string[][] {
  const shape = Array.from({ length: dims.y }, () => Array(dims.x).fill('.'));

  points.forEach((p) => (shape[p.y][p.x] = label || 'A'));

  return shape;
}

function calculatePerimeter(shape: string[][]): number {
  let perimeter = 0;

  for (let y = 0; y < dims.y; y++) {
    for (let x = 0; x < dims.x; x++) {
      if (shape[y][x] !== '.') {
        const up = shape[y - 1]?.[x];
        if (!up || up === '.') perimeter++;

        const down = shape[y + 1]?.[x];
        if (!down || down === '.') perimeter++;

        const left = shape[y][x - 1];
        if (!left || left === '.') perimeter++;

        const right = shape[y][x + 1];
        if (!right || right === '.') perimeter++;
      }
    }
  }

  return perimeter;
}

function drawRegion(region: Region) {
  const shape = generateShape(region.points, region.label);

  for (let y = 0; y < dims.y; y++) {
    for (let x = 0; x < dims.x; x++) {
      stdout.write(shape[y][x]);
    }
    stdout.write('\n');
  }
}

for (let x = 0; x < dims.x; x++) {
  for (let y = 0; y < dims.y; y++) {
    if (!visited.includes(`${x}|${y}`)) {
      const label = map[y][x];
      const found = findRegion({ x, y });

      const shape = generateShape(found, label);
      const perimeter = calculatePerimeter(shape);

      const region: Region = { label, points: found, area: found.length, perimeter };
      regions.push(region);
    }
  }
}

let total = 0;
regions.forEach((r) => (total += r.area * r.perimeter));

console.log(total);
