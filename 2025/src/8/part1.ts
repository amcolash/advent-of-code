import { readFileSync } from 'fs';
import { join } from 'path';
import { Vector3 } from '../util/types';
import { inspect } from 'util';

let file = 'sample1.txt';
// file = 'input.txt';

const data = readFileSync(join(__dirname, file)).toString();
const lines = data.trim().split('\n');

const iterations = file === 'sample1.txt' ? 15 : 1000;

class Box extends Vector3 {
  id: number;
  connections: Set<number> = new Set();

  constructor(x: number, y: number, z: number, id: number) {
    super(x, y, z);
    this.id = id;
  }

  toString() {
    return `#${this.id}\t- ${super.toString()}:\t[${[...this.connections]}]`;
  }
}

const boxes: Box[] = lines.map((l, i) => {
  const [x, y, z] = l.split(',').map((n) => Number.parseInt(n));
  return new Box(x, y, z, i + 1);
});

// console.log(boxes.map((b) => b.toString()));

const computed = {};
const distances: { dist: number; b1: Box; b2: Box }[] = [];

for (let i = 0; i < boxes.length; i++) {
  for (let j = 0; j < boxes.length; j++) {
    if (i === j) continue;

    const b1 = boxes[i];
    const b2 = boxes[j];

    if (!computed[`${b1.id}-${b2.id}`]) {
      const dist = boxes[i].squaredLength(boxes[j]);
      distances.push({ dist, b1, b2 });

      computed[`${b1.id}-${b2.id}`] = true;
      computed[`${b2.id}-${b1.id}`] = true;
    }
  }
}

distances.sort((a, b) => a.dist - b.dist);

for (let i = 0; i < iterations; i++) {
  const { b1, b2 } = distances[i];

  b1.connections.add(b2.id);
  b2.connections.add(b1.id);

  console.log('Connecting', b1.id, b2.id);
}

const circuits: Set<number>[] = [];
for (let i = 0; i < boxes.length; i++) {
  const box = boxes[i];

  let circuit = circuits.find((c) => {
    if (c.has(box.id)) return true;

    const connections = [...box.connections];
    for (let j = 0; j < connections.length; j++) {
      if (c.has(connections[j])) return true;
    }
  });

  if (!circuit) {
    circuit = new Set();
    circuits.push(circuit);
  }

  // console.log(box);

  circuit.add(box.id);
  const connections = [...box.connections];
  for (let c = 0; c < connections.length; c++) {
    circuit.add(connections[c]);
  }
}

circuits.sort((a, b) => b.size - a.size);
console.log(circuits);

// console.log(circuits[0].size * circuits[1].size * circuits[2].size);

// 30888 is too low

// const errors = [30, 34, 43, 44, 54];
// const errors = [30, 97, 432];

let map = {};
for (let i = 0; i < circuits.length; i++) {
  const connections = [...circuits[i]];

  for (let j = 0; j < connections.length; j++) {
    map[connections[j]] = map[connections[j]] || 0;
    map[connections[j]]++;
  }
}

// console.log(boxes.filter((b) => errors.includes(b.id)).join('\n'));

console.log(Object.fromEntries(Object.entries(map).filter((m) => m[1] > 1)));

// console.log(
//   circuits.filter((c) => {
//     for (let i = 0; i < errors.length; i++) {
//       if (c.has(errors[i])) return true;
//     }

//     return false;
//   })
// );
