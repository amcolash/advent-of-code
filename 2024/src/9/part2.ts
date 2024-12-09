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

function getBlockSize(map: number[], endIndex: number): number {
  const id = map[endIndex];

  if (id === -1) throw 'Can only find block size for file';

  let startIndex = endIndex;
  while (startIndex >= 0 && map[startIndex] === id) {
    startIndex--;
  }

  return endIndex - startIndex;
}

function generateFreeMap(map: number[]): { index: number; size: number }[] {
  const free: { index: number; size: number }[] = [];

  for (let i = 0; i < map.length; i++) {
    const val = map[i];

    if (val === -1) {
      let end = i;
      while (map[end] === -1) {
        end++;
      }

      free.push({ index: i, size: end - i });

      i = end - 1;
    }
  }

  return free;
}

function findNextFree(map: number[], size: number): number {
  const freeMap = generateFreeMap(map);
  const next = freeMap.find((f) => f.size >= size);

  return next?.index || -1;
}

function moveBlocks(map: number[]): number[] {
  const moved = [...map];
  const idSet = new Set();

  for (let i = moved.length - 1; i >= 0; i--) {
    const val = moved[i];

    if (val !== -1 && !idSet.has(val)) {
      const size = getBlockSize(moved, i);
      const start = i - size + 1;

      const nextFree = findNextFree(moved, size);

      // console.log('block', Number(val.toString().repeat(size)), '[', start, i, ']', 'free:', nextFree);

      if (nextFree !== -1 && nextFree < start) {
        for (let j = 0; j < size; j++) {
          moved[start + j] = -1;
          moved[nextFree + j] = val;
        }
      }

      idSet.add(val);

      i = start;

      // drawMap(moved);
      // console.log();
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
