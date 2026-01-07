import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const mapping: Record<string, string[]> = {};
const routes: Record<string, string> = {};

lines.forEach((l) => {
  const [name, devices] = l.split(': ');
  mapping[name] = devices.split(' ');
});

function followPath(name: string, path: string) {
  if (count > 10000) return;
  if (path.includes('/' + name + '/')) throw 'LOOP';

  if (name === end) {
    // if (path.includes('fft')) console.log('fft');
    // if (path.includes('dac')) console.log('dac');

    if (path.includes('fft') || path.includes('dac')) {
      paths.push(path + '/' + end);
    }

    count++;
  } else {
    const devices = mapping[name];
    for (let i = 0; i < devices.length; i++) {
      followPath(devices[i], path + '/' + name);
    }
  }
}

function getParents(search: string): string[] {
  const parents = [];
  Object.entries(mapping).forEach(([name, devices]) => {
    if (devices.includes(search)) parents.push(name);
  });
  return parents;
}

const start = 'svr';
const end = 'out';

let paths = [];
let count = 0;

const counts = {};

Object.entries(mapping).forEach(([name, devices]) => {
  paths = [];
  count = 0;

  followPath(name, '');

  if (paths.length > 0 && paths.length < 10000) counts[name] = paths.length;
});

console.log(counts);

// Object.entries(mapping).forEach(([name, devices]) => {
//   resolvePath(name);
// });

const toVisit = new Set<string>();

function travelParents(name: string) {
  const parents = getParents(name);
  for (let i = 0; i < parents.length; i++) {
    if (!toVisit.has(parents[i])) {
      toVisit.add(parents[i]);
      travelParents(parents[i]);
    }
  }
}

// travelParents(end);

// console.log(toVisit.size);
