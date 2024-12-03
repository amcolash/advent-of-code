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
      } else if (seat === OCCUPIED && count >= 5) {
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

  count += isOccupied(x, y, -1, -1) ? 1 : 0;
  count += isOccupied(x, y, 0, -1) ? 1 : 0;
  count += isOccupied(x, y, 1, -1) ? 1 : 0;

  count += isOccupied(x, y, -1, 0) ? 1 : 0;
  count += isOccupied(x, y, 1, 0) ? 1 : 0;

  count += isOccupied(x, y, -1, 1) ? 1 : 0;
  count += isOccupied(x, y, 0, 1) ? 1 : 0;
  count += isOccupied(x, y, 1, 1) ? 1 : 0;

  return count;
}

function isOccupied(x, y, dx, dy) {
  x += dx;
  y += dy;

  while (y >= 0 && y < seats.length && x >= 0 && x < seats[0].length) {
    if (seats[y][x] === OCCUPIED) return true;
    if (seats[y][x] === EMPTY) return false;

    x += dx;
    y += dy;
  }

  return false;
}

function displaySeats(seats) {
  seats.forEach((r, i) => {
    if (i > 15) return; // Truncate to only part of the seats
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
