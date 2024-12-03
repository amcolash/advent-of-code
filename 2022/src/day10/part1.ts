import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.split('\n');

let cycles = 0;
let x = 1;
let total = 0;

lines.forEach((l, i) => {
  if (l === 'noop') {
    cycles++;
    inspect(i);
  } else if (l.includes('addx')) {
    const number = l.match(/-?\d+/);
    if (number) {
      cycles++;
      inspect(i);
      cycles++;
      inspect(i);

      x += Number.parseInt(number[0]);
    } else {
      throw `Could not find number in instrction ${l}`;
    }
  } else {
    throw `Invalid instruction ${l}`;
  }
});

function inspect(i: number) {
  if ((cycles === 20 || (cycles - 20) % 40 === 0) && cycles !== 240) {
    total += x * cycles;
    console.log(`x: ${x}, cycles: ${cycles}, lineNumber: ${i}`);
  }
}

console.log(total);
