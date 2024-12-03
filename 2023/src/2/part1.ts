import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const gameCubes = {
  red: 12,
  green: 13,
  blue: 14,
};

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

  let red = gameCubes.red;
  let green = gameCubes.green;
  let blue = gameCubes.blue;

  rounds.split(';').forEach((round, i) => {
    const roundObj: Round = { index: i + 1 };
    const cubes = round.split(',');
    cubes.forEach((cube) => {
      const parts = cube.trim().split(' ');
      const num = Number.parseInt(parts[0]);
      const color = parts[1];

      roundObj[color] = num;
    });

    if (roundObj.red) red -= roundObj.red;
    if (roundObj.green) green -= roundObj.green;
    if (roundObj.blue) blue -= roundObj.blue;

    game.rounds.push(roundObj);
  });

  games.push(game);
});

let total = 0;

// Simulate games
games.forEach((game) => {
  let valid = true;
  game.rounds.forEach((round) => {
    if ((round.red || 0) > gameCubes.red) valid = false;
    if ((round.green || 0) > gameCubes.green) valid = false;
    if ((round.blue || 0) > gameCubes.blue) valid = false;
  });

  if (valid) {
    // console.log(`Game ${game.index} is possible`);
    total += game.index;
  } else {
    // console.log(`Game ${game.index} is not possible, missing cubes: ${red} red, ${green} green, ${blue} blue`);
  }
});

console.log(`Total: ${total}`);
