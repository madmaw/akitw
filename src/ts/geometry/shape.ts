type ConvexShape<T> = readonly Plane<T>[];

type Shape<T> = readonly [
  // body
  ConvexShape<T>,
  // subtractions
  readonly ConvexShape<T>[],
];

function convexShapeContainPoint<T>(
  shape: ConvexShape<T>,
  point: ReadonlyVector3,
  threshold = -EPSILON
): boolean {
  return !shape.some(plane => {
    const transforms = planeToTransforms(plane);
    const transform = matrix4Multiply(...transforms);
    const inverse = matrix4Invert(transform);
    const p = vector3TransformMatrix4(inverse, ...point);
    return p[2] > threshold;
  });
}

function convexShapeExpand<T>(shape: ConvexShape<T>, amount: number): ConvexShape<T> {
  return shape.map(([normal, position, t]) => {
    return [
      normal,
      vectorNScaleThenAdd(
        position,
        normal,
        amount
      ),
      t,
    ];
  });
}

