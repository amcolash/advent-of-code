import { readFileSync } from 'fs';
import { dirname, join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.split('\n');

function parseTree() {
  const tree: any = {};
  let currentDir = '/';

  let i = 0;

  while (i < lines.length) {
    const command = lines[i];

    if (command.includes('ls')) {
      let j = i + 1;
      while (j < lines.length && !lines[j].includes('$')) {
        const output = lines[j];

        if (!output.startsWith('dir')) {
          const match = output.match(/(\d+) ([\w/\.]+)/);
          if (match) {
            const size = Number.parseInt(match[1]);
            const name = match[2];

            const dirSplit = currentDir.split('/');
            let currentLevel = tree;
            for (let k = 0; k < dirSplit.length; k++) {
              const level = dirSplit[k];
              if (level.length > 0) {
                currentLevel[level] = currentLevel[level] || {};
                currentLevel = currentLevel[level];
              }
            }

            currentLevel[name] = size;
          }
        }

        j++;
      }

      i = j;
    } else if (command.includes('cd')) {
      const match = command.match(/\$ cd ([\w/\.]+)/);
      if (match) {
        const dir = match[1];

        if (dir === '/') currentDir = '/';
        else if (dir === '..') {
          currentDir = dirname(currentDir);
        } else {
          currentDir += (!currentDir.endsWith('/') ? '/' : '') + dir;
        }
      } else throw 'Error: Invalid dir ${line}';

      i++;
    } else {
      throw `Error: ${command} is not a command`;
    }
  }

  return tree;
}

function calculateSizes(tree: any, sizes: any, path: string) {
  let size = 0;

  Object.entries(tree).forEach((e) => {
    if (typeof e[1] === 'number') size += e[1];
    else {
      size += calculateSizes(tree[e[0]], sizes, path + '/' + e[0]);
    }
  });

  sizes[path] = size;

  return size;
}

const tree = parseTree();

const sizes: { [key: string]: number } = {};
calculateSizes(tree, sizes, '');

const disk = 70000000;
const free = disk - sizes[''];
const needed = 30000000 - free;

const sorted = Object.entries(sizes)
  .filter((e) => e[1] >= needed)
  .sort((a, b) => a[1] - b[1]);

console.log(sorted[0]);
