import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'sample2.txt')).toString();
const lines = data.trim().split('\n');

let A,
  B,
  C,
  IP = 0;

A = Number(lines[0].match(/\d+/)[0]);
B = Number(lines[1].match(/\d+/)[0]);
C = Number(lines[2].match(/\d+/)[0]);

const program = lines[4]
  .replace('Program: ', '')
  .split(',')
  .map((n) => Number(n));

const output: number[] = [];

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
  B = B ^ literal;

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
  B = B ^ C;

  IP += 2;
}

// Opcode 5
function out(combo: number) {
  const value = convertCombo(combo) % 8;
  output.push(value);

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

function runProgram(program: number[]) {
  IP = 0;

  while (IP < program.length) {
    const opcode = program[IP];
    const operand = program[IP + 1];

    instructionMap[opcode](operand);
  }

  console.log();
  console.log({ A, B, C, IP, program });

  if (output.length > 0) console.log('Output:', output.join(','));
}

runProgram(program);
