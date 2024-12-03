import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.split('\n');

interface Monkey {
  id: number;
  items: number[];
  operation: {
    operand: '*' | '+';
    value: number | 'old';
  };
  test: {
    operand: '/';
    value: number;
    t: number;
    f: number;
  };
  inspected: number;
}

const monkeys: Monkey[] = [];
const rounds = 20;

function parseMonkeys() {
  let current: any = {}; // until all set

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.includes('Monkey')) {
      const id = l.match(/\d+/);
      if (id) current.id = Number.parseInt(id[0]);
    }

    if (l.includes('Starting')) {
      const items = [...l.matchAll(/\d+/g)];
      current.items = items.map((i) => Number.parseInt(i[0]));
    }

    if (l.includes('Operation')) {
      current.operation = current.operation || {};

      if (l.includes('*')) current.operation.operand = '*';
      if (l.includes('+')) current.operation.operand = '+';

      if (l.endsWith('old')) current.operation.value = 'old';

      const endMatch = l.match(/\d+$/);
      if (endMatch) current.operation.value = Number.parseInt(endMatch[0]);
    }

    if (l.includes('Test')) {
      current.test = current.test || {};

      if (l.includes('divisible')) current.test.operand = '/';

      const endMatch = l.match(/\d+$/);
      if (endMatch) current.test.value = Number.parseInt(endMatch[0]);
    }

    if (l.includes('true')) {
      const endMatch = l.match(/\d+$/);
      if (endMatch) current.test.t = Number.parseInt(endMatch[0]);
    }

    if (l.includes('false')) {
      const endMatch = l.match(/\d+$/);
      if (endMatch) current.test.f = Number.parseInt(endMatch[0]);
    }

    if (l.trim().length === 0) {
      monkeys.push(current);
      current = {};
    }
  }

  monkeys.push(current);

  console.log(monkeys);
}

parseMonkeys();

for (let i = 0; i < rounds; i++) {
  monkeys.forEach((m) => {
    if (!m.inspected) m.inspected = 0;

    while (m.items.length > 0) {
      const item = m.items.shift();

      if (item) {
        let worry = item;

        const val = m.operation.value === 'old' ? worry : m.operation.value;
        if (m.operation.operand === '*') worry *= val;
        else worry += val;

        worry = Math.floor(worry / 3);

        if (worry % m.test.value === 0) monkeys[m.test.t].items.push(worry);
        else monkeys[m.test.f].items.push(worry);

        m.inspected++;
      }
    }
  });
}

console.log(monkeys);

monkeys.sort((a, b) => b.inspected - a.inspected);
console.log(monkeys[0].inspected * monkeys[1].inspected);
