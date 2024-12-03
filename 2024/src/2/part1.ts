import { readFileSync } from 'fs';
import { join } from 'path';

function isSafe(report: number[]): boolean {
  let increasing;
  for (let i = 1; i < report.length; i++) {
    let diff = report[i] - report[i - 1];
    if (Math.abs(diff) < 1 || Math.abs(diff) > 3) return false;

    if (increasing === undefined) {
      if (diff > 0) increasing = true;
      else increasing = false;
    }

    if (i > 0) {
      if (increasing && diff < 0) return false;
      if (!increasing && diff > 0) return false;
    }
  }

  return true;
}

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const reports = lines.map((r) => {
  return r.split(/\s+/).map((l) => Number(l));
});

let totalSafe = 0;
reports.forEach((r) => {
  if (isSafe(r)) totalSafe++;
});

console.log(totalSafe);
