import { readFileSync } from 'fs';
import { join } from 'path';

function splitArray(arr: string[], size: number): string[] {
  const split = [];

  for (let i = 0; i < arr.length; i += size) {
    split.push(arr.slice(i, i + size).join(''));
  }

  return split;
}

function arraysEqual<T>(arr: Array<T>): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (arr[0] !== arr[i]) return false;
  }

  return true;
}

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const ranges = lines[0].split(',').map((r) => r.split('-').map((n) => Number.parseInt(n)));

let sum = 0;

ranges.forEach((r) => {
  for (let i = r[0]; i <= r[1]; i++) {
    const s = i.toString();
    const a = s.split('');
    const l = s.length;

    for (let j = 1; j < l; j++) {
      const chunks = splitArray(a, j);

      // console.log(i, chunks);

      if (arraysEqual(chunks)) {
        // console.log(i);
        sum += i;
        break;
      }
    }
  }
});

console.log();
console.log(sum);
