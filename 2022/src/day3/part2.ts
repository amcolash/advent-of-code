import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const rucksacks = data.split('\n');

let sum = 0;

for (let i = 0; i < rucksacks.length; i += 3) {
  const dictionary: { [key: string]: boolean[] } = {};

  process(rucksacks[i], 0, dictionary);
  process(rucksacks[i + 1], 1, dictionary);
  process(rucksacks[i + 2], 2, dictionary);

  Object.entries(dictionary).forEach((e) => {
    if (e[1][0] && e[1][1] && e[1][2]) {
      sum += getValue(e[0]);
    }
  });
}

function process(contents: string, index: number, dictionary: { [key: string]: boolean[] }): void {
  for (let i = 0; i < contents.length; i++) {
    const letter = contents[i];
    if (!dictionary[letter]) dictionary[letter] = [false, false, false];

    dictionary[letter][index] = true;
  }
}

function getValue(letter: string): number {
  const isUpper = letter.toUpperCase() === letter;
  return letter.charCodeAt(0) - (isUpper ? 38 : 96);
}

console.log(sum);
