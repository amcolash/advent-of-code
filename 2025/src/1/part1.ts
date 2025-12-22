import { readFileSync } from 'fs';
import { join } from 'path';
import { mod } from '../util/utils';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const dirs = [];
lines.forEach(l => {
  const num = Number.parseInt(l.replace(/[RL]/g, ''));
  if (l.startsWith('L')) dirs.push(-num)
  else dirs.push(num)
});

let pos = 50;
let code = 0;

dirs.forEach(d => {
  pos = mod(pos + d, 100);
  if (pos === 0) code++;
  // console.log(pos)
});

console.log(code);