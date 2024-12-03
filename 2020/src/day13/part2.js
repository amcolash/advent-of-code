const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

const lines = input.split('\n');
const busses = lines[1].split(',').map((b) => Number.parseInt(b));

const largest = [...busses].sort((a, b) => {
  if (Number.isNaN(a)) return b;
  if (Number.isNaN(b)) return a;
  return b - a;
})[0];

let largestTime = Math.floor(100000000000000 / largest) * largest;
const largestIndex = busses.indexOf(largest);
// largestTime = 0;

let counter = 0;
while (true) {
  counter++;
  if (counter === 10000000) {
    console.log(largestTime - largestIndex);
    counter = 0;
  }

  const time = largestTime - largestIndex;

  let valid = true;

  let i = 0;
  while (i < busses.length) {
    const b = busses[i];

    if (!Number.isNaN(b)) {
      const next = Math.floor(time / b) + (i === 0 ? 0 : 1);

      if (next * b !== time + i) {
        valid = false;
        break;
      }
    }

    i++;
  }

  if (valid) break;
  largestTime += largest;
}

console.log('----------------');
console.log(largestTime - largestIndex);
