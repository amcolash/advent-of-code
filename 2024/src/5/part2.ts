import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

/** This page must occur _before_ the numbers in the list */
const beforeRules = {};

/** This page must occur _after_ the numbers in the list */
const afterRules = {};

const updates = [];

let parseRules = true;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line === '') {
    parseRules = false;
    continue;
  }

  if (parseRules) {
    const rule = line.split('|');
    beforeRules[rule[0]] = beforeRules[rule[0]] || [];
    beforeRules[rule[0]].push(Number(rule[1]));

    afterRules[rule[1]] = afterRules[rule[1]] || [];
    afterRules[rule[1]].push(Number(rule[0]));
  } else {
    const update = line.split(',').map((p) => Number(p));
    updates.push(update);
  }
}

function checkPage(page: number, pages: number[]): boolean {
  let valid = true;

  const before = beforeRules[page];
  const after = afterRules[page];

  // ensure the page occurs before other pages
  before?.forEach((b) => {
    if (pages.includes(b)) valid = false;
  });

  pages.forEach((p) => {
    if (!after?.includes(p)) valid = false;
  });

  return valid;
}

function getPages(update: number[], solution: number[]) {
  return solution.map((s) => update[s]);
}

function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

function solveSequence(update: number[]): number[] {
  const solution = [];

  let fail = 0;
  let i = 0;
  while (solution.length < update.length) {
    if (!solution.includes(i)) {
      // console.log('checking', update[i], solution);

      if (checkPage(update[i], getPages(update, solution))) {
        // console.log('valid');
        solution.push(i);
        i = 0;
      } else {
        // console.log('invalid');
        const invalid = solution.pop();
        i = invalid + 1;
      }
    } else {
      i++;
    }

    fail++;
    if (fail > factorial(update.length)) {
      throw `failed to find solution for ${update}`;
    }
  }

  return getPages(update, solution);
}

let total = 0;

updates.forEach((update) => {
  let pages = [];

  for (let i = 0; i < update.length; i++) {
    const page = update[i];
    const pageValid = checkPage(page, pages);
    // console.log({ page, pageValid });

    if (pageValid) pages.push(page);
    else break;
  }

  if (pages.length === update.length) {
    console.log('Ignoring Valid Sequence', update, '\n');
  } else {
    console.error('Invalid Sequence', update);

    const fixed = solveSequence(update);
    const middle = fixed[Math.ceil(fixed.length / 2) - 1];

    console.log('Fixed Sequence', fixed, ':', middle, '\n');
    total += middle;
  }
});

console.log();
console.log(total);
