const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

const numbers = input
  .split('\n')
  .map((n) => Number.parseInt(n))
  .sort((a, b) => a - b);

const diffs = { 1: 0, 3: 1 };

let jolts = 0;
numbers.forEach((n) => {
  const diff = n - jolts;
  diffs[diff]++;
  jolts = n;
});

console.log(diffs, diffs['1'] * diffs['3']);
