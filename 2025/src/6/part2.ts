import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const splits = Array.from(lines[lines.length - 1].matchAll(/[*+]/g)).map((m) => m.index);

const problems = [];
splits.forEach((s, i) => {
  problems[i] = problems[i] || [];
  lines.forEach((l) => {
    problems[i].push(l.slice(s, splits[i + 1]));
  });
});

const parsed = [];
for (let i = 0; i < problems.length; i++) {
  const problem = problems[i];
  let cols = [];
  for (let y = 0; y < problem.length - 1; y++) {
    const row = problem[y];
    for (let x = 0; x < row.length; x++) {
      cols[x] = cols[x] || '';
      cols[x] += row[x];
    }
  }

  cols = cols.filter((c) => c.trim().length !== 0).map((c) => Number.parseInt(c));
  cols.push(problem[problem.length - 1].trim());

  // console.log(cols);
  parsed.push(cols);
}

let total = 0;
parsed.forEach((c) => {
  let answer = 0;
  if (c[c.length - 1] === '+') {
    answer = c.slice(0, c.length - 1).reduce((acc, curr) => acc + curr, 0);
  } else {
    answer = c.slice(0, c.length - 1).reduce((acc, curr) => acc * curr, 1);
  }

  // console.log(c, answer);
  total += answer;
});

console.log(total);
