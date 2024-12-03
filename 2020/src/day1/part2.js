const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const numbers = input.split('\n').map((n) => Number.parseInt(n));
const found = [];

numbers.forEach((v1, i1) => {
  numbers.forEach((v2, i2) => {
    numbers.forEach((v3, i3) => {
      if (i1 !== i2 && i2 !== i3 && i1 !== i3 && v1 + v2 + v3 === 2020) found.push([v1, v2, v3, v1 * v2 * v3]);
    });
  });
});

console.log(found);
