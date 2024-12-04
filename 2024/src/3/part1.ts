import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

let total = 0;

lines.forEach((line) => {
  const sets = Array.from(line.matchAll(/mul\(\d+,\d+\)/g));

  sets.forEach((set) => {
    const parsed = Array.from(set.toString().matchAll(/(\d+),(\d+)/g))[0];
    const nums = [Number(parsed[1]), Number(parsed[2])];

    total += Number(nums[0]) * Number(nums[1]);
  });
});

console.log(total);
