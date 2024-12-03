const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

let count = 0;
input.split('\n\n').forEach((g) => {
  const group = g.trim().split('\n');
  const questions = [];

  group.forEach((p) => p.split('').forEach((l) => (questions[l] = (questions[l] || 0) + 1)));

  Object.values(questions).forEach((q) => {
    if (q === group.length) {
      count++;
    }
  });
});

console.log(count);
