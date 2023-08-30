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

  
  const DRAGON_SHAPES_BODY_MATRIX = matrix4Translate(
    0, 0, -.35,
  );
  const DRAGON_SHAPES_BODY: ConvexShape<PlaneMetadata> = transformConvexShape(
    [
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
    ],
    DRAGON_SHAPES_BODY_MATRIX,
  );

  const DRAGON_SHAPES_NECK_MATRIX = matrix4Multiply(
    DRAGON_SHAPES_BODY_MATRIX,
    matrix4Translate(0, .3, .3),
    matrix4Rotate(Math.PI/6, 1, 0, 0),
  );
  const DRAGON_SHAPES_NECK: ConvexShape<PlaneMetadata> = transformConvexShape(
    [
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
    ],
    DRAGON_SHAPES_NECK_MATRIX,
  );

  const DRAGON_SHAPES_HEAD: ConvexShape<PlaneMetadata> = transformConvexShape(
    [
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
    ],
    matrix4Multiply(
      DRAGON_SHAPES_NECK_MATRIX,
      matrix4Translate(0, .25, -.15),
      matrix4Rotate(-Math.PI/4, 1, 0, 0),
    ),
  );

  const DRAGON_SHAPES_TAIL: ConvexShape<PlaneMetadata> = transformConvexShape(
    [
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
    ],
    matrix4Multiply(
      DRAGON_SHAPES_BODY_MATRIX,
      matrix4Translate(0, -.3, .23),
    )
  );

  const DRAGON_SHAPES_QUAD_RIGHT_MATRIX = matrix4Multiply(
    DRAGON_SHAPES_BODY_MATRIX,
    matrix4Translate(.11, 0, .1),
    matrix4Rotate(-Math.PI/6, 1, 0, 0),
  );
  const DRAGON_SHAPES_QUAD_RIGHT: ConvexShape<PlaneMetadata> = transformConvexShape(
    [
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
    ],
    DRAGON_SHAPES_QUAD_RIGHT_MATRIX,
  );

  const DRAGON_SHAPES_SHIN_RIGHT: ConvexShape<PlaneMetadata> = transformConvexShape(
    [
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
    ],
    matrix4Multiply(
      DRAGON_SHAPES_QUAD_RIGHT_MATRIX,
      matrix4Translate(0, -.05, -.11),
      matrix4Rotate(Math.PI/3, 1, 0, 0),
    )
  );

  const DRAGON_SHAPES_QUAD_LEFT = transformConvexShape(DRAGON_SHAPES_QUAD_RIGHT, matrix4Scale(-1, 1, 1));
  const DRAGON_SHAPES_SHIN_LEFT = transformConvexShape(DRAGON_SHAPES_SHIN_RIGHT, matrix4Scale(-1, 1, 1));

  const DRAGON_FACES = decompose([
    [DRAGON_SHAPES_BODY, []],
    [DRAGON_SHAPES_NECK, []],
    [DRAGON_SHAPES_HEAD, []],
    [DRAGON_SHAPES_TAIL, []],
    [DRAGON_SHAPES_QUAD_RIGHT, []],
    [DRAGON_SHAPES_QUAD_LEFT, []],
    [DRAGON_SHAPES_SHIN_RIGHT, []],
    [DRAGON_SHAPES_SHIN_LEFT, []],
  ]);

  const DRAGON_PART: BodyPart<DragonPartIds> = {
    id: DRAGON_PART_ID_BODY,
    modelId: MODEL_ID_DRAGON_BODY,
    children: [],
  };