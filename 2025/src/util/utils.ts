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

/** Iterate each item in an array of strings */
export function iterate2DString(
  lines: string[],
  callback: (x: number, y: number, value: string) => void,
  separator?: string
) {
  for (let y = 0; y < lines.length; y++) {
    const row = lines[y].split(separator || '');
    for (let x = 0; x < row.length; x++) {
      callback(x, y, row[x]);
    }
  }
}

/** Build a 2d grid from array of strings with optional value transform */
export function buildGrid<T>(lines: string[], transform?: (value: string) => T, separator?: string): T[][] {
  const grid: T[][] = [];

  iterate2DString(
    lines,
    (x, y, value) => {
      grid[y] = grid[y] || [];
      grid[y][x] = transform ? transform(value) : (value as T);
    },
    separator
  );

  return grid;
}

/** Helper to build 2d number grid */
export function buildNumberGrid(lines: string[], separator?: string): number[][] {
  return buildGrid<number>(lines, (value) => Number(value), separator);
}

/** Helper to build 2d string grid */
export function buildStringGrid(lines: string[], separator?: string): string[][] {
  return buildGrid<string>(lines, (value) => value, separator);
}

export function iterateGrid<T>(grid: T[][], callback: (x: number, y: number, value: T) => void) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      callback(x, y, grid[y][x]);
    }
  }
}

export function createEmptyGrid<T>(width: number, height: number, value?: T): T[][] {
  return Array.from({ length: height }, () => Array(width).fill(value || undefined));
}
