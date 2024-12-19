import { readFileSync } from 'fs';
import { join } from 'path';
import { stdout } from 'process';
import { Color, color } from '../util/utils';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const options: string[] = [];
const patterns: string[] = [];

lines[0].split(', ').forEach((o) => {
  options.push(o);
});

for (let i = 2; i < lines.length; i++) {
  patterns.push(lines[i]);
}

const cache: { [key: string]: number } = {};

function countPattern(pattern: string): number {
  if (cache[pattern] !== undefined) return cache[pattern];

  let count = 0;

  // console.log(pattern);

  for (let i = 0; i < options.length; i++) {
    if (pattern === options[i]) {
      count++;
    } else if (pattern.startsWith(options[i])) count += countPattern(pattern.slice(options[i].length));
  }

  cache[pattern] = count;
  return count;
}

// let possible = 0;

// console.log(patterns[0], countPattern(patterns[0]));
// console.log(patterns.length);

let total = 0;
patterns.forEach((p) => {
  total += countPattern(p);
});

console.log(total);
