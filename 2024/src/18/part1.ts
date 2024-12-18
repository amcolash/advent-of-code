import { readFileSync } from 'fs';
import { join } from 'path';
import { add, Point } from '../util/types';
import { Color, color, createEmptyGrid } from '../util/utils';
import { stdout } from 'process';

const file = 'input.txt';

const data = readFileSync(join(__dirname, file)).toString();
const lines = data.trim().split('\n');

const EMPTY = '.';
const WALL = '#';

const dims: Point = { x: 0, y: 0 };
const memory: Point[] = lines.map((l) => {
  const numbers = l.split(',').map((v) => Number(v));

  dims.x = Math.max(dims.x, numbers[0] + 1);
  dims.y = Math.max(dims.y, numbers[1] + 1);

  return { x: numbers[0], y: numbers[1] };
});

const start: Point = { x: 0, y: 0 };
const end: Point = { x: dims.x - 1, y: dims.y - 1 };

const fallenBytes = file === 'input.txt' ? 1024 : 12;

const maze = createEmptyGrid(dims.x, dims.y, EMPTY);

for (let f = 0; f < fallenBytes; f++) {
  if (memory.length > f) {
    const { x, y } = memory[f];
    maze[y][x] = '#';
  }
}

function drawPath(path: Point[]) {
  for (let y = 0; y < dims.y; y++) {
    for (let x = 0; x < dims.x; x++) {
      const value = maze[y][x];

      const found = path.find((p) => p.x === x && p.y === y);
      if (found) {
        let symbol = 'O';
        stdout.write(color(symbol, Color.Cyan));
      } else if (start.x === x && start.y === y) stdout.write(color('S', Color.Yellow));
      else if (end.x === x && end.y === y) stdout.write(color('E', Color.Yellow));
      else stdout.write(value);
    }

    stdout.write('\n');
  }
  stdout.write(`\nPath: ${path.length}\n`);
}

function drawVisited(visited: Set<string>) {
  for (let y = 0; y < dims.y; y++) {
    for (let x = 0; x < dims.x; x++) {
      const value = maze[y][x];

      const found = visited.has(`${x}|${y}`);
      if (found) {
        stdout.write(color('*', Color.Cyan));
      } else if (start.x === x && start.y === y) stdout.write(color('S', Color.Yellow));
      else if (end.x === x && end.y === y) stdout.write(color('E', Color.Yellow));
      else stdout.write(value);
    }

    stdout.write('\n');
  }
}

function canMove(point: Point, visited: Set<string>): boolean {
  return (
    point.x >= 0 &&
    point.x < dims.x &&
    point.y >= 0 &&
    point.y < dims.y &&
    maze[point.y][point.x] === EMPTY &&
    !visited.has(`${point.x}|${point.y}`)
  );
}

function generatePath(solution: PointWithParent): Point[] {
  const points: Point[] = [];
  while (solution.parent) {
    points.push({ x: solution.x, y: solution.y });
    solution = solution.parent;
  }
  points.reverse();

  return points;
}

type PointWithParent = { x: number; y: number; parent?: PointWithParent };

async function solveMaze() {
  const visited: Set<string> = new Set();
  const queue: PointWithParent[] = [];

  queue.push({ x: start.x, y: start.y });

  let solution;

  while (queue.length > 0) {
    const next = queue.pop();

    if (next.x === end.x && next.y === end.y) {
      solution = next;
      break;
    } else {
      const dirs = [add(next, { x: 0, y: -1 }), add(next, { x: 0, y: 1 }), add(next, { x: -1, y: 0 }), add(next, { x: 1, y: 0 })];

      dirs.forEach((d) => {
        if (canMove(d, visited)) {
          visited.add(`${d.x}|${d.y}`);
          queue.unshift({ ...d, parent: next });
        }
      });
    }

    // drawVisited(visited);
    // await new Promise((res) => setTimeout(res, 250));
  }

  const path = generatePath(solution);
  drawPath(path);
}

solveMaze();
