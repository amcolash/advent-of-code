const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

const bags = {};
input.split('\n').forEach((b) => {
  const matches = b.match(/([\w\s]+) bags contain ([\w\s\,\.]+)/);

  const main = matches[1];
  const contents = {};
  matches[2].split(',').forEach((b) => {
    const match = b.match(/(\d+) ([\w\s]+) bag/);
    if (match) contents[match[2]] = Number.parseInt(match[1]);
  });

  bags[main] = contents;
});

function hasBag(bag, search) {
  if (bag[search] > 0) return true;

  let found = false;
  Object.keys(bag).forEach((b) => {
    if (hasBag(bags[b], search)) found = true;
  });

  return found;
}

let count = 0;
const toCheck = 'shiny gold';

Object.values(bags).forEach((b) => {
  if (hasBag(b, toCheck)) count++;
});

console.log(count);
