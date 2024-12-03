import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

interface Round {
  index: number;
  red?: number;
  green?: number;
  blue?: number;
}

interface Game {
  index: number;
  rounds: Round[];
}

const games: Game[] = [];

// Game parsing
lines.forEach((line, i) => {
  const game: Game = { index: i + 1, rounds: [] };
  const rounds = line.split(':')[1].trim();

  rounds.split(';').forEach((round, i) => {
    const roundObj: Round = { index: i + 1 };
    const cubes = round.split(',');
    cubes.forEach((cube) => {
      const parts = cube.trim().split(' ');
      const num = Number.parseInt(parts[0]);
      const color = parts[1];

      roundObj[color] = num;
    });

    game.rounds.push(roundObj);
  });

  games.push(game);
});

let total = 0;

// Simulate games
games.forEach((game) => {
  let maxRed = 0;
  let maxGreen = 0;
  let maxBlue = 0;

  game.rounds.forEach((round) => {
    maxRed = Math.max(maxRed, round.red || 0);
    maxGreen = Math.max(maxGreen, round.green || 0);
    maxBlue = Math.max(maxBlue, round.blue || 0);
  });

  const power = maxRed * maxGreen * maxBlue;
  total += power;
});

console.log(`Total: ${total}`);
