const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

function binaryPartition(str) {
  let min = 0;
  let max = Math.pow(2, str.length) - 1;

  str.split('').forEach((s) => {
    if (s === 'F' || s === 'L') max -= Math.ceil((max - min) / 2);
    else if (s === 'B' || s === 'R') min += Math.ceil((max - min) / 2);
  });

  if (min !== max) throw `Something went wrong parsing ${str}, ${min}, ${max}`;

  return max;
}

let maxId = 0;

const seats = input.split('\n').map((i) => {
  const rowStr = i.substring(0, 7);
  const colStr = i.substring(7, 10);

  const row = binaryPartition(rowStr);
  const col = binaryPartition(colStr);
  const id = row * 8 + col;

  if (id > maxId) maxId = id;

  return { row, col, id };
});

console.log(maxId);
