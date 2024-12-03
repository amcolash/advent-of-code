const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const hills = input.split('\n');

function count(dx, dy) {
  let x = 0;
  let hit = 0;

  hills.forEach((r, i) => {
    if (i === 0 || (dy === 2 && i % 2 === 1)) return;

    x = (x + dx) % r.length;
    const square = r[x];

    if (square === '#') hit++;
  });

  return hit;
}

console.log(count(1, 1) * count(3, 1) * count(5, 1) * count(7, 1) * count(1, 2));
