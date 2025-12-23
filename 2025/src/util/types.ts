export type Point = {
  x: number;
  y: number;
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
}

export function add(vec1: Vector | Point, vec2: Vector | Point): Point {
  return { x: vec1.x + vec2.x, y: vec1.y + vec2.y };
}

export function pretty(point: Point): string {
  return `[${point.x}, ${point.y}]`;
}
