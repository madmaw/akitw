/// <reference path="./models.ts"/>

const MODEL_CUBE_BODY = 0;

type CubePartId = 
  | typeof MODEL_CUBE_BODY
  ;

const cubeShapes: ConvexShape<PlaneMetadata> = [
  toPlane(0, 0, 1, .2, defaultPlaneMetadata),
  toPlane(0, 0, -1, .2, defaultPlaneMetadata),
  toPlane(1, 0, 0, .2, defaultPlaneMetadata),
  toPlane(-1, 0, 0, .2, defaultPlaneMetadata),
  toPlane(0, 1, 0, .2, defaultPlaneMetadata),
  toPlane(0, -1, 0, .2, defaultPlaneMetadata),
];

const cubeFaces = decompose([[cubeShapes, []]]);
