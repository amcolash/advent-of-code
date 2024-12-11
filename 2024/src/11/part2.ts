import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const stones = lines[0].split(' ').map((s) => Number(s));

// const blinks = 1;
// const blinks = 6;
// const blinks = 25;
const blinks = 75;

const lookup: { [key: string]: number[] } = {};

function recursiveDepthCount(stone: number, depth: number): number {
  if (lookup[stone]?.[depth]) {
    return lookup[stone][depth];
  }

  if (depth < 0) return 0;
  if (depth === 0) return 1;

  // console.log(stone, depth);

  const numDigits = stone.toString().length;

  if (stone === 0) {
    const result = recursiveDepthCount(1, depth - 1);

    lookup[1] = lookup[1] || [];
    lookup[1][depth - 1] = result;

    return result;
  } else if (numDigits % 2 === 0) {
    const middle = numDigits / 2;
    const left = Number(stone.toString().substring(0, middle));
    const right = Number(stone.toString().substring(middle));

    const leftResult = recursiveDepthCount(left, depth - 1);
    lookup[left] = lookup[left] || [];
    lookup[left][depth - 1] = leftResult;

    const rightResult = recursiveDepthCount(right, depth - 1);
    lookup[right] = lookup[right] || [];
    lookup[right][depth - 1] = rightResult;

    return leftResult + rightResult;
  } else {
    const result = recursiveDepthCount(stone * 2024, depth - 1);

    lookup[stone * 2024] = lookup[stone * 2024] || [];
    lookup[stone * 2024][depth - 1] = result;

    return result;
  }
}

let count = 0;
stones.forEach((stone) => {
  count += recursiveDepthCount(stone, blinks);
});

// console.log();
console.log(count);

// --------------------- working but slow - recursion w/o lookup -----------------------------

// let count = 0;

// function recursiveDepthCount(stone: number, depth: number) {
//   if (depth < 0) return;

//   if (depth === 0) {
//     count++;
//     // stdout.write(`${stone} `);

//     if (count % 10000000 === 0) console.log(count);

//     return;
//   }

//   // console.log(stone, depth);

//   const numDigits = stone.toString().length;

//   if (stone === 0) recursiveDepthCount(1, depth - 1);
//   else if (numDigits % 2 === 0) {
//     const middle = numDigits / 2;
//     const left = Number(stone.toString().substring(0, middle));
//     const right = Number(stone.toString().substring(middle));

//     recursiveDepthCount(left, depth - 1);
//     recursiveDepthCount(right, depth - 1);
//   } else {
//     recursiveDepthCount(stone * 2024, depth - 1);
//   }
// }

// stones.forEach((stone) => {
//   recursiveDepthCount(stone, blinks);
// });

// // recursiveDepthCount(125, 6);
// // recursiveDepthCount(17, 6);

// console.log();
// console.log(count);

// --------------------- working but really slow and will run out of memory - make arrays + precompute the first 41 layers -----------------------------

// // const blinks = 1;
// // const blinks = 6;
// // const blinks = 25;
// const precompute = 41;
// const blinks = 75 - precompute;

// // Precompute a section to reduce overall memory use later
// for (let i = 0; i < precompute; i++) {
//   console.log(i);

//   const updated = [];

//   stones.forEach((stone) => {
//     const numDigits = stone.toString().length;

//     if (stone === 0) updated.push(1);
//     else if (numDigits % 2 === 0) {
//       const middle = numDigits / 2;
//       const left = stone.toString().substring(0, middle);
//       const right = stone.toString().substring(middle);

//       updated.push(Number(left));
//       updated.push(Number(right));
//     } else {
//       updated.push(stone * 2024);
//     }
//   });

//   stones = updated;
// }

// console.log(stones.length);

// // Do actual computing work
// let sum = 0;

// for (let r = 0; r < stones.length; r++) {
//   const rootStone = stones[r];
//   console.log(r, r / stones.length);

//   let section = [rootStone];
//   for (let b = 0; b < blinks; b++) {
//     let updated = [];
//     for (let s = 0; s < section.length; s++) {
//       const stone = section[s];

//       if (stone === 0) updated.push(1);
//       else if (stone.toString().length % 2 === 0) {
//         const numDigits = stone.toString().length;
//         const middle = numDigits / 2;
//         const left = stone.toString().substring(0, middle);
//         const right = stone.toString().substring(middle);

//         updated.push(Number(left));
//         updated.push(Number(right));
//       } else {
//         updated.push(stone * 2024);
//       }
//     }

//     section = updated;
//     if (b === blinks - 1) sum += section.length;
//   }
// }

// console.log(sum);
