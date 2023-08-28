function createCylinder(
  radius: number,
  halfDepth: number,
  segments: number,
  textureCoordinateTransform?: ReadonlyMatrix4,
): ConvexShape<PlaneMetadata> {
  const halfAngle = Math.PI / segments;
  return new Array(segments).fill(0).map((_, i) => {
    const a = Math.PI * 2 * i / segments;
    const sin = Math.sin(a);
    const cos = Math.cos(a);
    const unrotate = matrix4Multiply(
      textureCoordinateTransform,
      matrix4Translate(-i / segments, 0, 0),
      matrix4Rotate(Math.PI/2, 1, 0, 0),
      matrix4Rotate(halfAngle - a + Math.PI/2, 0, 0, 1),
      matrix4Scale(1/(2 * Math.PI * radius)),
    );
    return toPlane<PlaneMetadata>(cos, sin, 0, radius, {
      textureCoordinateTransform: unrotate,
    });
  }).concat([
    // TODO top and bottom transforms are not right
    toPlane<PlaneMetadata>(0, 0, 1, halfDepth, {
      textureCoordinateTransform: matrix4Multiply(
        textureCoordinateTransform,
        matrix4Translate(0, .5, 0),
        matrix4Scale(.5/(radius * MATERIAL_TERRAIN_TEXTURE_DIMENSION)),
      ),
    }),
    toPlane<PlaneMetadata>(0, 0, -1, halfDepth, {}),
  ])
}