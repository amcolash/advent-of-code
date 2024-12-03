const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const parsed = input.split('\n').map((i) => {
  if (i.length > 0) {
    const m = i.match(/(\d+)-(\d+) (\w): (\w+)/);
    return [m[1], m[2], m[3], m[4]];
  }
});

let valid = 0;

parsed.forEach((p) => {
  if (!p) return;
  const first = p[3][p[0] - 1] === p[2];
  const second = p[3][p[1] - 1] === p[2];

  if (first ^ second) valid++;
});

console.log(valid);
