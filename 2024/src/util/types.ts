export type Point = {
  x: number;
  y: number;
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

  /** Clone the vector - usually before use in a math operation */
  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  toString() {
    return `[${this.x}, ${this.y}]`;
  }
}
