import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const rucksacks = data.split('\n');

let sum = 0;

rucksacks.forEach((r) => {
  const first = r.slice(0, r.length / 2);
  const second = r.slice(r.length / 2);

  let set1 = new Set<string>();
  for (let i = 0; i < first.length; i++) {
    set1.add(first[i]);
  }

  let dupe: string | undefined;
  for (let i = 0; i < second.length; i++) {
    if (set1.has(second[i])) {
      dupe = second[i];
      break;
    }
  }

  if (dupe) {
    const isUpper = dupe.toUpperCase() === dupe;
    const value = dupe.charCodeAt(0) - (isUpper ? 38 : 96);

    sum += value;
  }
});

console.log(sum);
