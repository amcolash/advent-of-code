import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.split('\n');

let overlaps = 0;
for (let i = 0; i < lines.length; i++) {
  const matches = lines[i].match(/(\d+)-(\d+),(\d+)-(\d+)/);

  if (matches) {
    const firstStart = Number.parseInt(matches[1]);
    const firstEnd = Number.parseInt(matches[2]);
    const secondStart = Number.parseInt(matches[3]);
    const secondEnd = Number.parseInt(matches[4]);

    if ((firstStart >= secondStart && firstEnd <= secondEnd) || (secondStart >= firstStart && secondEnd <= firstEnd)) overlaps++;
  }
}

console.log(overlaps);
