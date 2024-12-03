import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.split('\n');

function findDuplicate(input: string): boolean {
  const dict: { [key: string]: number } = {};

  for (let i = 0; i < input.length; i++) {
    if (!dict[input[i]]) dict[input[i]] = 0;
    dict[input[i]]++;
  }

  for (let i = 0; i < input.length; i++) {
    if (dict[input[i]] > 1) return true;
  }

  return false;
}

const length = 14;

for (const line of lines) {
  for (let j = 0; j < line.length - length; j++) {
    const dupe = findDuplicate(line.substring(j, j + length));

    if (!dupe) {
      console.log(j + length);
      break;
    }
  }
}
