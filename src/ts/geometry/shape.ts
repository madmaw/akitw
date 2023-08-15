type ConvexShape = readonly Plane[];

type Shape = readonly [
  // body
  ConvexShape,
  // subtractions
  readonly ConvexShape[],
];

function convexShapeContainPoint(
  shape: ConvexShape,
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

function convexShapeExpand(shape: ConvexShape, amount: number): ConvexShape {
  return shape.map(([normal, position]) => {
    return [
      normal,
      vectorNAdd(
        position,
        vectorNScale(
          normal, 
          amount,
        ),
      ),
    ];
  });
}

