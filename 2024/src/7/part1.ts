import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const equations: { total: number; values: number[] }[] = lines.map((l) => {
  const halves = l.split(': ');
  const total = Number(halves[0]);
  const values = halves[1].split(' ').map((n) => Number(n));

  return { total, values };
});

let total = 0;
equations.forEach((e) => {
  const numOperators = e.values.length - 1;
  const permutations = Math.pow(2, numOperators);

  for (let p = 0; p < permutations; p++) {
    let eqTotal = 0;

    // Go through each permutation as a number, get each bit to determine plus/times
    for (let o = 0; o < numOperators; o++) {
      const operation = (p >> o) & 1;

      const left = o === 0 ? e.values[0] : eqTotal;
      const right = e.values[o + 1];

      if (operation === 0) eqTotal = left + right;
      else eqTotal = left * right;
    }

    if (e.total === eqTotal) {
      // console.log('solved for', e.total);
      total += e.total;
      break;
    }
  }
});

console.log(total);
