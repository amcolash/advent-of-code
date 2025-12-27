import { inspect } from 'util';

export type Point = {
  x: number;
  y: number;
};

export type Point3 = {
  x: number;
  y: number;
  z: number;
};

export type PointWithValue<T> = Point & {
  value: T;
};

export type Neighbors<T> = {
  N?: PointWithValue<T>;
  S?: PointWithValue<T>;
  E?: PointWithValue<T>;
  W?: PointWithValue<T>;

  NE?: PointWithValue<T>;
  NW?: PointWithValue<T>;
  SE?: PointWithValue<T>;
  SW?: PointWithValue<T>;
};

export class Vector {
  static ZERO: Point = { x: 0, y: 0 };

  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /** Construct a vector from a point */
  static fromPoint(point: Point) {
    return new Vector(point.x, point.y);
  }

  static fromArray(arr: number[]) {
    return new Vector(arr[0], arr[1]);
  }

  static fromString(str: string, separator: string = ',') {
    return Vector.fromArray(str.split(separator).map((n) => Number.parseInt(n)));
  }

  /** Adds vectors (modifies the original vector) */
  add(vec: Vector | Point): Vector {
    this.x += vec.x;
    this.y += vec.y;

    return this;
  }

  /** Subtracts vectors (modifies the original vector) */
  sub(vec: Vector | Point): Vector {
    this.x -= vec.x;
    this.y -= vec.y;

    return this;
  }

  /** Multiplies vectors (modifies the original vector) */
  mul(vec: Vector | Point): Vector {
    this.x *= vec.x;
    this.y *= vec.y;

    return this;
  }

  /** Divides vectors (modifies the original vector) */
  div(vec: Vector | Point): Vector {
    this.x /= vec.x;
    this.y /= vec.y;

    return this;
  }

  /** Distance between this vector and another */
  length(vec: Vector | Point): number {
    return Math.sqrt(Math.pow(this.x - vec.x, 2) + Math.pow(this.y - vec.y, 2));
  }

  /** Squared distance between this vector and another */
  squaredLength(vec: Vector | Point): number {
    return Math.pow(this.x - vec.x, 2) + Math.pow(this.y - vec.y, 2);
  }

  /** Calculate the area of a rectangle made between this vector and another */
  area(vec: Vector | Point): number {
    return (Math.abs(this.x - vec.x) + 1) * (Math.abs(this.y - vec.y) + 1);
  }

  /** Set this vector to the values of another Vector/Point */
  set(vec: Vector | Point): Vector {
    this.x = vec.x;
    this.y = vec.y;

    return this;
  }

  /** Check if numberically equal to another vector/point */
  eq(vec: Vector | Point): boolean {
    return this.x === vec.x && this.y === vec.y;
  }

  /** Clone the vector - usually before use in a math operation */
  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  /** Convert a Vector to a Point */
  toPoint(): Point {
    return { x: this.x, y: this.y };
  }

  toString() {
    return `[${this.x}, ${this.y}]`;
  }

  /** Override nodejs console output */
  [inspect.custom]() {
    return this.toString();
  }
}

export class Vector3 {
  static ZERO: Point3 = { x: 0, y: 0, z: 0 };

  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /** Adds vectors (modifies the original vector) */
  add(vec: Vector3 | Point3): Vector3 {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;

    return this;
  }

  /** Subtracts vectors (modifies the original vector) */
  sub(vec: Vector3 | Point3): Vector3 {
    this.x -= vec.x;
    this.y -= vec.y;
    this.z -= vec.z;

    return this;
  }

  /** Multiplies vectors (modifies the original vector) */
  mul(vec: Vector3 | Point3): Vector3 {
    this.x *= vec.x;
    this.y *= vec.y;
    this.z *= vec.z;

    return this;
  }

  /** Divides vectors (modifies the original vector) */
  div(vec: Vector3 | Point3): Vector3 {
    this.x /= vec.x;
    this.y /= vec.y;
    this.z /= vec.z;

    return this;
  }

  /** Distance between this vector and another */
  length(vec: Vector3 | Point3): number {
    return Math.sqrt(Math.pow(this.x - vec.x, 2) + Math.pow(this.y - vec.y, 2) + Math.pow(this.z - vec.z, 2));
  }

  /** Squared distance between this vector and another */
  squaredLength(vec: Vector3 | Point3): number {
    return Math.pow(this.x - vec.x, 2) + Math.pow(this.y - vec.y, 2) + Math.pow(this.z - vec.z, 2);
  }

  /** Set this vector to the values of another Vector/Point */
  set(vec: Vector3 | Point3): Vector3 {
    this.x = vec.x;
    this.y = vec.y;
    this.z = vec.z;

    return this;
  }

  /** Check if numberically equal to another vector/point */
  eq(vec: Vector3 | Point3): boolean {
    return this.x === vec.x && this.y === vec.y && this.z === vec.z;
  }

  /** Clone the vector - usually before use in a math operation */
  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  toString() {
    return `[${this.x}, ${this.y}, ${this.z}]`;
  }

  /** Override nodejs console output */
  [inspect.custom]() {
    return this.toString();
  }
}

export function add(vec1: Vector | Point, vec2: Vector | Point): Point {
  return { x: vec1.x + vec2.x, y: vec1.y + vec2.y };
}

export function pretty(point: Point): string {
  return `[${point.x}, ${point.y}]`;
}
