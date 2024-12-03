const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

let maxSize = 0;
const instructions = input.split('\n').map((i) => {
  const maskMatch = i.match(/mask = ([\d\w]+)/);
  const memMatch = i.match(/mem\[(\d+)\] = (\d+)/);

  if (maskMatch) return { i: 'mask', v1: maskMatch[1] };
  if (memMatch) {
    maxSize = Math.max(maxSize, Number.parseInt(memMatch[1]));
    return { i: 'mem', v1: Number.parseInt(memMatch[1]), v2: Number.parseInt(memMatch[2]) };
  }
});

let mask0;
let mask1;

const mem = new BigUint64Array(maxSize + 1);

instructions
  .filter((i) => i !== undefined)
  .forEach((i) => {
    if (i.i === 'mask') {
      const mask1Bin = i.v1.replace(/X/g, 0);
      const mask0Bin = i.v1.replace(/X/g, 1);

      mask1 = BigInt('0b' + mask1Bin);
      mask0 = BigInt('0b' + mask0Bin);
    } else if (i.i === 'mem') {
      mem[i.v1] = BigInt(i.v2);
      mem[i.v1] |= mask1;
      mem[i.v1] &= mask0;
    }
  });

let sum = BigInt(0);
Object.values(mem).forEach((m) => (sum += m));

console.log(sum.toString().replace('n', ''));
