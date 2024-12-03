import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const duration = Number.parseInt(lines[0].split(':')[1].trim().replace(/\s+/g, ''));

const record = Number.parseInt(lines[1].split(':')[1].trim().replace(/\s+/g, ''));

function determineWinningTimes(duration: number, record: number): number[] {
  const chargeTimes: number[] = [];

  for (let i = 0; i < duration; i++) {
    const velocity = i;
    const distance = velocity * (duration - i);

    if (distance > record) {
      chargeTimes.push(i);
    }
  }

  return chargeTimes;
}

const chargeTimes = determineWinningTimes(duration, record);
console.log(chargeTimes.length);
