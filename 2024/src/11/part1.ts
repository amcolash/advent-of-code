import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

let stones = lines[0].split(' ').map((s) => Number(s));
// console.log(stones);

// const blinks = 1;
// const blinks = 6;
const blinks = 25;

for (let i = 0; i < blinks; i++) {
  const updated = [];

  stones.forEach((stone) => {
    const numDigits = stone.toString().length;

    if (stone === 0) updated.push(1);
    else if (numDigits % 2 === 0) {
      const middle = numDigits / 2;
      const left = stone.toString().substring(0, middle);
      const right = stone.toString().substring(middle);

      updated.push(Number(left));
      updated.push(Number(right));
    } else {
      updated.push(stone * 2024);
    }
  });

  stones = updated;
  // console.log(stones);
}

console.log(stones.length);
