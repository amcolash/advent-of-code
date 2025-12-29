import { Neighbors, Point, PointWithValue } from './types';

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

export function printGrid<T>(grid: T[][]) {
  for (let y = 0; y < grid.length; y++) {
    console.log(grid[y].join(''));
  }
}

export function getPointWithValue<T>(x: number, y: number, grid: T[][]): PointWithValue<T | undefined> {
  return { x, y, value: grid[y] ? grid[y][x] : undefined };
}

export function getNeighborCells<T>(point: Point, grid: T[][]): Neighbors<T> {
  const neighbors: Neighbors<T> = {};

  neighbors.N = getPointWithValue(point.x, point.y - 1, grid);
  neighbors.S = getPointWithValue(point.x, point.y + 1, grid);
  neighbors.E = getPointWithValue(point.x + 1, point.y, grid);
  neighbors.W = getPointWithValue(point.x - 1, point.y, grid);

  neighbors.NE = getPointWithValue(point.x + 1, point.y - 1, grid);
  neighbors.NW = getPointWithValue(point.x - 1, point.y - 1, grid);
  neighbors.SE = getPointWithValue(point.x + 1, point.y + 1, grid);
  neighbors.SW = getPointWithValue(point.x - 1, point.y + 1, grid);

  return neighbors;
}
