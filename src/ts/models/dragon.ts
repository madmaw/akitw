/// <reference path="./types.ts"/>

const DRAGON_PART_ID_BODY = 0;
const DRAGON_PART_ID_NECK= 1;
const DRAGON_PART_ID_HEAD = 2;
const DRAGON_PART_ID_TAIL = 3;
const DRAGON_PART_ID_QUAD_RIGHT = 4;
const DRAGON_PART_ID_QUAD_LEFT = 5;
const DRAGON_PART_ID_SHIN_RIGHT = 6;
const DRAGON_PART_ID_SHIN_LEFT = 7;


type DragonPartIds = 
  | typeof DRAGON_PART_ID_BODY
  | typeof DRAGON_PART_ID_NECK
  | typeof DRAGON_PART_ID_HEAD
  | typeof DRAGON_PART_ID_TAIL
  | typeof DRAGON_PART_ID_QUAD_RIGHT
  | typeof DRAGON_PART_ID_QUAD_LEFT
  | typeof DRAGON_PART_ID_SHIN_RIGHT
  | typeof DRAGON_PART_ID_SHIN_LEFT
  ;

  
const DRAGON_SHAPES_BODY: ConvexShape<PlaneMetadata> = [
  // upper back
  toPlane(0, -.2, 1, .3, defaultPlaneMetadata),
  // side back right
  toPlane(1, -.2, 1, .25, defaultPlaneMetadata),
  // side back left
  toPlane(-1, -.2, 1, .25, defaultPlaneMetadata),
  // undercarridge
  toPlane(-1, -.3, -1, 0, defaultPlaneMetadata),
  toPlane(1, -.3, -1, 0, defaultPlaneMetadata),
  // chest (below)
  toPlane(0, -1, -1, 0, defaultPlaneMetadata),
  toPlane(0, 0, -1, 0, defaultPlaneMetadata),
  // chect (forward)
  toPlane(0, 1, -1, .1, defaultPlaneMetadata),
  // right side
  toPlane(1, -.1, -.1, .1, defaultPlaneMetadata),
  // left side
  toPlane(-1, -.1, -.1, .1, defaultPlaneMetadata),
  // front (left)
  toPlane(-1, 1, 1, .3, defaultPlaneMetadata),
  toPlane(-1, 1, -1, .1, defaultPlaneMetadata),
  // front (right)
  toPlane(1, 1, 1, .3, defaultPlaneMetadata),
  toPlane(1, 1, -1, .1, defaultPlaneMetadata),
  // front
  toPlane(0, 1, 0, .25, defaultPlaneMetadata),
  // rear
  toPlane(0, -1, -.1, .2, defaultPlaneMetadata),    
];

const DRAGON_SHAPES_NECK_TRANSFORM = matrix4Multiply(
  matrix4Translate(0, .1, 0),
  matrix4Rotate(Math.PI/6, 1, 0, 0),
);
const DRAGON_SHAPES_NECK: ConvexShape<PlaneMetadata> = transformConvexShape([
  // top
  toPlane(0, .2, 1, .07, defaultPlaneMetadata),
  // top left
  toPlane(-1, .3, 1, .07, defaultPlaneMetadata),
  // top right
  toPlane(1, .3, 1, .07, defaultPlaneMetadata),
  // bottom
  toPlane(0, .2, -1, .07, defaultPlaneMetadata),
  // bottom left
  toPlane(-1, .3, -1, .07, defaultPlaneMetadata),
  // bottom right
  toPlane(1, .3, -1, .07, defaultPlaneMetadata),      
  // right
  toPlane(1, .2, 0, .07, defaultPlaneMetadata),
  // left
  toPlane(-1, .2, 0, .07, defaultPlaneMetadata),
  // front
  toPlane(0, 1, 1, .1, defaultPlaneMetadata),
  toPlane(0, 1, -1, .1, defaultPlaneMetadata),
  // rear
  toPlane(0, -1, 0, .15, defaultPlaneMetadata),
], DRAGON_SHAPES_NECK_TRANSFORM);

const DRAGON_SHAPES_HEAD_TRANSFORM = matrix4Multiply(
  DRAGON_SHAPES_NECK_TRANSFORM,
  matrix4Translate(0, .1, -.1),
  matrix4Rotate(-Math.PI/4, 1, 0, 0),
);
const DRAGON_SHAPES_HEAD: ConvexShape<PlaneMetadata> = transformConvexShape([
  // top
  toPlane(0, .3, 1, .05, defaultPlaneMetadata),
  // bottom
  toPlane(0, .2, -1, 0, defaultPlaneMetadata),
  // jaw
  toPlane(.2, 0, -1, .02, defaultPlaneMetadata),
  toPlane(-.2, 0, -1, .02, defaultPlaneMetadata),

  // right
  toPlane(1, .3, .3, .04, defaultPlaneMetadata),
  // left
  toPlane(-1, .3, .3, .04, defaultPlaneMetadata),
  // rear top
  toPlane(0, -.6, 1, .15, defaultPlaneMetadata),
  // rear back
  toPlane(0, -1, 0, .25, defaultPlaneMetadata),
  // rear right
  toPlane(1, -.5, .2, .15, defaultPlaneMetadata),
  // read left
  toPlane(-1, -.5, .2, .15, defaultPlaneMetadata),
], DRAGON_SHAPES_HEAD_TRANSFORM);

