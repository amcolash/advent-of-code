import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

let total = 0;
let enabled = true;

lines.forEach((line) => {
  const sets = Array.from(line.matchAll(/mul\(\d+,\d+\)|do\(\)|don't\(\)/g));

  for (let i = 0; i < sets.length; i++) {
    const set = sets[i].toString();

    if (set === 'do()') {
      enabled = true;
      continue;
    }
    if (set === "don't()") {
      enabled = false;
      continue;
    }

    const parsed = Array.from(set.matchAll(/(\d+),(\d+)/g))[0];
    const nums = [Number(parsed[1]), Number(parsed[2])];

    if (enabled) {
      total += Number(nums[0]) * Number(nums[1]);
    }
  }
});

console.log(total);
