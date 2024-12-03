import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

interface Card {
  index: number;
  winning: number[];
  actual: number[];
  matched: number[];
  additionalCards: number[];
}

const cards: Card[] = [];

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

    const matched: number[] = [];
    const additionalCards: number[] = [];
    let i = 1;
    winning.forEach((w) => {
      if (actual.find((a) => a === w)) {
        matched.push(w);
        additionalCards.push(index + i);
        i++;
      }
    });

    // console.log(index, matched.length);

    cards.push({ index, winning, actual, matched, additionalCards });
  } else {
    throw `Invalid line: ${l}, ${matches}`;
  }
});

const cardCounts: { [index: number]: number } = {};
cards.forEach((c) => {
  const index = c.index;
  cardCounts[index] = cardCounts[index] ? cardCounts[index] + 1 : 1;

  for (let i = 0; i < cardCounts[index]; i++) {
    c.additionalCards.forEach((c) => {
      cardCounts[c] = cardCounts[c] ? cardCounts[c] + 1 : 1;
    });
  }
});

// console.log(cardCounts);
console.log(Object.values(cardCounts).reduce((acc, curr) => acc + curr, 0));
