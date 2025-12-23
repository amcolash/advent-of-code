import { readFileSync } from 'fs';
import { join } from 'path';
import { bold, Color, color } from '../util/utils';

function sliceMax(array: number[], i: number, min: number): number[] {
  const index = array.indexOf(i);

  if (index >= 0 && array.length - index >= min) {
    return array.slice(index);
  }

  return [];
}

function removeSmallest(array: number[]): number[] {
  const sorted = [...array].sort();
  const smallest = array.indexOf(sorted[0]);
  array.splice(smallest, 1);

  return array;
}

function getHighlightedString(bank: number[], valString: string): string {
  let currentNumber = 0;
  let highlighted = '';

  for (let i = 0; i < bank.length; i++) {
    if (valString[currentNumber] === bank[i].toString()) {
      highlighted += bold(color(bank[i].toString(), Color.Green));
      currentNumber++;
    } else {
      highlighted += bank[i];
    }
  }

  return highlighted;
}

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const banks = lines.map((l) => l.split('').map((n) => Number.parseInt(n)));
const batteries = 12;

let total = 0;

banks.forEach((bank) => {
  let subarray;
  for (let i = 9; i > 0; i--) {
    subarray = sliceMax(bank, i, batteries);
    if (subarray.length >= batteries) break;
  }

  let removed = [...subarray];

  while (removed.length > batteries) {
    removed = removeSmallest(removed);
  }

  const valString = removed.toString().replace(/,/g, '');
  const value = Number.parseInt(valString);
  total += value;

  console.log(getHighlightedString(bank, valString), value);
});

// 169679529983660 is too low

console.log();
console.log(total);
