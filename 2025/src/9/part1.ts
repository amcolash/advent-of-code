import { readFileSync } from 'fs';
import { join } from 'path';
import { Vector } from '../util/types';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const tiles: Vector[] = lines.map((l) => Vector.fromString(l));
let max = { value: 0, t1: undefined, t2: undefined };

for (let i = 0; i < tiles.length; i++) {
  for (let j = 0; j < tiles.length; j++) {
    const t1 = tiles[i];
    const t2 = tiles[j];

    const area = t1.area(t2);
    if (area > max.value) {
      max.value = area;
      max.t1 = t1;
      max.t2 = t2;
    }
  }
}

console.log(max);
