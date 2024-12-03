const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

const instructions = input.split('\n').map((i) => {
  const match = i.match(/([\w]{3}) ([-+\d]+)/);
  return [match[1], Number.parseInt(match[2])];
});

let acc = 0;
let pc = 0;

// Me being really lazy
const visited = new Set();

while (true) {
  const inst = instructions[pc];
  if (!inst) break;

  if (visited.has(pc)) {
    console.log('Looping:', pc);
    break;
  }
  visited.add(pc);

  switch (inst[0]) {
    case 'nop':
      pc++;
      break;
    case 'acc':
      pc++;
      acc += inst[1];
      break;
    case 'jmp':
      pc += inst[1];
      break;
  }
}

console.log('Final acc:', acc);
