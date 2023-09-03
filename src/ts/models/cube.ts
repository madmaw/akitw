/// <reference path="./types.ts"/>
/// <reference path="../util/unpack.ts"/>

const CUBE_PART_ID_BODY = 0;

type CubePartId = 
  | typeof CUBE_PART_ID_BODY
  ;

const CUBE_SHAPES_BODY: ConvexShape<PlaneMetadata> = [
  toPlane(0, 0, 1, .5, {}),
  toPlane(0, 0, -1, .5, {}),
  toPlane(1, 0, 0,  .5, {}),
  toPlane(-1, 0, 0, .5, {}),
  toPlane(0, 1, 0, .5, {}),
  toPlane(0, -1, 0, .5, {}),
];

const CUBE_FACES_BODY = safeUnpackFaces(
  [...'0hhh(hh((hh(hh((((((h(hh(.),()*+),,-./),+,/(),).-*),(/.)),*-,+'],
  FLAG_UNPACK_USE_ORIGINALS && decompose([[CUBE_SHAPES_BODY, []]])
);

const CUBE_PART: BodyPart<CubePartId> = {
  modelId: MODEL_ID_CUBE,
};
