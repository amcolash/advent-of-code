import { readFileSync } from 'fs';
import { join } from 'path';
import { mod } from '../util/utils';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const dirs = [];
lines.forEach(l => {
  const num = Number.parseInt(l.replace(/[RL]/g, ''));
  if (l.startsWith('L')) dirs.push(-num);
  else dirs.push(num);
});

let pos = 50;
let code = 0;

dirs.forEach(d => {
  const dir = d > 0 ? 1 : -1;

  for (let i = 0; i < Math.abs(d); i++) {
    pos = mod(pos + dir, 100);
    if (pos === 0) code++;
  }
});

console.log();
console.log(code);