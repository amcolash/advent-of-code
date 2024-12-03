import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const lists: number[][] = [];

lines.forEach((l) => {
  const numbers = l.split(/\s+/).map((n) => Number(n.trim()));
  numbers.forEach((n, i) => {
    lists[i] = lists[i] || [];
    lists[i].push(n);
  });
});

const count = {};
lists[1].forEach((n) => {
  if (count[n] === undefined) count[n] = 0;
  count[n]++;
});

let similarity = 0;
lists[0].forEach((n) => {
  similarity += n * (count[n] || 0);
});

console.log(similarity);
