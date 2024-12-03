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

function countBag(bag, count, spaces) {
  console.log('');
  console.log(' '.repeat(spaces), 'checking', count, bag, bags[bag]);

  const initialCount = count;

  Object.entries(bags[bag]).forEach((b) => {
    if (b) count += initialCount * countBag(b[0], b[1], spaces + 4);
  });

  console.log(' '.repeat(spaces), initialCount, bag, 'has', count, 'bags (including self)');

  return count;
}

// Off by 1 since I am counting the initial bag
const value = countBag('shiny gold', 1, 0) - 1;
console.log(value);
