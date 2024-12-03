const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

const instructions = input.split('\n').map((i) => {
  const match = i.match(/([\w]{3}) ([-+\d]+)/);
  return [match[1], Number.parseInt(match[2])];
});

let iCount = -1;
let solved = false;

while (iCount < instructions.length && !solved) {
  let acc = 0;
  let pc = 0;

  iCount++;

  // Me being really lazy
  const visited = new Set();
  let hasModded = false;

  while (true) {
    if (!instructions[pc]) break;
    const inst = [...instructions[pc]];

    if (!hasModded && pc === iCount && (inst[0] === 'jmp' || inst[0] === 'nop')) {
      inst[0] = inst[0] === 'jmp' ? 'nop' : 'jmp';
      hasModded = true;
    }

    if (visited.has(pc)) break;
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

  if (pc === instructions.length) {
    console.log('solved by changing line', iCount, 'acc', acc);
    solved = true;
  }
}
