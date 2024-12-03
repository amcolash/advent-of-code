const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

const directions = input.split('\n').map((d) => {
  const match = d.match(/([A-Z]+)(\d+)/);
  return [match[1], Number.parseInt(match[2])];
});

let x = 0;
let y = 0;
let r = 0;

directions.forEach((d, i) => {
  if (d[0] === 'N') y += d[1];
  if (d[0] === 'S') y -= d[1];
  if (d[0] === 'E') x += d[1];
  if (d[0] === 'W') x -= d[1];

  if (d[0] === 'L') r = (r + d[1]) % 360;
  if (d[0] === 'R') r = (r - d[1]) % 360;
  while (r < 0) r += 360;

  if (d[0] === 'F') {
    if (r === 0) x += d[1];
    if (r === 90) y += d[1];
    if (r === 180) x -= d[1];
    if (r === 270) y -= d[1];
  }
});

console.log('x:', x, 'y:', y, 'r:', r);
console.log(Math.abs(x) + Math.abs(y));
