import { readFileSync } from 'fs';
import { join } from 'path';
import { Point } from '../util/types';

const data = readFileSync(join(__dirname, 'sample1.txt')).toString();
const lines = data.trim().split('\n');

const machines: { buttonA: Point; buttonB: Point; prize: Point }[] = [];

for (let l = 0; l < lines.length; l += 4) {
  const line1 = lines[l];
  const line2 = lines[l + 1];
  const line3 = lines[l + 2];

  if (line1 && line2 && line3) {
    const buttonAX = Number(line1.match(/X\+(\d+)/)[1]);
    const buttonAY = Number(line1.match(/Y\+(\d+)/)[1]);
    const buttonA = { x: buttonAX, y: buttonAY };

    const buttonBX = Number(line2.match(/X\+(\d+)/)[1]);
    const buttonBY = Number(line2.match(/Y\+(\d+)/)[1]);
    const buttonB = { x: buttonBX, y: buttonBY };

    const prizeX = Number(line3.match(/X=(\d+)/)[1]);
    const prizeY = Number(line3.match(/Y=(\d+)/)[1]);
    const prize = { x: prizeX, y: prizeY };

    machines.push({ buttonA, buttonB, prize });
  }
}

let total = 0;
machines.forEach((m, i) => {
  let lowest: { a: number; b: number; tokens: number };

  for (let a = 0; a <= 100; a++) {
    for (let b = 0; b <= 100; b++) {
      if (m.prize.x === a * m.buttonA.x + b * m.buttonB.x && m.prize.y === a * m.buttonA.y + b * m.buttonB.y) {
        const tokens = a * 3 + b;
        if (!lowest || lowest.tokens > tokens) lowest = { a, b, tokens };
      }
    }
  }

  if (lowest) total += lowest.tokens;
});

console.log(total);
