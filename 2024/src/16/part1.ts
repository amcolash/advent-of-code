import { Dir, readFileSync } from 'fs';
import { join } from 'path';
import { add, Point, pretty, Vector } from '../util/types';
import { stdout } from 'process';
import { Color, color, mod, shuffle } from '../util/utils';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const EMPTY = 0;
const WALL = 1;

const EAST = 0;
const NORTH = 90;
const WEST = 180;
const SOUTH = 270;

const DEBUG = false;

type Direction = 0 | 90 | 180 | 270;

const maze: number[][] = [];
const dims: Point = { x: 0, y: 0 };

const start: Point = { x: 0, y: 0 };
const end: Point = { x: 0, y: 0 };
const player: { pos: Vector; dir: Direction } = { pos: new Vector(0, 0), dir: EAST };

lines.forEach((l, y) => {
  maze[y] = [];

  l.split('').forEach((c, x) => {
    if (c === 'S') {
      start.x = x;
      start.y = y;
      player.pos.set({ x, y });
      maze[y][x] = EMPTY;
    } else if (c === 'E') {
      end.x = x;
      end.y = y;
      maze[y][x] = EMPTY;
    } else if (c === '#') {
      maze[y][x] = WALL;
    } else {
      maze[y][x] = EMPTY;
    }
  });
});

dims.y = maze.length;
dims.x = maze[0].length;

function drawMaze() {
  for (let y = 0; y < dims.y; y++) {
    for (let x = 0; x < dims.x; x++) {
      const value = maze[y][x];

      if (player.pos.x === x && player.pos.y === y) {
        let symbol;
        if (player.dir === NORTH) symbol = '^';
        else if (player.dir === SOUTH) symbol = 'v';
        else if (player.dir === EAST) symbol = '>';
        else if (player.dir === WEST) symbol = '<';

        stdout.write(color(symbol, Color.Cyan));
      } else if (start.x === x && start.y === y) stdout.write('S');
      else if (end.x === x && end.y === y) stdout.write('E');
      else if (value === EMPTY) stdout.write('.');
      else if (value === WALL) stdout.write('#');
    }

    stdout.write('\n');
  }
  stdout.write(`\nPath: ${path.length}\n`);
}

function drawPath(p?: { pos: Point; dir: Direction }[]) {
  const pathIn = p || path;

  for (let y = 0; y < dims.y; y++) {
    for (let x = 0; x < dims.x; x++) {
      const value = maze[y][x];

      const found = pathIn.find((p) => p.pos.x === x && p.pos.y === y);
      if (found) {
        let symbol;
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
  stdout.write(`\nPath: ${pathIn.length}, Score: ${calculateScore(pathIn)}\n`);
}

async function animateSolving() {
  drawMaze();
  console.log();

  await new Promise((res) => setTimeout(res, 250));
}

function rotate(dir?: number) {
  player.dir = mod(player.dir + 90 * (dir || 1), 360) as Direction;
}

function canMove(dir?: Direction): boolean {
  switch (dir !== undefined ? dir : player.dir) {
    case NORTH:
      const up = add(player.pos, { x: 0, y: -1 });
      return up.y >= 0 && maze[up.y][up.x] === EMPTY && !visited.has(`${up.x}|${up.y}`);
    case SOUTH:
      const down = add(player.pos, { x: 0, y: 1 });
      return down.y < dims.y && maze[down.y][down.x] === EMPTY && !visited.has(`${down.x}|${down.y}`);
    case EAST:
      const right = add(player.pos, { x: 1, y: 0 });
      return right.x < dims.x && maze[right.y][right.x] === EMPTY && !visited.has(`${right.x}|${right.y}`);
    case WEST:
      const left = add(player.pos, { x: -1, y: 0 });
      return left.x >= 0 && maze[left.y][left.x] === EMPTY && !visited.has(`${left.x}|${left.y}`);
  }

  throw `Player is not facing a valid direction, ${player.dir}`;
}

function move() {
  if (canMove()) {
    switch (player.dir) {
      case NORTH:
        if (DEBUG) console.log('moving north');
        player.pos.add({ x: 0, y: -1 });
        break;
      case SOUTH:
        if (DEBUG) console.log('moving south');
        player.pos.add({ x: 0, y: 1 });
        break;
      case EAST:
        if (DEBUG) console.log('moving east');
        player.pos.add({ x: 1, y: 0 });
        break;
      case WEST:
        if (DEBUG) console.log('moving west');
        player.pos.add({ x: -1, y: 0 });
        break;
    }
  } else {
    // console.log('cannot move');
  }
}

function calculateScore(p?: { pos: Point; dir: Direction }[]): number {
  const pathIn = p || path;

  let score = 0;

  score += pathIn.length - 1;

  let dir = EAST;
  pathIn.forEach((p) => {
    if (p.dir !== dir) {
      score += 1000;
      dir = p.dir;
    }
  });

  return score;
}

const visited: Set<string> = new Set();
let path: { pos: Point; dir: Direction }[] = [];

let tries = 0;

async function solveMaze() {
  visited.clear();
  path = [];
  player.pos.set(start);

  path.push({ pos: player.pos.toPoint(), dir: player.dir });
  if (DEBUG)
    console.log(
      player.pos.toString(),
      player.dir,
      path.map((p) => pretty(p.pos))
    );

  while (!player.pos.eq(end)) {
    const left = mod(player.dir + 90, 360) as Direction;
    const right = mod(player.dir - 90, 360) as Direction;
    const forward = player.dir;

    const order = [forward, left, right];
    if (Math.random() > 0.6) shuffle(order);

    let actionTaken = false;
    order.forEach((dir) => {
      if (canMove(dir) && !actionTaken) {
        if (dir === forward) {
          const found = path.find((p) => p.pos.x === player.pos.x && p.pos.y === player.pos.y);
          if (!found) path.push({ pos: player.pos.toPoint(), dir: player.dir });

          move();
          path.push({ pos: player.pos.toPoint(), dir: player.dir });
          visited.add(`${player.pos.x}|${player.pos.y}`);
        } else {
          rotate(dir === left ? 1 : -1);
        }

        actionTaken = true;
      }
    });

    if (!actionTaken) {
      if (path.length > 0) {
        const last = path.pop();

        player.pos.set(last.pos);
        player.dir = last.dir;

        if (DEBUG) console.log('backtracking');
      } else {
        throw 'stuck';
      }
    }

    if (DEBUG)
      console.log(
        player.pos.toString(),
        player.dir,
        path.map((p) => pretty(p.pos))
      );

    // await animateSolving();

    // if (path.length > 11) {
    //   drawPath();
    //   console.log(calculateScore());
    //   return;
    // }

    tries++;
    if (tries > Math.pow(dims.x * dims.y, 2)) throw 'Could not solve maze';
  }

  // drawPath();
  // console.log(path.map((p) => `${pretty(p.pos)}, ${p.dir}`));
}

// drawMaze();
// console.log(canMove());

// drawMaze();

async function solveMultiple() {
  let lowest = Number.MAX_VALUE;
  let bestPath: { pos: Point; dir: Direction }[];

  for (let i = 0; i < 5000; i++) {
    try {
      await solveMaze();
      const score = calculateScore();

      if (i % 10 === 0) console.log(i, score, lowest);

      if (score < lowest) {
        lowest = score;
        bestPath = [...path];
      }
    } catch (err) {
      // console.error(err);
    }
  }

  console.log('------------------');
  if (!bestPath) throw 'Failed to solve maze';
  drawPath(bestPath);
  console.log(lowest);
}

solveMultiple();
