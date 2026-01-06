import { readFileSync } from 'fs';
import { join } from 'path';
import { setBit } from '../util/bits';
import { randInRange } from '../util/utils';

const data = readFileSync(join(__dirname, 'sample1.txt')).toString();
const lines = data.trim().split('\n');

type Machine = {
  lights: number;
  totalLights: number;

  buttons: number[][];
  joltages: number[];
};

const machines: Machine[] = lines.map((l) => {
  const [light, button, joltage] = l.split(/[\]{]/);

  let lights = 0;
  const allLights = light
    .replace('[', '')
    .split('')
    .map((l) => l === '#');
  allLights.forEach((l, i) => {
    if (l) lights = setBit(lights, i);
  });

  const totalLights = allLights.length;

  const buttons = button
    .trim()
    .split(' ')
    .map((b) =>
      b
        .replace(/[()]/, '')
        .split(',')
        .map((n) => Number.parseInt(n))
    );

  const joltages = joltage
    .replace('}', '')
    .split(',')
    .map((j) => Number.parseInt(j));

  return {
    lights,
    totalLights,

    buttons,
    joltages,
  };
});

function printMachine(machine: Machine) {
  console.log(
    `Lights: ${machine.lights.toString(2).padStart(machine.totalLights, '0')}, Buttons: [${machine.buttons}], Joltages: ${machine.joltages}`
  );
}

// console.log(machines);
// printMachine(machines[0]);

console.log(machines[0]);

let total = 0;

machines.forEach((m, i) => {
  console.log('#' + i);

  let min = { min: Number.MAX_SAFE_INTEGER, buttons: undefined };

  const iterations = Math.pow(10, m.buttons.length);
  for (let i = 0; i < iterations; i++) {
    const buttons = [];
    const state = Array(m.joltages.length).fill(0);

    for (let j = 0; j < m.buttons.length * 3; j++) {
      const button = randInRange(0, m.buttons.length - 1);

      for (let b = 0; b < m.buttons.length; b++) {
        state[button]++;
      }

      console.log(m.joltages.join(''), state.join(''));

      if (m.joltages.join('') === state.join('')) {
        if (j < min.min) {
          min.min = j;
          min.buttons = buttons;
        }
        break;
      }
    }
  }

  if (min.buttons) {
    // console.log(min);
    total += min.min;
  } else {
    throw 'Could not find solution for machine #' + i;
  }
});

console.log();
console.log('Total:', total);
