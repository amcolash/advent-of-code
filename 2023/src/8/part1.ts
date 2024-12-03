import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const steps = lines[0].split('');
const mapping: { [location: string]: { left: string; right: string } } = {};

lines.forEach((line, i) => {
  if (i > 1) {
    const matches = line.match(/(\w+)\s+=\s+\((\w+),\s+(\w+)\)/);
    if (!matches) throw `Error parsing line ${line}`;
    const [_, name, a, b] = matches;

    mapping[name] = { left: a, right: b };
  }
});

let current = 'AAA';
let i = 0;
let total = 0;
while (current !== 'ZZZ') {
  const step = steps[i];

  const { left, right } = mapping[current];
  if (step === 'L') current = left;
  else current = right;

  total++;

  i = (i + 1) % steps.length;
}

console.log(total);
