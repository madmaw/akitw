/// <reference path="./types.ts"/>

// const skyCylinderBody = createCylinder(
//   skyCylinderRadius,
//   skyCylinderRadius,
//   12,
// );

// const SHAPES_SKY_CYLINDER: Shape<PlaneMetadata>[] = [
//   [skyCylinderBody, []],
// ];

const SKY_CYLINDER_SEGMENTS = 8;
const SKY_CYLINDER_HALF_ANGLE = PI_1_2DP / SKY_CYLINDER_SEGMENTS;

const SKY_CYLINDER_SHAPE: ConvexShape<PlaneMetadata> = FLAG_UNPACK_USE_ORIGINALS
  ? new Array(SKY_CYLINDER_SEGMENTS).fill(0).map((_, i) => {
    const a = Math.PI * 2 * i / SKY_CYLINDER_SEGMENTS;
    const sin = Math.sin(a);
    const cos = Math.cos(a);
    // don't smooth as this is always rendered at maximum lighting anyway
    return toPlane<PlaneMetadata>(cos, sin, 0, .5, {});
  }).concat([
    toPlane<PlaneMetadata>(0, 0, 1, .5, {}),
    toPlane<PlaneMetadata>(0, 0, -1, .5, {}),
  ])
  : [];

const SKY_CYLINDER_DIAMETER = HORIZON * 1.2;
const SKY_CYLINDER_SCALE = matrix4Scale(SKY_CYLINDER_DIAMETER);

const SKY_CYLINDER_FACES_UNTEXTURED = safeUnpackFaces(
  [...'8hUhh;hh;(hU(Uh(Uhh;h(;hh(U((Uh(;((;h;((;(hU((U(h2),()*+),+,-(),./-,),01/.),2310),3245),5467),)76*)0(-/1357))0*6420.,+'],
  FLAG_UNPACK_USE_ORIGINALS && decompose([[SKY_CYLINDER_SHAPE, []]])
);

// add the textures after decomposition so we can pack/unpack without losing data
const SKY_CYLINDER_FACES: Face<PlaneMetadata>[] = SKY_CYLINDER_FACES_UNTEXTURED.map((face, i) => {
  let textureCoordinateTransform: ReadonlyMatrix4 | undefined;
  if (i < SKY_CYLINDER_SEGMENTS) {
    const a = PI_2_2DP * i / SKY_CYLINDER_SEGMENTS;
    textureCoordinateTransform = matrix4Multiply(
      matrix4Translate(-i / SKY_CYLINDER_SEGMENTS, 0, 0),
      matrix4Rotate(PI_05_2DP, 1, 0, 0),
      matrix4Rotate(SKY_CYLINDER_HALF_ANGLE - a + PI_05_2DP, 0, 0, 1),
      matrix4Scale(1/(PI_05_2DP)),
    );
  } else if ( i == SKY_CYLINDER_SEGMENTS) {
    textureCoordinateTransform = matrix4Multiply(
      matrix4Translate(0, .5, 0),
      matrix4Scale(.5/(.5 * MATERIAL_TERRAIN_TEXTURE_DIMENSION)),
    );
  }

  return {
    ...face,
    t: {
      textureCoordinateTransform,
    },
  };
});
