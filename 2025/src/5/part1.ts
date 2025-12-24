import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

function isFresh(id: number, fresh: Array<number[]>): boolean {
  for (let i = 0; i < fresh.length; i++) {
    const [start, end] = fresh[i];
    if (id >= start && id <= end) {
      return true;
    }
  }

  return false;
}

const fresh: Array<number[]> = [];
const ingredients: number[] = [];

let firstHalf = true;
lines.forEach((l) => {
  if (l.trim() === '') firstHalf = false;
  else if (firstHalf) {
    fresh.push(l.split('-').map((f) => Number.parseInt(f)));
  } else {
    ingredients.push(Number.parseInt(l));
  }
});

let total = 0;
ingredients.forEach((i) => {
  if (isFresh(i, fresh)) total++;
});

console.log(total);
