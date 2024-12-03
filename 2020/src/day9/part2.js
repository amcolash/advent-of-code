const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

const numbers = input.split('\n').map((n) => Number.parseInt(n));

const toFind = 69316178;

for (let i = 0; i < numbers.length; i++) {
  let sum = numbers[i];
  for (let j = i + 1; j < numbers.length; j++) {
    sum += numbers[j];

    if (sum === toFind) {
      const nums = numbers.slice(i, j);
      console.log(i, j, Math.min(...nums) + Math.max(...nums));
    }
  }
}
