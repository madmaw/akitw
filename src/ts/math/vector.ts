///<reference path="../constants.ts"/>

type Vector2 = [number, number];
type ReadonlyVector2 = readonly [number, number];
type Rect2 = [Vector2, Vector2];
type ReactonlyRect2 = readonly [ReadonlyVector2, ReadonlyVector2];

type Vector3 = [number, number, number];
type ReadonlyVector3 = readonly [number, number, number];
type Rect3 = [Vector3, Vector3];
type ReadonlyRect3 = readonly [ReadonlyVector3, ReadonlyVector3];

type Vector4 = [number, number, number, number];
type ReadonlyVector4 = readonly [number, number, number, number];

const VECTOR3_EMPTY: ReadonlyVector3 = [0, 0, 0];

const vector2AngleAndDistance = ([x1, y1]: Vector2, [x2, y2]: Vector2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return [Math.atan2(dy, dx), Math.pow(dx*dx + dy*dy, .5)];
}

const vector2Rotate = (a: number, p: ReadonlyVector2, c: readonly number[] = [0, 0]): ReadonlyVector2 => {
  const sin = Math.sin(a);
  const cos = Math.cos(a);
  const [ox, oy] = vectorNSubtract(p, c);
  const [cx, cy] = c;
  return [
    ox * cos - oy * sin + cx,
    ox * sin + oy * cos + cy,
  ];
}

const vector3TransformMatrix4 = (m: ReadonlyMatrix4 | Falsey, x: number, y: number, z: number): Vector3 => 
    m && vector4TransformMatrix4(m, x, y, z).slice(0, 3) as Vector3 || [x, y, z];

const vector4TransformMatrix4 = (m: ReadonlyMatrix4, x: number, y: number, z: number): Vector4 => {
  let w = (m[3] * x + m[7] * y + m[11] * z + m[15]) || 1.;
  return [
      (m[0] * x + m[4] * y + m[8] * z + m[12]) / w,
      (m[1] * x + m[5] * y + m[9] * z + m[13]) / w,
      (m[2] * x + m[6] * y + m[10] * z + m[14]) / w,
      w,
  ];
}

const vector3CrossProduct = (v1: ReadonlyVector3, v2: ReadonlyVector3): ReadonlyVector3 => {
    return [
        v1[1] * v2[2] - v1[2] * v2[1],
        v1[2] * v2[0] - v1[0] * v2[2],
        v1[0] * v2[1] - v1[1] * v2[0]
    ];
}

const vector3GetNormal = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
    return vector3CrossProduct(
        vectorNNormalize([x1, y1, z1]) as Vector3,
        vectorNNormalize([x2, y2, z2]) as Vector3
    );
}

const vectorNDotProduct = <T extends readonly number[]>(v1: T, v2: T): number => {
    return v1.reduce<number>((r, v, i) => r + v * v2[i], 0);
    //return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

const vectorNLength = <T extends readonly number[]>(v: T): number => {
    return Math.pow(vectorNDotProduct(v, v), .5);
}

const vectorNMix = <T extends number[]>(v1: T, v2: T, amt: number): T => {
    return v1.map((v, i) => v * amt + v2[i] * (1 - amt)) as T;
}

const vectorNNormalize = <T extends readonly number[]>(v: T): T => {
    return vectorNDivide(v, vectorNLength(v)) as any;
}

const vectorNSubtract = <T extends readonly number[]>(v1: T, v2: readonly number[]): T => {
    //return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
    return v1.map((v, i) => v - v2[i]) as any;
}

const vectorNAdd = <T extends readonly number[]>(v1: T, v2: readonly number[]): T => {
  return v1.map((v, i) => v + v2[i]) as any;
};

const vectorNScale = <T extends readonly number[]>(v: T, s: number): T => {
  return v.map(v => v*s) as any;
};

const vectorNDivide = <T extends readonly number[]>(v: T, d: number): T => {
    return v.map(v => v/d) as any;
}

const vector2PolyContains = (
  poly: readonly (ReadonlyVector3 | ReadonlyVector2)[],
  x: number,
  y: number,
  // Closure compiler should strip out Z param, which we accept
  // so we can spread a vec3 into this function
  ignoredZ?: number,
): boolean => {
    // from https://stackoverflow.com/questions/22521982/check-if-point-inside-a-polygon

    let inside: boolean;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        let xi = poly[i][0], yi = poly[i][1];
        let xj = poly[j][0], yj = poly[j][1];

        let intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
            inside = !inside;
        }
    }

    return inside;
}

const vector2PolyEdgeOverlapsCircle = (poly: Vector2[], c: Vector2, r: number): Vector2 | undefined => {
  // from https://bl.ocks.org/mbostock/4218871
  const [cx, cy] = c;
  let v: Vector2 = poly[poly.length - 1];
  let minPoint: Vector2 | undefined;
  let minDistanceSquared = r * r;

  for( let i=0; i<poly.length; i++ ) {
      const w = poly[i];
      // is it on the side
      const d = vector2SquaredDistance(v, w);
      const t = ((cx - v[0]) * (w[0] - v[0]) + (cy - v[1]) * (w[1] - v[1])) / d;
      const p: Vector2 = t < 0
        ? v
        : t > 1
          ? w
          : [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])];

      const pointLineDistanceSquared = vector2SquaredDistance(c, p);

      v = w;
      if( pointLineDistanceSquared < minDistanceSquared ) {
          minPoint = p;          
          minDistanceSquared = pointLineDistanceSquared;
      }
  }
  return minPoint;
}


const vector2SquaredDistance = (v: Vector2, w: Vector2) => {
    const dx = v[0] - w[0], dy = v[1] - w[1];
    return dx * dx + dy * dy;
}

const vectorNEquals = <T extends number[]>(v1: T, v2: T) => {
  return !v1.some((v, i) => v != v2[i]);
}

const vectorNToPrecision = <T extends number[]>(v: T): T => {
  return v.map(v => Math.round(v / EPSILON) * EPSILON) as T;
}

const rect3Intersection = (pos1: Vector3, dim1: Vector3, pos2: Vector3, dim2: Vector3) => {
  return pos1.map((v1a, i) => {
    const d1 = dim1[i];
    const v1b = v1a + d1;
    const v2a = pos2[i];
    const d2 = dim2[i];
    const v2b = v2a + d2;
    //return v1b > v2a && v2b > v1a;
    return Math.min(v1b, v2b) - Math.max(v1a, v2a);
  });
}

