import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

let total = 0;
lines.forEach((line) => {
  const matches = line.match(/(\d)/g);

  if (matches && matches.length > 0) {
    const first = Number.parseInt(matches[0]);
    const last = Number.parseInt(matches[matches.length - 1]);

    const number = Number.parseInt(`${first}${last}`);
    // console.log(matches.join('|'), number, '\t\t', line);

    if (number < 11 || number > 99) throw `Invalid number: ${number}`;

    total += number;
  } else {
    throw `Error parsing number: ${line}`;
  }
});

console.log(total);
