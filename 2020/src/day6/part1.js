const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

let count = 0;
input.split('\n\n').forEach((g) => {
  const questions = new Set();
  g.split('\n').forEach((p) => {
    p.split('').forEach((l) => questions.add(l));
  });

  count += questions.size;
});

console.log(count);
