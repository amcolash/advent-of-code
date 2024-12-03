import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const elfs = data.split('\n\n').map((e) => e.split('\n').map((n) => Number.parseInt(n)));

let counts: number[] = [];
elfs.forEach((e) => {
  let total = 0;
  e.forEach((c) => {
    total += c;
  });

  counts.push(total);
});

counts = counts.sort().reverse();

// Part 1
console.log('Part 1', counts[0]);

// Part 2
console.log('Part 2', counts[0] + counts[1] + counts[2]);
