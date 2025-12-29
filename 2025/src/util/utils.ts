import { Neighbors, Point, PointWithValue } from './types';

// Mod for negative number, from https://stackoverflow.com/a/17323608/2303432
export function mod(n, m) {
  return ((n % m) + m) % m;
}

export const Color = {
  Black: 30,
  Red: 31,
  Green: 32,
  Yellow: 33,
  Blue: 34,
  Magenta: 35,
  Cyan: 36,
  White: 37,
};

export function color(str: string, color: (typeof Color)[keyof typeof Color]): string {
  return `\x1b[${color}m${str}\x1b[0m`;
}

export function bold(str: string): string {
  return `\x1b[1m${str}\x1b[0m`;
}

/** Shuffle an array in place */
export function shuffle<T>(array: T[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}
