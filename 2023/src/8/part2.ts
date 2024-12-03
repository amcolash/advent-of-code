import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

// Helpers function from: https://stackoverflow.com/a/61352020
const gcd = (a, b) => (b == 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a / gcd(a, b)) * b;

const steps = lines[0].split('');
const mapping: { [location: string]: { left: string; right: string } } = {};

const current: string[] = [];
lines.forEach((line, i) => {
  if (i > 1) {
    const matches = line.match(/(\w+)\s+=\s+\((\w+),\s+(\w+)\)/);
    if (!matches) throw `Error parsing line ${line}`;
    const [_, name, a, b] = matches;

    if (name.endsWith('A')) current.push(name);

    mapping[name] = { left: a, right: b };
  }
});

console.log(current.length, 'total items');

const tries = [];

// console.log(current);
current.forEach((c, i) => {
  let cur = c;
  let j = 0;
  while (!cur.endsWith('Z')) {
    const step = steps[j];
    if (step === 'L') cur = mapping[cur].left;
    else cur = mapping[cur].right;

    tries[i] = tries[i] || 0;
    tries[i]++;

    j = (j + 1) % steps.length;
  }
});

let total: number = tries[0];
for (let i = 1; i < tries.length; i++) {
  total = lcm(total, tries[i]);
}

console.log(total);
