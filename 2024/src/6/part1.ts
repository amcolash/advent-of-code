import { readFileSync } from 'fs';
import { join } from 'path';
import { Point } from '../util/types';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const map: boolean[][] = [];
const visited: boolean[][] = [];
let dims: Point = { x: 0, y: 0 };

let guard: Point = { x: 0, y: 0 };

enum Dir {
  Right,
  Down,
  Left,
  Up,
}

let dir: Dir;

const dirs: { [dir: string]: Point } = {
  [Dir.Up]: { x: 0, y: -1 },
  [Dir.Down]: { x: 0, y: 1 },
  [Dir.Left]: { x: -1, y: 0 },
  [Dir.Right]: { x: 1, y: 0 },
};

lines.forEach((l, y) => {
  map[y] = [];
  visited[y] = [];

  const row = l.split('');
  row.forEach((c, x) => {
    if (c === '^') {
      guard.x = x;
      guard.y = y;
      dir = Dir.Up;
    }

    if (c === '#') {
      map[y][x] = true;
    } else {
      map[y][x] = false;
    }

    visited[y][x] = false;
  });
});

if (dir === undefined) throw 'Could not find guard!';

dims = { x: map[0].length, y: map.length };
visited[guard.y][guard.x] = true;

function getNewPos(): Point {
  return { x: guard.x + dirs[dir].x, y: guard.y + dirs[dir].y };
}

function drawMap(withVisited?: boolean) {
  for (let y = 0; y < dims.y; y++) {
    let row = '';

    for (let x = 0; x < dims.x; x++) {
      if (guard.x === x && guard.y === y) {
        if (withVisited) row += 'X';
        else if (dir === Dir.Up) row += '^';
        else if (dir === Dir.Down) row += 'v';
        else if (dir === Dir.Left) row += '<';
        else row += '>';
      } else if (map[y][x]) row += '#';
      else {
        if (withVisited && visited[y][x]) row += 'X';
        else row += '.';
      }
    }

    console.log(row);
  }

  console.log();
}

function inside(pos) {
  return pos.x >= 0 && pos.x < dims.x && pos.y >= 0 && pos.y < dims.y;
}

// drawMap();

let itr = 0;
while (inside(guard)) {
  const newPos = getNewPos();

  if (!inside(newPos)) break;

  // Blocked
  if (map[newPos.y][newPos.x]) {
    dir = (dir + 1) % 4;
    // drawMap();

    // Move
  } else {
    guard.x = newPos.x;
    guard.y = newPos.y;

    visited[guard.y][guard.x] = true;
  }

  itr++;
  if (itr > 50000) throw 'Failed to get out!';
}

// drawMap();
drawMap(true);

let total = 0;

for (let y = 0; y < dims.y; y++) {
  for (let x = 0; x < dims.x; x++) {
    if (visited[y][x]) total++;
  }
}

console.log(total);
