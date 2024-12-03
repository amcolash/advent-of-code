import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

interface Index {
  x: number;
  y: number;
  value: string;
}

const numbers: Index[] = [];
const symbols: Index[] = [];
const bounds: Index[] = [];

console.log(
  '\n\n--------------------------------------------------------------------------------------------------------------------------------------------\n\n'
);

lines.forEach((l, y) => {
  const numberMatches = l.matchAll(/\d+/g);
  const symbolMatches = l.matchAll(/[^\.\d]/g);

  Array.from(numberMatches).forEach((m) => {
    if (m.index !== undefined) {
      numbers.push({
        x: m.index,
        y,
        value: m[0],
      });
    }
  });

  Array.from(symbolMatches).forEach((m) => {
    if (m.index !== undefined) {
      symbols.push({
        x: m.index,
        y,
        value: m[0],
      });
    }
  });
});

// console.log(numbers.map((n) => `${n.value}: (${n.x}, ${n.y})`).join('\n'));
// console.log(symbols);

const parts: Index[] = [];

let total = 0;
numbers.forEach((n) => {
  const minX = Math.max(0, n.x - 1);
  const maxX = Math.min(n.x + n.value.length, lines[0].length - 1);

  const minY = Math.max(0, n.y - 1);
  const maxY = Math.min(n.y + 1, lines.length - 1);

  for (let x = minX; x <= maxX; x++) {
    bounds.push({ x, y: minY, value: n.value });
    bounds.push({ x, y: maxY, value: n.value });
  }
  bounds.push({ x: minX, y: n.y, value: n.value });
  bounds.push({ x: maxX, y: n.y, value: n.value });

  const symbol = symbols.find((s) => s.x >= minX && s.x <= maxX && s.y >= minY && s.y <= maxY);
  if (symbol) {
    parts.push(n);
    total += parseInt(n.value);
  }
});

lines.forEach((l, y) => {
  const tokens = l.matchAll(/(\d+|\.+|[^\.\d])/g);
  let line = '';
  Array.from(tokens).forEach((t) => {
    if (t.index !== undefined) {
      const x = t.index;
      const value = t[0];
      if (value.match(/[^\.\d]/)) line += chalk.blue(value);
      else if (parts.find((p) => p.x === x && p.y === y)) line += chalk.green(value);
      else if (value.match(/\.+/)) {
        for (let i = 0; i < value.length; i++) {
          // if (bounds.find((p) => p.x === x + i && p.y === y)) line += chalk.yellow(value[i]);
          line += value[i];
        }
      } else line += chalk.red(value);
    }
  });

  console.log(line);
});

// console.log(
//   bounds
//     .filter((b) => b.y === 3)
//     .map((n) => `${n.value}: (${n.x}, ${n.y})`)
//     .join('\n')
// );

// console.log(parts.map((n) => `${n.value}: (${n.x}, ${n.y})`).join('\n'));
console.log();
console.log(total);
