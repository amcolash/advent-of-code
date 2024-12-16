import { readFileSync } from 'fs';
import { join } from 'path';
import { Point, Vector } from '../util/types';
import { stdout } from 'process';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const EMPTY = 0;
const WALL = 1;
const BOX = 2;

const map: number[][] = [];
const dims: Point = { x: 0, y: 0 };
const robot: Vector = new Vector(0, 0);

let directionData: string[];
const directions: string[] = [];

for (let y = 0; y < lines.length; y++) {
  const l = lines[y];

  if (l.trim().length === 0) {
    directionData = lines.slice(y);
    break;
  }

  map[y] = [];

  for (let x = 0; x < l.length; x++) {
    const c = l[x];

    let value = EMPTY;
    if (c === '#') value = WALL;
    if (c === 'O') value = BOX;
    if (c === '@') {
      robot.x = x;
      robot.y = y;
    }

    map[y][x] = value;
  }
}

directionData.forEach((r) => {
  r.split('').forEach((d) => directions.push(d));
});

dims.y = map.length;
dims.x = map[0].length;

function drawMap() {
  stdout.write('\n0123456789\n');

  for (let y = 0; y < dims.y; y++) {
    for (let x = 0; x < dims.x; x++) {
      const value = map[y][x];

      if (robot.x === x && robot.y === y) {
        if (value === EMPTY) stdout.write('@');
        else stdout.write('?');
      } else if (value === EMPTY) stdout.write('.');
      else if (value === WALL) stdout.write('#');
      else if (value === BOX) stdout.write('O');
    }

    stdout.write('\n');
  }
  stdout.write('\n');
}

const UP = { x: 0, y: -1 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x: -1, y: 0 };
const RIGHT = { x: 1, y: 0 };

function tryShiftHorizontal(start: number, end: number, dir: number, y: number) {
  for (let i = start + dir; start < end ? i < end : i > end; i += dir) {
    const checkPos = { x: i, y };
    const v = map[checkPos.y][checkPos.x];

    if (v === WALL) {
      // console.log('blocked by wall', checkPos);
      break;
    }

    if (v === EMPTY) {
      // console.log('empty space to fill', checkPos);

      for (let j = i; j !== start; j -= dir) {
        map[y][j] = BOX;
      }

      map[y][start] = EMPTY;
      robot.set({ x: start, y });
      break;
    }
  }
}

function tryShiftVertical(start: number, end: number, dir: number, x: number) {
  for (let i = start + dir; start < end ? i < end : i > end; i += dir) {
    const checkPos = { x, y: i };
    const v = map[checkPos.y][checkPos.x];

    if (v === WALL) {
      // console.log('blocked by wall', checkPos);
      break;
    }

    if (v === EMPTY) {
      // console.log('empty space to fill', checkPos);

      for (let j = i; j !== start; j -= dir) {
        map[j][x] = BOX;
      }

      map[start][x] = EMPTY;
      robot.set({ x, y: start });
      break;
    }
  }
}

function moveRobot(d: string) {
  let direction: Point;

  if (d === '^') direction = UP;
  if (d === 'v') direction = DOWN;
  if (d === '<') direction = LEFT;
  if (d === '>') direction = RIGHT;

  const newPos = robot.clone().add(direction);
  const mapValue = map[newPos.y][newPos.x];

  if (mapValue === EMPTY) robot.set(newPos);
  if (mapValue === BOX) {
    const horizontal = Math.abs(direction.x) > 0;
    const start = horizontal ? newPos.x : newPos.y;
    const dir = horizontal ? direction.x : direction.y;
    const end = dir > 0 ? (horizontal ? dims.x : dims.y) : 0;

    if (horizontal) tryShiftHorizontal(start, end, dir, newPos.y);
    else tryShiftVertical(start, end, dir, newPos.x);
  }
}

directions.forEach((d) => {
  moveRobot(d);
});
// drawMap();
// map.forEach((r) => console.log(r));
// console.log(robot.toString());

let total = 0;
map.forEach((row, y) => {
  row.forEach((col, x) => {
    if (col === BOX) total += x + 100 * y;
  });
});
console.log(total);
