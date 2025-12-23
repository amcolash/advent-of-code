import { readFileSync } from 'fs';
import { join } from 'path';
import { bold, Color, color } from '../util/utils';

// Slice array to largest starting number, while ensuring that the array still has at least the min length required
function sliceMax(array: number[], min: number): number[] {
  for (let i = 9; i > 0; i--) {
    const index = array.indexOf(i);

    if (index >= 0 && array.length - index >= min) {
      return array.slice(index);
    }
  }

  return [];
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
  let largest = [];
  let temp = [...bank];

  for (let i = 0; i < batteries; i++) {
    temp = sliceMax(i === 0 ? temp : temp.slice(1), batteries - i);
    largest.push(temp[0]);
  }

  const valString = largest.join('');
  console.log(getHighlightedString(bank, valString), valString);

  total += Number.parseInt(valString);
});

console.log();
console.log(total);
