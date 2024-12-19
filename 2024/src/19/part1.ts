import { readFileSync } from 'fs';
import { join } from 'path';
import { stdout } from 'process';
import { Color, color } from '../util/utils';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const options: Set<string> = new Set();
const patterns: string[] = [];

let maxPattern: number = 0;
lines[0].split(', ').forEach((o) => {
  options.add(o);
  maxPattern = Math.max(maxPattern, o.length);
});

for (let i = 2; i < lines.length; i++) {
  patterns.push(lines[i]);
}

function solvePattern(pattern: string): boolean {
  let index = 0;
  let nextM = maxPattern;
  let retries = 0;

  const indicies: number[][] = [];

  while (index < pattern.length) {
    let anyMatch = false;

    for (let m = nextM; m > 0; m--) {
      const section = pattern.slice(index, index + m);

      // stdout.write(`checking ${section} `);

      if (options.has(section)) {
        // stdout.write(color('✓\n', Color.Green));

        indicies.push([index, m]);
        nextM = maxPattern;

        index += m;
        anyMatch = true;
        break;
      }
    }

    if (!anyMatch) {
      // if (!pattern.slice(index, index + maxPattern).startsWith('rur')) {
      // stdout.write(color(pattern.slice(0, index), Color.Green));
      // stdout.write(color(pattern.slice(index, index + maxPattern), Color.Red));
      // stdout.write(pattern.slice(index + maxPattern));
      // stdout.write(color(' x', Color.Red) + '\n');
      // }

      if (indicies.length > 0) {
        const revert = indicies.pop();
        index = revert[0];
        nextM = revert[1] - 1;

        retries++;

        // console.log('reverted back', index, nextM);
        if (retries < 10) continue;
      }

      return false;
    }
  }

  // stdout.write(color(pattern.slice(0, index), Color.Green) + '\n');

  return true;
}

let possible = 0;

// console.log(solvePattern(patterns[2]));
// console.log(patterns.length);

patterns.forEach((p) => {
  if (solvePattern(p)) possible++;
});

console.log(possible);
