// normal, point
type Plane<T> = readonly [ReadonlyVector3, ReadonlyVector3, T];

function toPlane<T>(nx: number, ny: number, nz: number, d: number, t: T): Plane<T> {
  const normal = vectorNNormalize<ReadonlyVector3>([nx, ny, nz]);
  const position = vectorNScale<ReadonlyVector3>(normal, d);
  return [
    normal,
    position,
    t,
  ];
}

function flipPlane<T>([normal, offset, t]: Plane<T>): Plane<T> {
  return [vectorNScale(normal, -1), offset, t]
}

/**
 * returns translation and rotation matrices in that order, these matrices convert 
 * plane coordinates to world coordinates
 */
function planeToTransforms(
  [normal, offset]: [ReadonlyVector3, ReadonlyVector3] | Plane<any>,
): [ReadonlyMatrix4, ReadonlyMatrix4] {
  const cosRadians = vectorNDotProduct(NORMAL_Z, normal);
  const axis = Math.abs(cosRadians) < 1 - EPSILON 
      ? vectorNNormalize(
        vector3CrossProduct(NORMAL_Z, normal),
      ) 
      : NORMAL_X;
  const rotate = matrix4Rotate(
    Math.acos(cosRadians),
    ...axis,
  );
  const translate = matrix4Translate(
    ...offset,
  );
  return [translate, rotate];
}

function transformPlane<T>(
  [normal, offset, t]: Plane<T>,
  transform: ReadonlyMatrix4,
): Plane<T> {
  const origin = vector3TransformMatrix4(transform, 0, 0, 0);
  const transformedNormal = vector3TransformMatrix4(transform, ...normal);
  const transformedOffest = vector3TransformMatrix4(transform, ...offset);
  return [
    vectorNNormalize(vectorNScaleThenAdd(transformedNormal, origin, -1)),
    transformedOffest,
    t,
  ];
}
