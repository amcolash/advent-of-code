import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

interface Index {
  x: number;
  y: number;
  value: string;
  children?: Index[];
}

const numbers: Index[] = [];
const stars: Index[] = [];

console.log('\n\n----------------------------------------------------------------------------\n\n');

lines.forEach((l, y) => {
  const numberMatches = l.matchAll(/\d+/g);
  const starMatches = l.matchAll(/\*/g);

  Array.from(numberMatches).forEach((m) => {
    if (m.index !== undefined) {
      numbers.push({
        x: m.index,
        y,
        value: m[0],
      });
    }
  });

  Array.from(starMatches).forEach((m) => {
    if (m.index !== undefined) {
      stars.push({
        x: m.index,
        y,
        value: m[0],
      });
    }
  });
});

// console.log(numbers.map((n) => `${n.value}: (${n.x}, ${n.y})`).join('\n'));
// console.log(symbols);

const gears: Index[] = [];

let total = 0;
stars.forEach((s) => {
  const minX = Math.max(0, s.x - 1);
  const maxX = Math.min(s.x + 1, lines[0].length - 1);

  const minY = Math.max(0, s.y - 1);
  const maxY = Math.min(s.y + 1, lines.length - 1);

  const found = numbers.filter((n) => n.x + n.value.length - 1 >= minX && n.x <= maxX && n.y >= minY && n.y <= maxY);
  if (found.length > 0) {
    gears.push({ ...s, children: found });
  }
});

// console.log(gears.map((g) => g.children));
gears
  .filter((g) => g.children?.length === 2)
  .forEach((g) => {
    const ratio = Number.parseInt(g.children![0].value) * Number.parseInt(g.children![1].value);
    total += ratio;
    console.log(`${g.x}, ${g.y}: ${ratio}`);
  });

console.log();
console.log(total);
