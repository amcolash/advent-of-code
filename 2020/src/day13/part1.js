const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

const lines = input.split('\n');
const time = Number.parseInt(lines[0]);
const busses = lines[1]
  .split(',')
  .filter((b) => b !== 'x')
  .map((b) => Number.parseInt(b));

function findEarliest(id) {
  const start = Math.floor(time / id) * id;
  let current = start;

  while (current < time) current += id;

  return { id, earliest: current };
}

const earliest = busses.map((b) => findEarliest(b)).sort((a, b) => a.earliest - b.earliest);

console.log(earliest[0]);
console.log(earliest[0].id * (earliest[0].earliest - time));
