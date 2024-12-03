const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

const instructions = input.split('\n').map((i) => {
  const maskMatch = i.match(/mask = ([\d\w]+)/);
  const memMatch = i.match(/mem\[(\d+)\] = (\d+)/);

  if (maskMatch) return { i: 'mask', v1: maskMatch[1] };
  if (memMatch) return { i: 'mem', v1: Number.parseInt(memMatch[1]), v2: Number.parseInt(memMatch[2]) };
});

// From https://stackoverflow.com/a/14482123/2303432
function nthIndex(str, pat, n) {
  var L = str.length,
    i = -1;
  while (n-- && i++ < L) {
    i = str.indexOf(pat, i);
    if (i < 0) break;
  }
  return i;
}

function generateAddresses(a) {
  const mask1Bin = mask.replace(/X/g, 0);
  const maskedA = BigInt(a) | BigInt('0b' + mask1Bin);

  const numFloating = (mask.match(/X/g) || []).length;
  const variations = Math.pow(2, numFloating);
  const addresses = [];

  for (let i = 0; i < variations; i++) {
    let tempA = maskedA;

    for (let j = 0; j < numFloating; j++) {
      const floatingIndex = BigInt(mask.length - nthIndex(mask, 'X', j + 1) - 1);

      // if bit is set to 1
      if ((i >> j) & 1) {
        tempA |= BigInt(1n << floatingIndex);
      } else {
        // bit is set to 0
        tempA &= ~BigInt(1n << floatingIndex);
      }
    }

    addresses[i] = tempA;
  }

  return addresses;
}

let mask;
let mem = [];

instructions
  .filter((i) => i !== undefined)
  .forEach((i) => {
    if (i.i === 'mask') {
      mask = i.v1;
    } else if (i.i === 'mem') {
      const addresses = generateAddresses(i.v1);
      addresses.forEach((a) => (mem[a] = i.v2));
    }
  });

let sum = 0;
Object.values(mem).forEach((m) => (sum += m));

console.log(sum);
