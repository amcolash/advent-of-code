import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

let A,
  B,
  C,
  IP = 0;

A = lines[0].match(/\d+/)[0];
B = lines[1].match(/\d+/)[0];
C = lines[2].match(/\d+/)[0];

const program = lines[4]
  .replace('Program: ', '')
  .split(',')
  .map((n) => Number(n));

let output: number[] = [];

function convertCombo(operand: number): number {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand;
    case 4:
      return A;
    case 5:
      return B;
    case 6:
      return C;
    case 7:
      throw 'Combo 7 is reserved';
  }
}

// Opcode 0
function adv(combo: number) {
  const value = convertCombo(combo);
  A = Math.floor(A / Math.pow(2, value));

  IP += 2;
}

// Opcode 1
function bxl(literal: number) {
  B = (B ^ literal) >>> 0;

  IP += 2;
}

// Opcode 2
function bst(combo: number) {
  const value = convertCombo(combo);
  B = value % 8;

  IP += 2;
}

// Opcode 3
function jnz(literal: number) {
  if (A === 0) {
    IP += 2;
    return;
  }

  IP = literal;
}

// Opcode 4
function bxc() {
  B = (B ^ C) >>> 0;

  IP += 2;
}

// Opcode 5
function out(combo: number) {
  const value = convertCombo(combo) % 8;
  output.push(value);

  if (output[0] !== program[0]) throw 'Exit Early';

  IP += 2;
}

// Opcode 6
function bdv(combo: number) {
  const value = convertCombo(combo);
  B = Math.floor(A / Math.pow(2, value));

  IP += 2;
}

// Opcode 7
function cdv(combo: number) {
  const value = convertCombo(combo);
  C = Math.floor(A / Math.pow(2, value));

  IP += 2;
}

const instructionMap = [adv, bxl, bst, jnz, bxc, out, bdv, cdv];
const instructionNames = ['adv', 'bxl', 'bst', 'jnz', 'bxc', 'out', 'bdv', 'cdv'];

function runProgram(program: number[]) {
  B = 0;
  C = 0;
  IP = 0;
  output = [];

  while (IP < program.length) {
    const opcode = program[IP];
    const operand = program[IP + 1];

    // console.log(instructionNames[opcode], [opcode, operand], A);

    instructionMap[opcode](operand);
  }
}

function prevalidate(digit: number): boolean {
  // check adv 3 FIRST
  if (Math.floor(A / 8) === 0) return false;

  // bst 4
  // B = A % 8;

  // bxl 3
  // B = B ^ 3;

  // bst 4 + bxl 3
  B = A % 8;
  B = (B ^ 3) >>> 0;

  // cdv 5
  C = Math.floor(A / Math.pow(2, B));

  // bxc 0
  // B = B ^ C;

  // bxl 3
  // B = B ^ 3;

  // bxc 0 + bxl 3
  B = (B ^ C) >>> 0;
  B = (B ^ 3) >>> 0;

  // adv 3 (checked at top, but still needs to be set)
  A = Math.floor(A / 8);

  // jnz 0 (only jump if A !== 0)

  return B % 8 === digit;
}

// console.log({ A, B, C, IP, program });

const total = 100000000000;

let best = 0;

const start = Date.now();
for (let i = 0; i < total; i++) {
  // const start = i;
  const start = i * Math.pow(8, 11) + 0o30145714775;
  // const start = i * Math.pow(8, 7) + 0o5714775;

  // More than    80009898727933
  // 387031340915197;
  if (start > 376214230145714775) {
    throw 'CANNOT SOLVE';
  }

  A = start;
  B = 0;
  C = 0;

  // if (i % 10000000 === 0) console.log(start);

  let skip = false;

  for (let j = 0; j < program.length; j++) {
    if (!prevalidate(program[j])) {
      skip = true;
      break;
    } else {
      if (j >= best) {
        console.log(j.toString().padStart(2, ' '), start.toString(8).padStart(20, ' '), start.toString().padStart(20, ' ')); // here are some of the end digits (octal) 0o3014, 0o5714775, 0o130145714775
        best = j;
      }
    }
  }

  if (skip) continue;

  try {
    A = start;
    runProgram(program);

    if (output.length === program.length && JSON.stringify(output) === JSON.stringify(program)) {
      console.log('\n\nFOUND', i);
      break;
    }
  } catch (err) {}
}

console.log('Program time:', (Date.now() - start) / 1000);
