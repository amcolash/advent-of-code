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

lists.forEach((l) => l.sort());

let distance = 0;

for (let l = 0; l < lines.length; l++) {
  distance += Math.abs(lists[0][l] - lists[1][l]);
}

console.log(distance);
