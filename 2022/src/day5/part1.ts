import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.split('\n');

function parseData() {
  let configEnd = 0;
  let commandStart = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('move')) {
      commandStart = i;
      configEnd = i - 3;
      break;
    }
  }

  const numberOfCrates = lines[configEnd].replace(/\s/g, '').length / 3;
  const stacks = Array(numberOfCrates);

  for (let i = 0; i < numberOfCrates; i++) {
    const pos = 1 + i * 4;

    for (let j = configEnd; j >= 0; j--) {
      const letter = lines[j][pos] || '';

      if (!stacks[i]) stacks[i] = [];
      if (letter.trim() !== '') stacks[i].push(letter);
    }
  }

  const commands: number[][] = [];

  for (let i = commandStart; i < lines.length; i++) {
    const match = lines[i].match(/move (\d+) from (\d+) to (\d+)/);
    if (match) {
      commands.push([Number.parseInt(match[1]), Number.parseInt(match[2]), Number.parseInt(match[3])]);
    }
  }

  return { commands, stacks };
}

const { commands, stacks } = parseData();

for (let i = 0; i < commands.length; i++) {
  const amt = commands[i][0];
  const from = commands[i][1] - 1;
  const to = commands[i][2] - 1;

  for (let j = 0; j < amt; j++) {
    const crate = stacks[from].pop();
    stacks[to].push(crate);
  }
}

let result = '';
for (let i = 0; i < stacks.length; i++) {
  result += stacks[i].pop();
}

console.log(result);
