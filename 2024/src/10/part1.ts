import { readFileSync } from 'fs';
import { join } from 'path';
import { Point } from '../util/types';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const map: number[][] = [];
const dims: Point = { x: 0, y: 0 };
const peaks: Point[] = [];
const trailheads: Point[] = [];

lines.forEach((l, y) => {
  map[y] = [];
  l.split('').forEach((c, x) => {
    const value = Number(c);
    map[y][x] = value;

    if (value === 0) trailheads.push({ x, y });
    if (value === 9) peaks.push({ x, y });
  });

  // console.log(map[y]);
});

dims.x = map[0].length;
dims.y = map.length;

function insideBounds(point: Point) {
  return point.x >= 0 && point.x < dims.x && point.y >= 0 && point.y < dims.y;
}

const visited = {};

function findTrail(trailhead: Point, point: Point) {
  const value = map[point.y][point.x];

  if (
    value === 9 &&
    !visited[`${trailhead.x},${trailhead.y}`]?.includes(`${point.x},${point.y}`)
  ) {
    visited[`${trailhead.x},${trailhead.y}`] =
      visited[`${trailhead.x},${trailhead.y}`] || [];
    visited[`${trailhead.x},${trailhead.y}`].push(`${point.x},${point.y}`);

    score++;
    return;
  }

  const next = value + 1;

  const up: Point = { x: point.x, y: point.y - 1 };
  const down: Point = { x: point.x, y: point.y + 1 };
  const left: Point = { x: point.x - 1, y: point.y };
  const right: Point = { x: point.x + 1, y: point.y };

  if (insideBounds(up) && map[up.y][up.x] === next) findTrail(trailhead, up);
  if (insideBounds(down) && map[down.y][down.x] === next)
    findTrail(trailhead, down);
  if (insideBounds(left) && map[left.y][left.x] === next)
    findTrail(trailhead, left);
  if (insideBounds(right) && map[right.y][right.x] === next)
    findTrail(trailhead, right);
}

let score = 0;

trailheads.forEach((p) => {
  findTrail(p, p);
});

console.log(score);
