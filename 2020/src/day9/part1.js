const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

const numbers = input.split('\n').map((n) => Number.parseInt(n));

let valid = true;
const previous = 25;

numbers.forEach((n, i) => {
  if (i < previous || !valid) return;

  let currentValid = false;
  for (let j = i - 25; j < i; j++) {
    if (currentValid) continue;
    for (let k = i - 25; k < i; k++) {
      if (currentValid || j === k) continue;

      if (numbers[j] + numbers[k] === numbers[i]) currentValid = true;
    }
  }

  if (!currentValid) {
    valid = false;
    console.log(i, numbers[i]);
  }
});
