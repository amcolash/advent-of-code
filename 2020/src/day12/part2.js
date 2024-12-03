const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

const directions = input.split('\n').map((d) => {
  const match = d.match(/([A-Z]+)(\d+)/);
  return [match[1], Number.parseInt(match[2])];
});

let sX = 0;
let sY = 0;

let wX = 10;
let wY = 1;

directions.forEach((d, i) => {
  if (d[0] === 'N') wY += d[1];
  if (d[0] === 'S') wY -= d[1];
  if (d[0] === 'E') wX += d[1];
  if (d[0] === 'W') wX -= d[1];

  if (d[0] === 'L' || d[0] === 'R') {
    let r = d[1];
    if (d[0] === 'R') r = 360 - r;

    const sin = Math.round(Math.sin(r * (Math.PI / 180)));
    const cos = Math.round(Math.cos(r * (Math.PI / 180)));

    const x = wX;
    const y = wY;

    wX = x * cos - y * sin;
    wY = x * sin + y * cos;
  }

  if (d[0] === 'F') {
    sX += wX * d[1];
    sY += wY * d[1];
  }
});

console.log('sX:', sX, 'sY:', sY, 'wX:', wX, 'wY:', wY);
console.log(Math.abs(sX) + Math.abs(sY));
