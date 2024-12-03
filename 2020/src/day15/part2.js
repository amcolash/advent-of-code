const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

const numbers = Array(30000000);

let last = 0;
let turn = 1;
const stopTurn = 30000000;

function speak(number) {
  if (!numbers[number] || numbers[number].first === undefined) numbers[number] = { turnOld: turn, turnNew: turn, first: true };
  else numbers[number].first = false;

  numbers[number].turnOld = numbers[number].turnNew;
  numbers[number].turnNew = turn;

  last = number;
  turn++;
}

input.split(',').forEach((n) => speak(Number.parseInt(n)));

let counter = turn;
while (turn <= stopTurn) {
  if (counter >= 100000) {
    console.log(turn, Object.keys(numbers).length);
    counter = 0;
  }
  counter++;

  const lastNum = numbers[last];
  if (lastNum.first) {
    speak(0);
  } else {
    speak(lastNum.turnNew - lastNum.turnOld);
  }
}

console.log();
console.log(last);
