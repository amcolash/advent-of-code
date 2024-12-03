import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const nextValues: number[] = [];
lines.forEach((line, l) => {
  const levels: number[][] = [];
  levels[0] = line.split(' ').map((c) => Number.parseInt(c));

  let i = 0;
  while (!levels[i].every((v) => v === 0)) {
    levels[i + 1] = [];

    const cur = levels[i];
    const next = levels[i + 1];

    for (let j = 0; j < cur.length - 1; j++) {
      const left = cur[j];
      const right = cur[j + 1];
      next.push(right - left);
    }

    i++;

    // console.log(levels);
  }

  // console.log(levels);

  let sum = 0;
  for (let i = levels.length - 1; i >= 0; i--) {
    sum = levels[i][0] - sum;
    // console.log(sum);
  }

  nextValues.push(sum);
});

console.log(nextValues.reduce((a, b) => a + b, 0));
