import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const banks = lines.map((l) => l.split('').map((n) => Number.parseInt(n)));

let total = 0;

banks.forEach((bank) => {
  const sorted = [...bank].sort().reverse();

  for (let i = 0; i < sorted.length; i++) {
    const first = sorted[i];
    const index = bank.indexOf(first);

    const subarray = bank.slice(index + 1);
    const sortedSub = [...subarray].sort().reverse();

    const second = sortedSub[0];

    if (second !== undefined) {
      const val = Number.parseInt(first.toString() + second.toString());
      // console.log(val);

      total += val;

      break;
    }
  }
});

console.log();
console.log(total);
