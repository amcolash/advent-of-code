import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

interface Card {
  index: number;
  winning: number[];
  actual: number[];
  matched: number[];
  score: number;
}

const cards: Card[] = [];

let total = 0;
lines.forEach((l) => {
  const matches = l.match(/Card\s+(\d+): ([\d\s]+)\| ([\d\s]+)/);

  if (matches && matches.length === 4) {
    const index = parseInt(matches[1]);
    const winning = matches[2]
      .trim()
      .split(/\s+/)
      .map((i) => parseInt(i));
    const actual = matches[3]
      .trim()
      .split(/\s+/)
      .map((i) => parseInt(i));

    let score = 0;
    const matched: number[] = [];
    winning.forEach((w) => {
      if (actual.find((a) => a === w)) {
        matched.push(w);
        score++;
      }
    });

    if (score > 1) score = Math.pow(2, score - 1);

    total += score;

    cards.push({ index, winning, actual, matched, score });
  } else {
    throw `Invalid line: ${l}, ${matches}`;
  }
});

console.log(total);
