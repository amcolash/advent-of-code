import { readFileSync } from 'fs';
import { join } from 'path';
import { Vector3 } from '../util/types';

let file = 'sample1.txt';
file = 'input.txt';

const data = readFileSync(join(__dirname, file)).toString();
const lines = data.trim().split('\n');

const iterations = file === 'sample1.txt' ? 10 : 1000;

class Box extends Vector3 {
  id: number;

  constructor(x: number, y: number, z: number, id: number) {
    super(x, y, z);
    this.id = id;
  }

  toString() {
    return `#${this.id}\t- ${super.toString()}`;
  }
}

let circuits: Array<Set<number>> = [];

const boxes: Box[] = lines.map((l, i) => {
  const [x, y, z] = l.split(',').map((n) => Number.parseInt(n));
  return new Box(x, y, z, i + 1);
});

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

  const c1 = circuits.findIndex((c) => c.has(b1.id));
  const c2 = circuits.findIndex((c) => c.has(b2.id));

  let circuit;
  if (c1 >= 0 && c2 >= 0) {
    // console.log('--Found circuits that need to merge--');
    circuit = circuits[c1].union(circuits[c2]);
    circuits.push(circuit);

    circuits[c1] = undefined;
    circuits[c2] = undefined;

    circuits = circuits.filter((c) => c);
  }

  if (!circuit) circuit = circuits[c1] || circuits[c2];
  if (!circuit) {
    circuit = new Set();
    circuits.push(circuit);
  }

  circuit.add(b1.id);
  circuit.add(b2.id);

  // b1.connections.add(b2.id);
  // b2.connections.add(b1.id);

  // console.log('Connecting', b1.id, b2.id);
}

circuits.sort((a, b) => b.size - a.size);
// console.log(circuits);

console.log(circuits[0].size * circuits[1].size * circuits[2].size);
