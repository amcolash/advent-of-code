const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const numbers = input.split('\n').map((n) => Number.parseInt(n));
const found = [];

numbers.forEach((v1, i1) => {
  numbers.forEach((v2, i2) => {
    if (i1 !== i2 && v1 + v2 === 2020) found.push([v1, v2, v1 * v2]);
  });
});

console.log(found);
