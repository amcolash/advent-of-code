import { readFileSync } from 'fs';
import { join } from 'path';
import { Point } from '../util/types';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
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

    const prizeX = Number(line3.match(/X=(\d+)/)[1]) + 10000000000000;
    const prizeY = Number(line3.match(/Y=(\d+)/)[1]) + 10000000000000;
    const prize = { x: prizeX, y: prizeY };

    machines.push({ buttonA, buttonB, prize });
  }
}

let total = 0;
machines.forEach((m, i) => {
  const aX = m.prize.x / m.buttonA.x;
  const bX = m.prize.x / m.buttonB.x;
  const mX = -aX / bX;
  const intX = aX;

  const aY = m.prize.y / m.buttonA.y;
  const bY = m.prize.y / m.buttonB.y;
  const mY = -aY / bY;
  const intY = aY;

  // mX * x + intX = mY * x * intY
  const xDiff = mX - mY;
  const intDiff = intY - intX;

  const solvedX = intDiff / xDiff;
  const solvedY = solvedX * mX + intX;

  const tokensA = Math.round(solvedY);
  const tokensB = Math.round(solvedX);

  // console.log({ aX, bX, mX, intX, aY, bY, mY, intY, xDiff, intDiff, solvedX, tokensA, tokensB });

  if (m.buttonA.x * tokensA + m.buttonB.x * tokensB === m.prize.x && m.buttonA.y * tokensA + m.buttonB.y * tokensB === m.prize.y)
    total += 3 * tokensA + tokensB;
});

console.log(total);
