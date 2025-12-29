import { readFileSync } from 'fs';
import { join } from 'path';
import { Point, Vector } from '../util/types';
import { Color, color } from '../util/utils';
import { createEmptyGrid, printGrid } from '../util/grid';

const data = readFileSync(join(__dirname, 'sample1.txt')).toString();
const lines = data.trim().split('\n');

const dims = { x: 0, y: 0 };
const tiles: Vector[] = lines.map((l) => {
  const vec = Vector.fromString(l);
  dims.x = Math.max(vec.x, dims.x);
  dims.y = Math.max(vec.y, dims.y);
  return vec;
});

const grid = createEmptyGrid(dims.x + 2, dims.y + 2, '.');
for (let i = 0; i < tiles.length; i++) {
  grid[tiles[i].y][tiles[i].x] = '#';
}

const perimeter = {};

function getId(vec: Vector | Point): string {
  return `${vec.x},${vec.y}`;
}

tiles.push(tiles[0]);
for (let i = 0; i < tiles.length - 1; i++) {
  const tile = tiles[i];
  const next = tiles[i + 1];

  perimeter[getId(tile)] = true;

  if (tile.x === next.x) {
    let y = tile.y;
    const dir = Math.sign(next.y - tile.y);
    while (y !== next.y) {
      perimeter[getId({ x: tile.x, y })] = true;
      grid[y][tile.x] = '#';
      y += dir;
    }
  } else {
    let x = tile.x;
    const dir = Math.sign(next.x - tile.x);
    while (x !== next.x) {
      perimeter[getId({ x, y: tile.y })] = true;
      grid[tile.y][x] = '#';
      x += dir;
    }
  }
}

// function isValid(corner1: Vector, corner2: Vector): boolean {
//   const p1 = { x: corner1.x, y: corner1.y };
//   const p2 = { x: corner2.x, y: corner1.y };
//   const p3 = { x: corner2.x, y: corner2.y };
//   const p4 = { x: corner1.x, y: corner2.y };

//   // p1->p2
//   let dir = Math.sign(p2.x - p1.x);
//   for (let x = p1.x; x !== p2.x; x += dir) {
//     if (x === p1.x || x === p2.x) continue;
//     if (perimeter[getId({ x, y: p1.y })]) {
//       console.log('invalid p1->p2', `(${x}, ${p1.y})`);
//       grid[p1.y][x] = color('X', Color.Red);
//       return false;
//     }
//   }

//   // p2->p3
//   dir = Math.sign(p3.y - p2.y);
//   for (let y = p2.y; y !== p3.y; y += dir) {
//     if (y === p2.y || y === p3.y) continue;
//     if (perimeter[getId({ x: p2.x, y })]) {
//       console.log('invalid p2->p3', `(${p2.x}, ${y})`);
//       grid[y][p2.x] = color('X', Color.Red);
//       return false;
//     }
//   }

//   // p3->p4
//   dir = Math.sign(p4.x - p3.x);
//   for (let x = p3.x; x !== p4.x; x += dir) {
//     if (x === p3.x || x === p4.x) continue;
//     if (perimeter[getId({ x, y: p3.y })]) {
//       console.log('invalid p3->p4', `(${x}, ${p3.y})`);
//       grid[p3.y][x] = color('X', Color.Red);
//       return false;
//     }
//   }

//   // p4->p1
//   dir = Math.sign(p4.y - p1.y);
//   for (let y = p4.y; y !== p1.y; y += dir) {
//     if (y === p4.y || y === p1.y) continue;
//     if (perimeter[getId({ x: p4.x, y })]) {
//       console.log('invalid p4->p1', `(${p4.x}, ${y})`);
//       grid[y][p4.x] = color('X', Color.Red);
//       return false;
//     }
//   }

//   return true;
// }

// let max = { value: 0, t1: undefined, t2: undefined };
// // for (let i = 0; i < tiles.length; i++) {
// //   for (let j = 0; j < tiles.length; j++) {
// //     const t1 = tiles[i];
// //     const t2 = tiles[j];

// //     const area = t1.area(t2);
// //     const valid = isValid(t1, t2);

// //     if (area > max.value && valid) {
// //       max.value = area;
// //       max.t1 = t1;
// //       max.t2 = t2;
// //     }
// //   }
// // }
// console.log(max);

// https://bryceboe.com/2006/10/23/line-segment-intersection-algorithm/
function ccw(A, B, C) {
  return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
}

// https://bryceboe.com/2006/10/23/line-segment-intersection-algorithm/
function intersects(A, B, C, D) {
  console.log(A, B, '|', C, D, ccw(A, C, D) != ccw(B, C, D) && ccw(A, B, C) != ccw(A, B, D));
  return ccw(A, C, D) != ccw(B, C, D) && ccw(A, B, C) != ccw(A, B, D);
}

function isValid(corner1: Vector, corner2: Vector): boolean {
  const p1 = Vector.fromPoint({ x: corner1.x, y: corner1.y });
  const p2 = Vector.fromPoint({ x: corner2.x, y: corner1.y });
  const p3 = Vector.fromPoint({ x: corner2.x, y: corner2.y });
  const p4 = Vector.fromPoint({ x: corner1.x, y: corner2.y });

  for (let i = 0; i < tiles.length - 1; i++) {
    const tile = tiles[i];
    const next = tiles[i + 1];

    if (intersects(p1, p2, tile, next)) return false;
    if (intersects(p2, p3, tile, next)) return false;
    if (intersects(p3, p4, tile, next)) return false;
    if (intersects(p4, p1, tile, next)) return false;
  }

  return true;
}

// let max = { value: 0, t1: undefined, t2: undefined };
// for (let i = 0; i < tiles.length; i++) {
//   for (let j = 0; j < tiles.length; j++) {
//     const t1 = tiles[i];
//     const t2 = tiles[j];

//     const area = t1.area(t2);
//     const valid = isValid(t1, t2);

//     if (area > max.value && valid) {
//       max.value = area;
//       max.t1 = t1;
//       max.t2 = t2;
//     }
//   }
// }
// console.log(max);

console.log(isValid(Vector.fromPoint({ x: 9, y: 5 }), Vector.fromPoint({ x: 2, y: 3 })));

// printGrid(grid);
