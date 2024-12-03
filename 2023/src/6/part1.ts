import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const durations = lines[0]
  .split(':')[1]
  .trim()
  .split(/\s+/)
  .map((n) => Number.parseInt(n));

const records = lines[1]
  .split(':')[1]
  .trim()
  .split(/\s+/)
  .map((n) => Number.parseInt(n));

const races = durations.map((duration, i) => {
  return { duration, record: records[i] };
});

function determineWinningTimes(duration: number, record: number): number[] {
  const chargeTimes: number[] = [];

  for (let i = 0; i < record; i++) {
    const velocity = i;
    const distance = velocity * (duration - i);

    if (distance > record) {
      chargeTimes.push(i);
    }
  }

  return chargeTimes;
}

let total = 1;
races.forEach((r) => {
  const chargeTimes = determineWinningTimes(r.duration, r.record);
  total *= chargeTimes.length;
});

console.log(total);
