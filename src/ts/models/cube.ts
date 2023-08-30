/// <reference path="./types.ts"/>

const CUBE_PART_ID_BODY = 0;

type CubePartId = 
  | typeof CUBE_PART_ID_BODY
  ;

const CUBE_SHAPES_BODY: ConvexShape<PlaneMetadata> = [
  toPlane(0, 0, 1, .2, defaultPlaneMetadata),
  toPlane(0, 0, -1, .2, defaultPlaneMetadata),
  toPlane(1, 0, 0, .2, defaultPlaneMetadata),
  toPlane(-1, 0, 0, .2, defaultPlaneMetadata),
  toPlane(0, 1, 0, .2, defaultPlaneMetadata),
  toPlane(0, -1, 0, .2, defaultPlaneMetadata),
];

const CUBE_FACES_BODY = decompose([[CUBE_SHAPES_BODY, []]]);

const CUBE_PART: BodyPart<CubePartId> = {
  modelId: MODEL_ID_CUBE,
};
