import { readFileSync } from 'fs';
import { join } from 'path';
import { stdout } from 'process';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.split('\n');

const head = { x: 0, y: 0 };
const tail = { x: 0, y: 0 };

let xMin = 0;
let xMax = 0;
let yMin = 0;
let yMax = 0;

const visited = new Set<string>();

const debug = false;

lines.forEach((l, i) => {
  if (debug) console.log(`----- ${l} -----\n`);

  const split = l.split(' ');
  const dir = split[0];
  const amt = Number.parseInt(split[1]);

  for (let j = 0; j < amt; j++) {
    if (dir === 'U') head.y++;
    if (dir === 'D') head.y--;
    if (dir === 'R') head.x++;
    if (dir === 'L') head.x--;

    xMin = Math.min(xMin, head.x);
    xMax = Math.max(xMax, head.x);
    yMin = Math.min(yMin, head.y);
    yMax = Math.max(yMax, head.y);

    solveTail(dir);

    if (debug) drawGrid();
    if (debug) console.log();
  }
});

console.log(visited.size);

function drawGrid() {
  for (let y = yMax - 1; y >= yMin; y--) {
    for (let x = xMin; x < xMax; x++) {
      if (head.x === x && head.y === y) stdout.write('H');
      else if (tail.x === x && tail.y === y) stdout.write('T');
      else if (x === 0 && y === 0) stdout.write('S');
      else stdout.write('.');
    }

    if (y === yMax - 1) stdout.write(`   Head: (${head.x}, ${head.y})`);
    if (y === yMax - 2) stdout.write(`   Tail: (${tail.x}, ${tail.y})`);

    stdout.write('\n');
  }
}

// function drawVisited() {
//   let total = 0;

//   for (let y = yMax - 1; y >= yMin; y--) {
//     for (let x = xMin; x < xMax; x++) {
//       if (x === 0 && y === 0) stdout.write('S');
//       else stdout.write(visited[y][x] ? '#' : '.');

//       if (visited[y][x]) total++;
//     }

//     stdout.write('\n');
//   }

//   console.log(total);
// }

function solveTail(dir: string) {
  const diagonal = Math.pow(head.x - tail.x, 2) + Math.pow(head.y - tail.y, 2) > 2;

  if (diagonal) {
    if (dir === 'U' || dir === 'D') {
      if (head.x - tail.x > 0) tail.x++;
      if (head.x - tail.x < 0) tail.x--;
    }

    if (dir === 'L' || dir === 'R') {
      if (head.y - tail.y > 0) tail.y++;
      if (head.y - tail.y < 0) tail.y--;
    }
  }

  if (Math.abs(head.x - tail.x) > 1) {
    if (head.x - tail.x > 1) tail.x++;
    if (head.x - tail.x < 1) tail.x--;
  }

  if (Math.abs(head.y - tail.y) > 1) {
    if (head.y - tail.y > 1) tail.y++;
    if (head.y - tail.y < 1) tail.y--;
  }

  visited.add(tail.x + '|' + tail.y);
}
