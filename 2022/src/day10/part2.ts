import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.split('\n');

let cycles = 0;
let x = 1;
let mem = '';

lines.forEach((l, i) => {
  draw(i, l);
  if (l === 'noop') {
    cycles++;
  } else if (l.includes('addx')) {
    const number = l.match(/-?\d+/);
    if (number) {
      cycles++;
      draw(i, l);
      cycles++;

      x += Number.parseInt(number[0]);
    } else {
      throw `Could not find number in instrction ${l}`;
    }
  } else {
    throw `Invalid instruction ${l}`;
  }
});

console.log(mem);

function replace(str: string, index: number, replacement: string): string {
  return str.substring(0, index) + replacement + str.substring(index + replacement.length);
}

function draw(i: number, l: string) {
  const pos = cycles % 40;
  const active = x === pos || x === pos + 1 || x === pos - 1;

  // if (cycles < 20) {
  //   let sprite: string = '.'.repeat(40);
  //   sprite = replace(sprite, x - 1, '#');
  //   sprite = replace(sprite, x, '#');
  //   sprite = replace(sprite, x + 1, '#');

  //   // console.log(sprite);
  //   // console.log(l);
  //   // console.log(cycles, pos, x, active ? '#' : '.', '\n');

  //   console.log(cycles, x);

  //   mem += active ? '#' : '.';
  // }

  // console.log(pos);

  if (pos === 0 && cycles !== 0) process.stdout.write('\n');
  process.stdout.write(active ? '#' : '.');
}
