const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input2.txt')).toString().trim();

const INACTIVE = '.';
const ACTIVE = '#';

const dims = 3;
const middle = (dims - 1) / 2;
const empty = new Array(dims).fill(new Array(dims).fill(INACTIVE));

let middleArray = input.split('\n').map((r) => r.split(''));
let squares = [];

for (let i = 0; i < dims; i++) {
  squares.push(JSON.parse(JSON.stringify(empty)));
}
squares[middle] = JSON.parse(JSON.stringify(middleArray));

/**

  Before any cycles:

  z=0
  .#.
  ..#
  ###


  After 1 cycle:

  z=-1
  #..
  ..#
  .#.

  z=0
  #.#
  .##
  .#.

  z=1
  #..
  ..#
  .#.

 */

let round = 0;
function simulateRound() {
  const updated = JSON.parse(JSON.stringify(squares));

  for (let z = 0; z < squares.length; z++) {
    const layer = squares[z];
    for (let y = 0; y < layer.length; y++) {
      const row = layer[y];
      let countStr = '';
      for (let x = 0; x < row.length; x++) {
        const square = row[x];
        const count = adjacentCount(x, y, z);
        countStr += count;
        // console.log(x, y, z, count);

        if (square === INACTIVE && count === 3) {
          updated[z][y][x] = ACTIVE;
        } else if (square === ACTIVE && count !== 2 && count !== 3) {
          updated[z][y][x] = INACTIVE;
        }
      }

      console.log(countStr);
    }

    console.log();
  }

  const stabilized = JSON.stringify(squares) === JSON.stringify(updated);

  squares = updated;
  round++;

  return stabilized;
}

function adjacentCount(x, y, z) {
  let count = 0;

  for (let layer = z - 1; layer <= z + 1; layer++) {
    if (layer < 0 || layer > squares.length - 1) continue;

    const layerArr = squares[layer];

    count += isOccupied(x - 1, y - 1, layerArr) ? 1 : 0;
    count += isOccupied(x, y - 1, layerArr) ? 1 : 0;
    count += isOccupied(x + 1, y - 1, layerArr) ? 1 : 0;

    count += isOccupied(x - 1, y, layerArr) ? 1 : 0;
    if (layer !== z) count += isOccupied(x, y, layerArr) ? 1 : 0;
    count += isOccupied(x + 1, y, layerArr) ? 1 : 0;

    count += isOccupied(x - 1, y + 1, layerArr) ? 1 : 0;
    count += isOccupied(x, y + 1, layerArr) ? 1 : 0;
    count += isOccupied(x + 1, y + 1, layerArr) ? 1 : 0;
  }

  return count;
}

function isOccupied(x, y, layer) {
  if (y < 0 || y > layer.length - 1) return false;
  if (x < 0 || x > layer[y].length - 1) return false;
  return layer[y][x] === ACTIVE;
}

function displaySquares(squares) {
  console.log('\nCycle', cycle, 'Occupied', countOccupied(), '\n');
  squares.forEach((l, li) => {
    l.forEach((r, ri) => {
      if (ri > 15) return;
      console.log(r.join(''));
    });
    console.log();
  });
}

function countOccupied() {
  let count = 0;

  for (let z = 0; z < squares.length; z++) {
    const layer = squares[z];
    for (let y = 0; y < layer.length; y++) {
      const row = layer[y];
      for (let x = 0; x < row.length; x++) {
        if (row[x] === ACTIVE) count++;
      }
    }
  }

  return count;
}

let stabilized = false;
let cycle = 0;
const numCycles = 3;

displaySquares(squares);
simulateRound();
displaySquares(squares);

return;

while (!stabilized && cycle < numCycles) {
  cycle++;
  stabilized = simulateRound();
  displaySquares(squares);
}
