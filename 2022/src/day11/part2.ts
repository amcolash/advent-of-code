import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.split('\n');

interface Monkey {
  id: number;
  items: bigint[];
  operation: {
    operand: '*' | '+';
    value: bigint | 'old';
  };
  test: {
    operand: '/';
    value: bigint;
    t: number;
    f: number;
  };
  inspected: number;
}

const monkeys: Monkey[] = [];
const rounds = 10000;
const debugRounds = [1, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];

// The number to divide everything by to make things small enough.
// Didn't figure this out on my own - had to look online for help:
// https://chasingdings.com/2022/12/11/advent-of-code-day-11-monkey-in-the-middle/
let magicMod = 1;

function parseMonkeys() {
  let current: any = {}; // until all set

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.includes('Monkey')) {
      const id = l.match(/\d+/);
      if (id) current.id = Number.parseInt(id[0]);
    }

    if (l.includes('Starting')) {
      const items = [...Array.from(l.matchAll(/\d+/g))];
      current.items = items.map((i) => BigInt(i[0]));
    }

    if (l.includes('Operation')) {
      current.operation = current.operation || {};

      if (l.includes('*')) current.operation.operand = '*';
      if (l.includes('+')) current.operation.operand = '+';

      if (l.endsWith('old')) current.operation.value = 'old';

      const endMatch = l.match(/\d+$/);
      if (endMatch) current.operation.value = BigInt(endMatch[0]);
    }

    if (l.includes('Test')) {
      current.test = current.test || {};

      if (l.includes('divisible')) current.test.operand = '/';

      const endMatch = l.match(/\d+$/);
      if (endMatch) {
        current.test.value = BigInt(endMatch[0]);
        magicMod *= Number.parseInt(endMatch[0]);
      }
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

function runSimulation() {
  for (let i = 1; i <= rounds; i++) {
    // console.log('-- Round', i, '--');

    monkeys.forEach((m) => {
      // console.log('Monkey', m.id);

      if (!m.inspected) m.inspected = 0;

      while (m.items.length > 0) {
        const item = m.items.shift();

        if (item) {
          let worry = item;

          const val = m.operation.value === 'old' ? worry : m.operation.value;
          if (m.operation.operand === '*') worry = worry * val;
          else worry += val;

          worry = worry % BigInt(magicMod);

          let test = worry % m.test.value === 0n;

          if (test) monkeys[m.test.t].items.push(worry);
          else monkeys[m.test.f].items.push(worry);

          // if ((test && m.test.t === 2) || (!test && m.test.f === 2))
          //   console.log('Item', { item, val, worry, test, new: worry % m.test.value, newId: test ? m.test.t : m.test.f });

          m.inspected++;
        }
      }
    });

    // if (i === 0) printMonkeys(0);
    // console.log(i);
    if (debugRounds.includes(i)) printMonkeys(i);
  }
}

function printMonkeys(round: number) {
  console.log(
    round,
    monkeys.map((m) => {
      return { id: m.id, inspected: m.inspected };
    })
  );
}

parseMonkeys();
runSimulation();
// printMonkeys(rounds);

monkeys.sort((a, b) => b.inspected - a.inspected);
console.log(monkeys[0].inspected * monkeys[1].inspected);
