const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

const numbers = input
  .split('\n')
  .map((n) => Number.parseInt(n))
  .sort((a, b) => a - b);

// Power sets from https://www.geeksforgeeks.org/subarraysubstring-vs-subsequence-and-programs-to-generate-them/

const totalVariations = Math.pow(2, numbers.length);
let numValid = 0;

let time = Date.now();
let counter = 0;

let count = 0;
let temp = 0;
let jolts = 0;
let last = 0;
let valid = true;

let third = numbers.length / 3;

let lookup = [];
for (let i = 0; i < numbers.length; i++) {
  lookup[Math.pow(2, i)] = i;
}

let avg = 0;
for (let i = 0; i < numbers.length; i += 3) {
  avg += numbers[i];
}

for (let i = 0; i < totalVariations; i++) {
  counter++;
  if (counter === 10000000) {
    counter = 0;
    console.log(i, (i / totalVariations) * 100, numValid, (Date.now() - time) / 1000);
  }

  if (i < avg) continue;

  // Skip if the last value is not used
  if (!(i & (1 << (numbers.length - 1)))) continue;

  count = 0;
  temp = i;
  while (temp > 0 && count < third) {
    count++;
    temp &= temp - 1;
  }

  // // Skip if we have less than 1/3 of the items in the set
  if (count < third) continue;

  jolts = 0;
  last = 0;
  valid = true;

  temp = i;
  while (temp > 0) {
    const j = lookup[temp - (temp & (temp - 1))];

    if (numbers[j] - jolts > 3) {
      valid = false;
      break;
    }

    jolts = numbers[j];
    temp &= temp - 1;
  }

  // for (let j = 0; j < numbers.length; j++) {
  //   if (i & (1 << j)) {
  //     if (j - last > 3 || numbers[j] - jolts > 3) {
  //       valid = false;
  //       break;
  //     }

  //     jolts = numbers[j];
  //     last = j;
  //   }
  // }

  if (valid) numValid++;
}

console.log('valid', numValid);
