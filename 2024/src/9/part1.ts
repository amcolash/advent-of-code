import { readFileSync } from 'fs';
import { join } from 'path';
import { stdout } from 'process';

const data = readFileSync(join(__dirname, 'input.txt')).toString().trim();

function buildMap(input: string): number[] {
  const map = [];

  let id = 0;
  for (let i = 0; i < input.length; i++) {
    const val = Number(input[i]);
    if (i % 2 === 0) {
      for (let j = 0; j < val; j++) {
        map.push(id);
      }
      id++;
    } else {
      for (let j = 0; j < val; j++) {
        map.push(-1);
      }
    }
  }

  return map;
}

function moveBlocks(map: number[]): number[] {
  const moved = [...map];

  let left = 0;

  for (let right = moved.length - 1; right >= 0; right--) {
    if (moved[right] !== -1 && left < right) {
      while (moved[left] !== -1 && left < moved.length) {
        // console.log('checking left', left, ':', moved[left]);
        left++;
      }

      if (left < right) {
        // console.log('swapping', moved[left], moved[right], left, right);

        moved[left] = moved[right];
        moved[right] = -1;

        // drawMap(moved);
      }
    }
  }

  return moved;
}

function checksum(map: number[]): number {
  let sum = 0;

  for (let i = 0; i < map.length; i++) {
    if (map[i] !== -1) {
      sum += map[i] * i;
    }
  }

  return sum;
}

function drawMap(map: number[]) {
  for (let i = 0; i < map.length; i++) {
    const val = map[i];
    if (val === -1) stdout.write('.');
    else stdout.write(map[i].toString());
  }
  stdout.write('\n');
}

const map = buildMap(data);
const moved = moveBlocks(map);
const sum = checksum(moved);

// drawMap(moved);
console.log(sum);
