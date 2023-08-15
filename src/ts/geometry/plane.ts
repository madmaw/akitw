// normal, point
type Plane = readonly [ReadonlyVector3, ReadonlyVector3];

function toPlane(nx: number, ny: number, nz: number, d: number): Plane {
  const normal = vectorNNormalize<ReadonlyVector3>([nx, ny, nz]);
  const position = vectorNScale<ReadonlyVector3>(normal, d);
  return [
    normal,
    position,
  ];
}

function flipPlane([normal, offset]: Plane): Plane {
  return [vectorNScale(normal, -1), offset]
}

/**
 * returns translation and rotation matrices in that order, these matrices convert 
 * plane coordinates to world coordinates
 */
function planeToTransforms([normal, offset]: Plane): [ReadonlyMatrix4, ReadonlyMatrix4] {
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
