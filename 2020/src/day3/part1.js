const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const hills = input.split('\n');

let x = 0;
let hit = 0;

hills.forEach((r, i) => {
  if (i === 0) return;

  x = (x + 3) % r.length;
  const square = r[x];

  if (square === '#') hit++;
});

console.log(hit);
