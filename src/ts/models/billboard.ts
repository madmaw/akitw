const MODEL_BILLBOARD_BODY = 0;

type BillboardPartIds = 
  | typeof MODEL_BILLBOARD_BODY
  ;

const rotateToModelCoordinates = matrix4Rotate(-Math.PI/2, 0, 1, 0);
const billboardFaces: Face<PlaneMetadata>[] = [{
  rotateToModelCoordinates,
  toModelCoordinates: matrix4Rotate(-Math.PI/2, 0, 1, 0),
  polygons: [
    [
      [-.5, -.5, 0],
      [-.5, .5, 0],
      [.5, .5, 0],
      [.5, -.5, 0],
    ],
  ],
  t: {
    // unrotate from model coordinates, then position facing up
    textureCoordinateTransform: matrix4Multiply(
      // map -.5, -.5 to 0, 0
      matrix4Translate(.5, -.5, 0),
      // rotate so y, x -> x, y
      matrix4Rotate(-Math.PI/2, 0, 0, 1),
      // flip so z -> x (invert our model transformation)
      matrix4Rotate(Math.PI/2, 0, 1, 0),
    ),
  }
}];
