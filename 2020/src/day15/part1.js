const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

const numbers = {};

let last = 0;
let turn = 1;
const stopTurn = 2020;

function speak(number) {
  // console.log(turn, number);

  if (!numbers[number]) numbers[number] = { turnOld: turn, turnNew: turn, first: true };
  else numbers[number].first = false;

  numbers[number].turnOld = numbers[number].turnNew;
  numbers[number].turnNew = turn;

  last = number;
  turn++;
}

input.split(',').forEach((n) => speak(n));

while (turn <= stopTurn) {
  const lastNum = numbers[last];
  if (lastNum.first) {
    speak(0);
  } else {
    speak(lastNum.turnNew - lastNum.turnOld);
  }
}

// console.log();
console.log(last);
// console.log(numbers);