const DRAGON_SHAPES_TAIL: ConvexShape<PlaneMetadata> = [
  // top
  toPlane(0, 0, 1, .05, defaultPlaneMetadata),
  // top right
  toPlane(-1, 0, 1, .055, defaultPlaneMetadata),
  // top left
  toPlane(1, 0, 1, .055, defaultPlaneMetadata),
  // bottom
  toPlane(0, -.2, -1, .05, defaultPlaneMetadata),
  // right
  toPlane(1, -.1, 0, .05, defaultPlaneMetadata),
  // left
  toPlane(-1, -.1, 0, .05, defaultPlaneMetadata),
  // front
  toPlane(0, 1, 0, .2, defaultPlaneMetadata),  
];

const DRAGON_SHAPES_QUAD_RIGHT: ConvexShape<PlaneMetadata> = [
  // right
  toPlane(1, 0, 0, .03, defaultPlaneMetadata),
  // left
  toPlane(-1, 0, 0, .03, defaultPlaneMetadata),
  // front
  toPlane(0, 1, 0, .1, defaultPlaneMetadata),
  // front/top smoothing
  toPlane(0, 1, 1, .1, defaultPlaneMetadata),
  // front/bottom smoothing
  toPlane(0, 1, -1, .1, defaultPlaneMetadata),
  // rear
  toPlane(0, -1, 0, .1, defaultPlaneMetadata),
  // rear/top smoothing
  toPlane(0, -1, 1, .1, defaultPlaneMetadata),
  // top
  toPlane(0, 0, 1, .1, defaultPlaneMetadata),
  // bottom
  toPlane(0, 0, -1, .15, defaultPlaneMetadata),
  // knee smoothing
  toPlane(0, -1, -1, .15, defaultPlaneMetadata),
  // outer knee smoothing
  toPlane(3, 0, -1, .05, defaultPlaneMetadata),
];

const DRAGON_SHAPES_SHIN_RIGHT: ConvexShape<PlaneMetadata> = [
  // right
  toPlane(1, 0, 0, 0, defaultPlaneMetadata),
  // left
  toPlane(-1, 0, 0, .03, defaultPlaneMetadata),
  // front
  toPlane(0, 1, 0, .03, defaultPlaneMetadata),
  // rear
  toPlane(0, -1, -.2, .04, defaultPlaneMetadata),
  // knee
  toPlane(0, 0, 1, 0, defaultPlaneMetadata),
  // foot
  toPlane(0, -1, -1, .15, defaultPlaneMetadata),
];

const DRAGON_SHAPES_QUAD_LEFT = transformConvexShape(DRAGON_SHAPES_QUAD_RIGHT, matrix4Scale(-1, 1));
const DRAGON_SHAPES_SHIN_LEFT = transformConvexShape(DRAGON_SHAPES_SHIN_RIGHT, matrix4Scale(-1, 1));

const DRAGON_FACES_BODY = decompose([[DRAGON_SHAPES_BODY, []]]);
const DRAGON_FACES_NECK = decompose([[DRAGON_SHAPES_NECK, []]]);
const DRAGON_FACES_HEAD = decompose([[DRAGON_SHAPES_HEAD, []]]);
const DRAGON_FACES_TAIL = decompose([[DRAGON_SHAPES_TAIL, []]]);
const DRAGON_FACES_QUAD_RIGHT = decompose([[DRAGON_SHAPES_QUAD_RIGHT, []]]);
const DRAGON_FACES_QUAD_LEFT = decompose([[DRAGON_SHAPES_QUAD_LEFT, []]]);
const DRAGON_FACES_SHIN_RIGHT = decompose([[DRAGON_SHAPES_SHIN_RIGHT, []]]);
const DRAGON_FACES_SHIN_LEFT = decompose([[DRAGON_SHAPES_SHIN_LEFT, []]]);

const DRAGON_PART: BodyPart<DragonPartIds> = {
  id: DRAGON_PART_ID_BODY,
  modelId: MODEL_ID_DRAGON_BODY,
  preRotationOffset: [0, 0, -.15],
  children: [{
    id: DRAGON_PART_ID_NECK,
    modelId: MODEL_ID_DRAGON_NECK,
    preRotationOffset: [0, .19, .29],
    children: [{
      id: DRAGON_PART_ID_HEAD,
      modelId: MODEL_ID_DRAGON_HEAD,
      preRotationOffset: [0, .15, .05],
    }],
  }, {
    id: DRAGON_PART_ID_TAIL,
    modelId: MODEL_ID_DRAGON_TAIL,
    preRotationOffset: [0, -.3, .23],
  }, {
    id: DRAGON_PART_ID_QUAD_RIGHT,
    modelId: MODEL_ID_DRAGON_QUAD_RIGHT,
    preRotationOffset: [.11, 0, .1],
    preRotationTransform: matrix4Rotate(-Math.PI/6, 1, 0, 0),
    children: [{
      id: DRAGON_PART_ID_SHIN_RIGHT,
      modelId: MODEL_ID_DRAGON_SHIN_RIGHT,
      preRotationOffset: [0, -.05, -.11],
      preRotationTransform: matrix4Rotate(Math.PI/3, 1, 0, 0),
    }],
  }, {
    id: DRAGON_PART_ID_QUAD_LEFT,
    modelId: MODEL_ID_DRAGON_QUAD_LEFT,
    preRotationOffset: [-.11, 0, .1],
    preRotationTransform: matrix4Rotate(-Math.PI/6, 1, 0, 0),
    children: [{
      id: DRAGON_PART_ID_SHIN_LEFT,
      modelId: MODEL_ID_DRAGON_SHIN_LEFT,
      preRotationOffset: [0, -.05, -.11],
      preRotationTransform: matrix4Rotate(Math.PI/3, 1, 0, 0),
    }]
  }],
};