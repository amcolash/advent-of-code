import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.split('\n');

let overlaps = 0;
for (let i = 0; i < lines.length; i++) {
  const matches = lines[i].match(/(\d+)-(\d+),(\d+)-(\d+)/);

  if (matches) {
    const firstStart = Number.parseInt(matches[1]);
    const firstEnd = Number.parseInt(matches[2]);
    const secondStart = Number.parseInt(matches[3]);
    const secondEnd = Number.parseInt(matches[4]);

    // Simple, but effective
    const MAXNUM = 100;
    const arr1 = Array(MAXNUM).fill(false);
    const arr2 = Array(MAXNUM).fill(false);

    for (let i = firstStart; i <= firstEnd; i++) {
      arr1[i] = true;
    }

    for (let i = secondStart; i <= secondEnd; i++) {
      arr2[i] = true;
    }

    // console.log(arr1.map((a, i) => (a ? i : '.')).join(''));
    // console.log(arr2.map((a, i) => (a ? i : '.')).join(''));
    // console.log();

    for (let i = 0; i < MAXNUM; i++) {
      if (arr1[i] && arr2[i]) {
        overlaps++;
        break;
      }
    }
  }
}

console.log(overlaps);
