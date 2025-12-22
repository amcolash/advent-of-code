import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const ranges = lines[0].split(',').map(r => r.split('-').map(n => Number.parseInt(n)))

let sum = 0;

ranges.forEach(r => {
  for (let i = r[0]; i <= r[1]; i++) {
    const s = i.toString();
    const l = s.length;

    if (l % 2 == 0) {
      if (s.substring(0, l / 2) === s.substring(l/2, l)) {
        // console.log(i);
        sum += i;
      }
    }
  }
});

console.log();
console.log(sum);