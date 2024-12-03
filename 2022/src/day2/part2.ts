import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const rounds = data.split('\n');

// A Rock, B Paper, C Scissors
const itemScore = {
  Rock: 1,
  Paper: 2,
  Scissors: 3,
};

const result = {
  X: 0, // Lose,
  Y: 3, // Draw
  Z: 6, // Win
};

enum Opponent {
  Rock = 'A',
  Paper = 'B',
  Scissors = 'C',
}

enum Outcome {
  Lose = 'X',
  Draw = 'Y',
  Win = 'Z',
}

const draw = 3;
const win = 6;

function determineItem(opponent: string, outcome: string): number {
  if (outcome === Outcome.Win && opponent === Opponent.Rock) return itemScore.Paper;
  if (outcome === Outcome.Lose && opponent === Opponent.Rock) return itemScore.Scissors;
  if (outcome === Outcome.Draw && opponent === Opponent.Rock) return itemScore.Rock;

  if (outcome === Outcome.Win && opponent === Opponent.Paper) return itemScore.Scissors;
  if (outcome === Outcome.Lose && opponent === Opponent.Paper) return itemScore.Rock;
  if (outcome === Outcome.Draw && opponent === Opponent.Paper) return itemScore.Paper;

  if (outcome === Outcome.Win && opponent === Opponent.Scissors) return itemScore.Rock;
  if (outcome === Outcome.Lose && opponent === Opponent.Scissors) return itemScore.Paper;
  if (outcome === Outcome.Draw && opponent === Opponent.Scissors) return itemScore.Scissors;

  return 0;
}

let score = 0;
rounds.forEach((r) => {
  const items = r.split(' ');

  const opponent = items[0] as 'A' | 'B' | 'C';
  const outcome = items[1] as 'X' | 'Y' | 'Z';

  score += result[outcome];
  score += determineItem(opponent, outcome);
});

console.log('Part 2', score);
