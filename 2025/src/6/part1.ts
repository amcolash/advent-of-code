import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const cols = [];

lines.forEach((l) => {
  const row = l.trim().split(/\s+/);
  row.forEach((c, i) => {
    cols[i] = cols[i] || [];

    if (c.match(/\d+/)) cols[i].push(Number.parseInt(c));
    else cols[i].push(c);
  });
});

let total = 0;
cols.forEach((c) => {
  if (c.length !== cols[0].length) throw 'Mismatched Columns';

  let answer = 0;
  if (c[c.length - 1] === '+') {
    answer = c.slice(0, c.length - 1).reduce((acc, curr) => acc + curr, 0);
  } else {
    answer = c.slice(0, c.length - 1).reduce((acc, curr) => acc * curr, 1);
  }

  // console.log(c, answer);
  total += answer;
});

console.log(total);
