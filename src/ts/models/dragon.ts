/// <reference path="./models.ts"/>

const MODEL_DRAGON_BODY = 0;
const MODEL_DRAGON_NECK= 1;
const MODEL_DRAGON_HEAD = 2;
const MODEL_DRAGON_TAIL = 3;
const MODEL_DRAGON_QUAD_RIGHT = 4;
const MODEL_DRAGON_QUAD_LEFT = 5;
const MODEL_DRAGON_SHIN_RIGHT = 6;
const MODEL_DRAGON_SHIN_LEFT = 7;


type DragonPartIds = 
  | typeof MODEL_DRAGON_BODY
  | typeof MODEL_DRAGON_NECK
  | typeof MODEL_DRAGON_HEAD
  | typeof MODEL_DRAGON_TAIL
  | typeof MODEL_DRAGON_QUAD_RIGHT
  | typeof MODEL_DRAGON_QUAD_LEFT
  | typeof MODEL_DRAGON_SHIN_RIGHT
  | typeof MODEL_DRAGON_SHIN_LEFT
  ;

  
  const dragonBodyTransform = matrix4Translate(
    0, 0, -.35,
  );
  const dragonBodyShapes: ConvexShape<PlaneMetadata> = transformConvexShape(
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
    dragonBodyTransform,
  );

  const dragonNeckMatrix = matrix4Multiply(
    dragonBodyTransform,
    matrix4Translate(0, .3, .3),
    matrix4Rotate(Math.PI/6, 1, 0, 0),
  );
  const dragonNeckShapes: ConvexShape<PlaneMetadata> = transformConvexShape(
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
    dragonNeckMatrix,
  );

  const dragonHeadShapes: ConvexShape<PlaneMetadata> = transformConvexShape(
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
      dragonNeckMatrix,
      matrix4Translate(0, .25, -.15),
      matrix4Rotate(-Math.PI/4, 1, 0, 0),
    ),
  );

  const dragonTailShapes: ConvexShape<PlaneMetadata> = transformConvexShape(
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
      dragonBodyTransform,
      matrix4Translate(0, -.3, .23),
    )
  );

  const dragonQuadMatrix = matrix4Multiply(
    dragonBodyTransform,
    matrix4Translate(.11, 0, .1),
    matrix4Rotate(-Math.PI/6, 1, 0, 0),
  );
  const dragonQuadRightShapes: ConvexShape<PlaneMetadata> = transformConvexShape(
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
    dragonQuadMatrix,
  );

  const dragonShinRightShapes: ConvexShape<PlaneMetadata> = transformConvexShape(
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
      dragonQuadMatrix,
      matrix4Translate(0, -.05, -.11),
      matrix4Rotate(Math.PI/3, 1, 0, 0),
    )
  );

  const dragonQuadLeftShapes = transformConvexShape(dragonQuadRightShapes, matrix4Scale(-1, 1, 1));
  const dragonShinLeftShapes = transformConvexShape(dragonShinRightShapes, matrix4Scale(-1, 1, 1));

  const dragonFaces = decompose([
    [dragonBodyShapes, []],
    [dragonNeckShapes, []],
    [dragonHeadShapes, []],
    [dragonTailShapes, []],
    [dragonQuadRightShapes, []],
    [dragonQuadLeftShapes, []],
    [dragonShinRightShapes, []],
    [dragonShinLeftShapes, []],
  ]);