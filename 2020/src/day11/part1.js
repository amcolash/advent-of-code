const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

let seats = input.split('\n').map((r) => r.split(''));

const EMPTY = 'L';
const OCCUPIED = '#';

let round = 0;
function simulateRound() {
  const updated = JSON.parse(JSON.stringify(seats));

  for (let y = 0; y < seats.length; y++) {
    const row = seats[y];
    for (let x = 0; x < row.length; x++) {
      const seat = row[x];
      const count = adjacentCount(x, y);
      if (seat === EMPTY && count === 0) {
        updated[y][x] = OCCUPIED;
      } else if (seat === OCCUPIED && count >= 4) {
        updated[y][x] = EMPTY;
      }
    }
  }

  const stabilized = JSON.stringify(seats) === JSON.stringify(updated);

  seats = updated;
  round++;

  return stabilized;
}

function adjacentCount(x, y) {
  let count = 0;

  count += isOccupied(x - 1, y - 1) ? 1 : 0;
  count += isOccupied(x, y - 1) ? 1 : 0;
  count += isOccupied(x + 1, y - 1) ? 1 : 0;

  count += isOccupied(x - 1, y) ? 1 : 0;
  count += isOccupied(x + 1, y) ? 1 : 0;

  count += isOccupied(x - 1, y + 1) ? 1 : 0;
  count += isOccupied(x, y + 1) ? 1 : 0;
  count += isOccupied(x + 1, y + 1) ? 1 : 0;

  return count;
}

function isOccupied(x, y) {
  if (y < 0 || y > seats.length - 1) return false;
  if (x < 0 || x > seats[y].length - 1) return false;
  return seats[y][x] === OCCUPIED;
}

function displaySeats(seats) {
  seats.forEach((r, i) => {
    if (i > 15) return;
    console.log(r.join(''));
  });
  console.log();
}

function countOccupied() {
  let count = 0;

  for (let y = 0; y < seats.length; y++) {
    const row = seats[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] === OCCUPIED) count++;
    }
  }

  return count;
}

let stabilized = false;
while (!stabilized) {
  stabilized = simulateRound();
  displaySeats(seats);
}

console.log('round', round, 'occupied', countOccupied());
