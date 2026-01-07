import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const mapping: Record<string, string[]> = {};

lines.forEach((l) => {
  const [name, devices] = l.split(': ');
  mapping[name] = devices.split(' ');
});

function followPath(name: string, path: string) {
  if (name === end) {
    paths.push(path + '/out');
  } else {
    const devices = mapping[name];
    for (let i = 0; i < devices.length; i++) {
      followPath(devices[i], path + '/' + name);
    }
  }
}

const start = 'you';
const end = 'out';

const paths = [];

followPath(start, '');

console.log(paths.length);
