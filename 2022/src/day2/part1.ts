import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const rounds = data.split('\n');

// A Rock, B Paper, C Scissors
const itemScore = {
  X: 1, // Rock
  Y: 2, // Paper
  Z: 3, // Scissors
};

enum Opponent {
  Rock = 'A',
  Paper = 'B',
  Scissors = 'C',
}

enum Player {
  Rock = 'X',
  Paper = 'Y',
  Scissors = 'Z',
}

const draw = 3;
const win = 6;

function runGame(opponent: string, player: string): number {
  if (player === Player.Rock && opponent === Opponent.Scissors) return win;
  if (player === Player.Rock && opponent === Opponent.Rock) return draw;

  if (player === Player.Paper && opponent === Opponent.Rock) return win;
  if (player === Player.Paper && opponent === Opponent.Paper) return draw;

  if (player === Player.Scissors && opponent === Opponent.Paper) return win;
  if (player === Player.Scissors && opponent === Opponent.Scissors) return draw;

  return 0;
}

let score = 0;
rounds.forEach((r) => {
  const items = r.split(' ');

  const opponent = items[0] as 'X' | 'Y' | 'Z';
  const player = items[1] as 'X' | 'Y' | 'Z';

  score += itemScore[player];
  score += runGame(opponent, player);
});

console.log('Part 1', score);
