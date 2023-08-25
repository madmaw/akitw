function createCylinder(
  radius: number,
  halfDepth: number,
  segments: number,
  textureCoordinateTransform?: ReadonlyMatrix4,
): ConvexShape<PlaneMetadata> {
  return new Array(segments).fill(0).map((_, i) => {
    const a = Math.PI * 2 * i / segments;
    const sin = Math.sin(a);
    const cos = Math.cos(a);
    const unrotate = matrix4Multiply(
      textureCoordinateTransform,
      matrix4Rotate(-Math.PI/2, 1, 0, 0),
      matrix4Scale(.5/radius),
      matrix4Rotate(-a, 0, 0, 1),
    );
    return toPlane<PlaneMetadata>(cos, sin, 0, radius, {
      textureCoordinateTransform: unrotate,
    });
  }).concat([
    // TODO top and bottom transforms are not right
    toPlane<PlaneMetadata>(0, 0, 1, halfDepth, {
      textureCoordinateTransform: textureCoordinateTransform,
    }),
    toPlane<PlaneMetadata>(0, 0, -1, halfDepth, {
      textureCoordinateTransform: textureCoordinateTransform,
    }),
  ])
}