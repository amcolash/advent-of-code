import { readFileSync } from 'fs';
import { join } from 'path';
import { add, Point } from '../util/types';
import { stdout } from 'process';
import { Color, color } from '../util/utils';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const EMPTY = 0;
const WALL = 1;

const EAST = 0;
const NORTH = 90;
const WEST = 180;
const SOUTH = 270;

type Direction = 0 | 90 | 180 | 270;
type PointWithDir = { x: number; y: number; dir: Direction };
type PointWithParent = { x: number; y: number; parent?: PointWithParent };

const maze: number[][] = [];
const dims: Point = { x: 0, y: 0 };

const start: Point = { x: 0, y: 0 };
const end: Point = { x: 0, y: 0 };

lines.forEach((l, y) => {
  maze[y] = [];

  l.split('').forEach((c, x) => {
    maze[y][x] = EMPTY;

    if (c === 'S') {
      start.x = x;
      start.y = y;
    } else if (c === 'E') {
      end.x = x;
      end.y = y;
    } else if (c === '#') {
      maze[y][x] = WALL;
    }
  });
});

dims.y = maze.length;
dims.x = maze[0].length;

function key(p: Point): string {
  return `${p.x}|${p.y}`;
}

function drawPath(path: PointWithDir[]) {
  for (let y = 0; y < dims.y; y++) {
    for (let x = 0; x < dims.x; x++) {
      const value = maze[y][x];

      const found = path.find((p) => p.x === x && p.y === y);
      if (found) {
        let symbol = 'X';
        if (found.dir === NORTH) symbol = '^';
        else if (found.dir === SOUTH) symbol = 'v';
        else if (found.dir === EAST) symbol = '>';
        else if (found.dir === WEST) symbol = '<';

        stdout.write(color(symbol, Color.Cyan));
      } else if (start.x === x && start.y === y) stdout.write('S');
      else if (end.x === x && end.y === y) stdout.write('E');
      else if (value === EMPTY) stdout.write('.');
      else if (value === WALL) stdout.write('#');
    }

    stdout.write('\n');
  }
  stdout.write(`\nPath: ${path.length}, Score: ${calculateScore(path)}\n`);
}

function drawVisited(visited: Set<string>) {
  for (let y = 0; y < dims.y; y++) {
    for (let x = 0; x < dims.x; x++) {
      const value = maze[y][x];

      const found = visited.has(`${x}|${y}`);
      if (found) {
        stdout.write(color('*', Color.Cyan));
      } else if (start.x === x && start.y === y) stdout.write('S');
      else if (end.x === x && end.y === y) stdout.write('E');
      else if (value === EMPTY) stdout.write('.');
      else if (value === WALL) stdout.write('#');
    }

    stdout.write('\n');
  }
}

function getCost(point1: Point, point2: Point): number {}

function calculateScore(path: PointWithDir[]): number {
  let score = 0;

  score += path.length;

  let dir = EAST;
  path.forEach((p) => {
    if (p.dir !== dir) {
      score += 1000;
      dir = p.dir;
    }
  });

  return score;
}

function solveMaze() {
  const visited: Set<string> = new Set();
  const unvisited: Set<string> = new Set();
  const data: { [key: string]: { point: Point; dist: number; prev?: string } } = {};

  for (let x = 0; x < dims.x; x++) {
    for (let y = 0; y < dims.y; y++) {
      if (maze[y][x] === EMPTY) {
        unvisited.add(`${x}|${y}`);
        data[`${x}|${y}`] = { point: { x, y }, dist: Number.MAX_SAFE_INTEGER };
      }
    }
  }

  let current = data[key(start)];
  current.dist = 0;

  while (unvisited.size > 0) {
    const up = add(current.point, { x: 0, y: -1 });
    const down = add(current.point, { x: 0, y: 1 });
    const left = add(current.point, { x: -1, y: 0 });
    const right = add(current.point, { x: 1, y: 0 });

    const dirs = [up, down, left, right].map((d) => ({ point: d, cost: getCost(current.point, d) })).sort((a, b) => b.cost - a.cost);

    dirs.forEach((d) => {
      if (canMove(d, visited)) {
        const isEnd = d.x === end.x && d.y === end.y;

        if (!isEnd) visited.add(key(d));

        queue.unshift({ ...d, parent: next });
      }
    });
  }

  // while (queue.length > 0) {
  //   const next = queue.pop();

  //   if (next.x === end.x && next.y === end.y) {
  //     solutions.push(next);
  //   } else {
  //     const dirs = [add(next, { x: 0, y: -1 }), add(next, { x: 0, y: 1 }), add(next, { x: -1, y: 0 }), add(next, { x: 1, y: 0 })];

  //     dirs.forEach((d) => {
  //       if (canMove(d, visited)) {
  //         const isEnd = d.x === end.x && d.y === end.y;

  //         if (!isEnd) visited.add(`${d.x}|${d.y}`);

  //         queue.unshift({ ...d, parent: next });
  //       }
  //     });
  //   }

  //   // drawVisited(visited);
  //   // await new Promise((res) => setTimeout(res, 250));
  // }
  // console.log(solutions.length);

  // let best = Number.MAX_SAFE_INTEGER;

  // solutions.forEach((s) => {
  //   const path = generatePath(s);
  //   const score = calculateScore(path);

  //   best = Math.min(best, score);
  //   // drawPath(path);
  // });

  // console.log(best);

  // console.log(solutions.length);
  // return solutions[0];
}

function canMove(point: Point, visited: Set<string>): boolean {
  return (
    point.x >= 0 && point.x < dims.x && point.y >= 0 && point.y < dims.y && maze[point.y][point.x] === EMPTY && !visited.has(key(point))
  );
}

function getDir(point1: Point, point2: Point): Direction {
  if (!point1 || !point2) return;

  if (point1.x > point2.x) return WEST;
  if (point1.x < point2.x) return EAST;
  if (point1.y > point2.y) return NORTH;
  if (point1.y < point2.y) return SOUTH;
}

function generatePath(point: PointWithParent): PointWithDir[] {
  const points: Point[] = [];
  while (point.parent) {
    points.push({ x: point.x, y: point.y });
    point = point.parent;
  }
  points.reverse();

  const path: PointWithDir[] = [];
  let dir: Direction = EAST;

  for (let i = 0; i < points.length; i++) {
    const newDir = getDir(points[i], points[i + 1]);
    dir = newDir !== undefined ? newDir : dir;

    path.push({ x: points[i].x, y: points[i].y, dir });
  }

  return path;
}

let found = solveMaze();
// const path = generatePath(found);

// drawPath(path);
// console.log(path);
