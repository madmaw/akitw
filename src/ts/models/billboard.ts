/// <reference path="./types.ts"/>
/// <reference path="../util/pi.ts"/>

const BILLBOARD_PART_ID_BODY = 0;

type BillboardPartIds = 
  | typeof BILLBOARD_PART_ID_BODY
  ;

const BILLBOARD_ROTATE_TO_MODEL_COORDINATES = matrix4RotateZXY(0, PI_05_1DP, 0);
const BILLBOARD_FACE: Face<PlaneMetadata> = {
  rotateToModelCoordinates: BILLBOARD_ROTATE_TO_MODEL_COORDINATES,
  toModelCoordinates: BILLBOARD_ROTATE_TO_MODEL_COORDINATES,
  polygons: [
    [
      [.5, -.5, 0],
      [.5, .5, 0],
      [-.5, .5, 0],
      [-.5, -.5, 0],
    ],
  ],
  t: {
    // unrotate from model coordinates, then position facing up
    textureCoordinateTransform: matrix4Multiply(
      // map -.5, -.5 to 0, 0
      matrix4Translate(.5, -.5, 0),
      // rotate so y, x -> x, y
      // flip so z -> x (invert our model transformation)
      matrix4RotateZXY(0, -PI_05_1DP, PI_05_1DP),
    ),
  }
};
const BILLBOARD_FACE_FLIPPED = flipFace(BILLBOARD_FACE, [-1, 1, 1]);

const BILLBOARD_FACES: Face<PlaneMetadata>[] = [BILLBOARD_FACE];
const BILLBOARD_FLIPPED_FACES: Face<PlaneMetadata>[] = [BILLBOARD_FACE_FLIPPED];
const BILLBOARD_TWO_SIDED_FACES: Face<PlaneMetadata>[] = [BILLBOARD_FACE, BILLBOARD_FACE_FLIPPED];

const BILLBOARD_PART: BodyPart<BillboardPartIds> = {
  modelId: MODEL_ID_BILLBOARD,
  id: BILLBOARD_PART_ID_BODY,
};