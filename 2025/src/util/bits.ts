export function getBit(number: number, position: number): number {
  return (number >> position) & 1;
}

export function setBit(number: number, position: number): number {
  return number | (1 << position);
}

export function clearBit(number: number, position: number): number {
  return number & ~(1 << position);
}

export function toggleBit(number: number, position: number): number {
  return number ^ (1 << position);
}
