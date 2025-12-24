import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

function isBetween(num: number, start: number, end: number): boolean {
  return num >= start && num <= end;
}

function rangesIntersect(r1: number[], r2: number[]): boolean {
  const [start1, end1] = r1;
  const [start2, end2] = r2;

  return isBetween(start2, start1, end1) || isBetween(end2, start1, end1);
}

function combineRanges(r1: number[], r2: number[]): number[] {
  return [Math.min(r1[0], r2[0]), Math.max(r1[1], r2[1])];
}

function tryToCombine(ranges: Array<number[]>): Array<number[]> {
  for (let i = 0; i < ranges.length; i++) {
    for (let j = 0; j < ranges.length; j++) {
      const r1 = ranges[i];
      const r2 = ranges[j];
      if (i !== j && rangesIntersect(r1, r2)) {
        ranges[i] = undefined;
        ranges[j] = undefined;

        ranges.push(combineRanges(r1, r2));

        return ranges.filter((r) => r);
      }
    }
  }

  return undefined;
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

// Combine overlapping ranges as much as possible
let combined = [...fresh];
while (true) {
  const newVals = tryToCombine(combined);

  if (newVals) combined = newVals;
  else break;
}

// sum up all of the now non-overlapping ranges
let total = 0;
combined.forEach((r) => {
  total += r[1] - r[0] + 1;
});

console.log(total);
