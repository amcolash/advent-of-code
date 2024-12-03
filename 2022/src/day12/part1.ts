import { readFileSync } from 'fs';
import { join } from 'path';
import { stdout } from 'process';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.split('\n');

const level = lines.map((l) => l.split(''));

const height = lines.length;
const width = lines[0].length;

let start: Pos = [0, 0];
let end: Pos = [0, 0];

type Pos = [number, number];
type Dir = [number, number, string];

const N: Dir = [0, -1, '↑'];
const S: Dir = [0, 1, '↓'];
const E: Dir = [1, 0, '→'];
const W: Dir = [-1, 0, '←'];

// Find the start and end of the hill
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (level[y][x] === 'S') start = [x, y];
    if (level[y][x] === 'E') end = [x, y];
  }
}

// A little overkill, but allows drawing the maze and drawing a path through the maze
function drawMaze(path?: Dir[]) {
  let copy = JSON.parse(JSON.stringify(level));
  let pos = start;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (path) copy[y][x] = '.';

      if (start[0] === x && start[1] === y) copy[y][x] = 'S';
      if (end[0] === x && end[1] === y) copy[y][x] = 'E';
    }
  }

  if (path)
    path.forEach((d: Dir, i) => {
      copy[pos[1]][pos[0]] = d[2];
      pos = add(pos, d);
    });

  for (let y = 0; y < height; y++) {
    stdout.write('\n');
    for (let x = 0; x < width; x++) {
      stdout.write(copy[y][x]);
    }
  }

  stdout.write('\n');
}

function add(pos: Pos, dir: Dir): Pos {
  return [pos[0] + dir[0], pos[1] + dir[1]];
}

function getHeight(pos: Pos): number {
  const char = level[pos[1]][pos[0]];

  if (char === 'S') return 'a'.charCodeAt(0);
  if (char === 'E') return 'z'.charCodeAt(0);

  return char.charCodeAt(0);
}

function canMove(pos: Pos, dir: Dir): boolean {
  const newPos = add(pos, dir);

  // Keep inside bounds
  if (newPos[0] < 0 || newPos[0] >= width || newPos[1] < 0 || newPos[1] >= height) return false;

  return getHeight(newPos) <= getHeight(pos) + 1;
}

function hasVisited(pos: Pos, visited: Pos[]): boolean {
  for (const p of visited) {
    if (p[0] === pos[0] && p[1] === pos[1]) return true;
  }

  return false;
}

function dist(pos1: Pos, pos2: Pos): number {
  return (pos1[0] - pos2[0]) * (pos1[0] - pos2[0]) + (pos1[1] - pos2[1]) * (pos1[1] - pos2[1]);
}

function bestDirection(pos: Pos): Dir[] {
  return [N, S, W, E].sort((a, b) => {
    const distA = dist(add(pos, a), end);
    const distB = dist(add(pos, b), end);

    return distA - distB;
  });
}

const solutions: { path: Dir[]; count: number }[] = [];

let lowest = 9999999;

let counter = 0;
let distLow = 99999999;

function solveMaze(pos: Pos, count: number, path: Dir[], visited: Pos[]) {
  if (pos[0] === end[0] && pos[1] === end[1]) {
    lowest = Math.min(count, lowest);
    console.log(`Solution: ${count}, Best: ${lowest}`);

    solutions.push({ path, count });
  }

  const dirs = bestDirection(pos);
  dirs.forEach((d) => {
    const newPos = add(pos, d);

    if (canMove(pos, d) && !hasVisited(newPos, visited)) {
      distLow = Math.min(distLow, dist(pos, end));
      counter = (counter + 1) % 300000;
      if (counter === 0) {
        // console.log(Math.sqrt(distLow));
        drawMaze([...path, d]);
      }

      solveMaze(newPos, count + 1, [...path, d], [...visited, newPos]);
    }
  });
}

solveMaze(start, 0, [], []);

solutions.sort((a, b) => a.count - b.count);

console.log(solutions[0].count);
drawMaze(solutions[0].path);
