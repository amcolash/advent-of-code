import { match } from 'assert';
import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const numberMapping = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

let total = 0;
lines.forEach((line, i) => {
  const matches = Array.from(line.matchAll(/(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g), (x) => x[1]);

  if (matches && matches.length > 0) {
    let first = Number.parseInt(matches[0]);
    if (Number.isNaN(first)) first = (numberMapping as any)[matches[0]];

    let last = Number.parseInt(matches[matches.length - 1]);
    if (Number.isNaN(last)) last = (numberMapping as any)[matches[matches.length - 1]];

    const number = Number.parseInt(`${first}${last}`);
    // console.log(i, '\t', matches.join('|'), '\t', `${first}${last}`, '\t', number, '\t', line);

    if (number < 11 || number > 99) throw `Invalid number: ${number}`;

    total += number;
  } else {
    throw `Error parsing number: ${line}`;
  }
});

// NOT 56001
console.log(total);
