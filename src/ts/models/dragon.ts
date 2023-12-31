/// <reference path="./types.ts"/>
/// <reference path="../world/types.ts"/>
/// <reference path="../world/body_part.ts"/>
/// <reference path="../util/unpack.ts"/>

const DRAGON_PART_ID_BODY = 0;
const DRAGON_PART_ID_NECK= 1;
const DRAGON_PART_ID_HEAD = 2;
const DRAGON_PART_ID_TAIL = 3;
const DRAGON_PART_ID_QUAD_RIGHT = 4;
const DRAGON_PART_ID_QUAD_LEFT = -4;
const DRAGON_PART_ID_SHIN_RIGHT = 5;
const DRAGON_PART_ID_SHIN_LEFT = -5;
const DRAGON_PART_ID_WING_1_RIGHT = 6;
const DRAGON_PART_ID_WING_2_RIGHT = 7;
const DRAGON_PART_ID_WING_3_RIGHT = 8;
const DRAGON_PART_ID_CLAW_RIGHT = 9;


type DragonPartIds = 
  | typeof DRAGON_PART_ID_BODY
  | typeof DRAGON_PART_ID_NECK
  | typeof DRAGON_PART_ID_HEAD
  | typeof DRAGON_PART_ID_TAIL
  | typeof DRAGON_PART_ID_QUAD_RIGHT
  | typeof DRAGON_PART_ID_QUAD_LEFT
  | typeof DRAGON_PART_ID_SHIN_RIGHT
  | typeof DRAGON_PART_ID_SHIN_LEFT
  | typeof DRAGON_PART_ID_WING_1_RIGHT
  | typeof DRAGON_PART_ID_WING_2_RIGHT
  | typeof DRAGON_PART_ID_WING_3_RIGHT
  | typeof DRAGON_PART_ID_CLAW_RIGHT
  ;

const DRAGON_BODY_SMOOTH_METADATA: PlaneMetadata = {
  smoothingFlags: 1,
}

const DRAGON_SHAPES_BODY: ConvexShape<PlaneMetadata> = [
  // upper back
  toPlane(0, -.2, 1, .3, DRAGON_BODY_SMOOTH_METADATA),
  // side back right
  toPlane(1, -.2, 1, .25, DRAGON_BODY_SMOOTH_METADATA),
  // side back left
  toPlane(-1, -.2, 1, .25, DRAGON_BODY_SMOOTH_METADATA),
  // undercarridge
  toPlane(-1, -.3, -1, 0, DRAGON_BODY_SMOOTH_METADATA),
  toPlane(1, -.3, -1, 0, DRAGON_BODY_SMOOTH_METADATA),
  // chest (below)
  toPlane(0, -1, -1, 0, DRAGON_BODY_SMOOTH_METADATA),
  toPlane(0, 0, -1, 0, DRAGON_BODY_SMOOTH_METADATA),
  // chect (forward)
  toPlane(0, 1, -1, .1, DRAGON_BODY_SMOOTH_METADATA),
  // right side
  toPlane(1, -.1, -.1, .1, DRAGON_BODY_SMOOTH_METADATA),
  // left side
  toPlane(-1, -.1, -.1, .1, DRAGON_BODY_SMOOTH_METADATA),
  // front (left)
  toPlane(-1, 1, 1, .3, DRAGON_BODY_SMOOTH_METADATA),
  toPlane(-1, 1, -1, .1, DRAGON_BODY_SMOOTH_METADATA),
  // front (right)
  toPlane(1, 1, 1, .3, DRAGON_BODY_SMOOTH_METADATA),
  toPlane(1, 1, -1, .1, DRAGON_BODY_SMOOTH_METADATA),
  // front
  toPlane(0, 1, 0, .25, DRAGON_BODY_SMOOTH_METADATA),
  // rear
  toPlane(0, -1, -.1, .2, DRAGON_BODY_SMOOTH_METADATA),    
];

const DRAGON_SHAPES_NECK_TRANSFORM = matrix4Multiply(
  matrix4Translate(0, .1, 0),
  matrix4Rotate(PI_01666_1DP, 1, 0, 0),
);
const DRAGON_SHAPES_NECK: ConvexShape<PlaneMetadata> = transformConvexShape([
  // rear
  toPlane(0, -1, 0, .15, {
    ...DRAGON_BODY_SMOOTH_METADATA,
    smoothingFlags: 0,
  }),  
  // top
  toPlane(0, .2, 1, .07, DRAGON_BODY_SMOOTH_METADATA),
  // top left
  toPlane(-1, .3, 1, .07, DRAGON_BODY_SMOOTH_METADATA),
  // top right
  toPlane(1, .3, 1, .07, DRAGON_BODY_SMOOTH_METADATA),
  // bottom
  toPlane(0, .2, -1, .07, DRAGON_BODY_SMOOTH_METADATA),
  // bottom left
  toPlane(-1, .3, -1, .07, DRAGON_BODY_SMOOTH_METADATA),
  // bottom right
  toPlane(1, .3, -1, .07, DRAGON_BODY_SMOOTH_METADATA),      
  // right
  toPlane(1, .2, 0, .07, DRAGON_BODY_SMOOTH_METADATA),
  // left
  toPlane(-1, .2, 0, .07, DRAGON_BODY_SMOOTH_METADATA),
  // front
  toPlane(0, 1, 1, .1, DRAGON_BODY_SMOOTH_METADATA),
  toPlane(0, 1, -1, .1, DRAGON_BODY_SMOOTH_METADATA),
], DRAGON_SHAPES_NECK_TRANSFORM);

const DRAGON_SHAPES_HEAD_TRANSFORM = matrix4Multiply(
  DRAGON_SHAPES_NECK_TRANSFORM,
  matrix4Translate(0, .1, -.1),
  matrix4Rotate(-PI_025_1DP, 1, 0, 0),
);
const DRAGON_SHAPES_HEAD: ConvexShape<PlaneMetadata> = transformConvexShape([
  // top
  toPlane(0, .3, 1, .05, DRAGON_BODY_SMOOTH_METADATA),
  // bottom
  toPlane(0, .2, -1, 0, DRAGON_BODY_SMOOTH_METADATA),
  // jaw
  toPlane(.2, 0, -1, .02, DRAGON_BODY_SMOOTH_METADATA),
  toPlane(-.2, 0, -1, .02, DRAGON_BODY_SMOOTH_METADATA),

  // right
  toPlane(1, .3, .3, .04, DRAGON_BODY_SMOOTH_METADATA),
  // left
  toPlane(-1, .3, .3, .04, DRAGON_BODY_SMOOTH_METADATA),
  // rear top
  toPlane(0, -.6, 1, .15, DRAGON_BODY_SMOOTH_METADATA),
  // rear back
  toPlane(0, -1, 0, .25, DRAGON_BODY_SMOOTH_METADATA),
  // rear right
  toPlane(1, -.5, .2, .15, DRAGON_BODY_SMOOTH_METADATA),
  // read left
  toPlane(-1, -.5, .2, .15, DRAGON_BODY_SMOOTH_METADATA),
], DRAGON_SHAPES_HEAD_TRANSFORM);

const DRAGON_SHAPES_TAIL: ConvexShape<PlaneMetadata> = [
  // front
  toPlane(0, 1, 0, 0, {
    ...DRAGON_BODY_SMOOTH_METADATA,
    smoothingFlags: 0,
  }),    
  // top
  toPlane(0, 0, 1, .05, DRAGON_BODY_SMOOTH_METADATA),
  // top right
  toPlane(-1, 0, 1, .055, DRAGON_BODY_SMOOTH_METADATA),
  // top left
  toPlane(1, 0, 1, .055, DRAGON_BODY_SMOOTH_METADATA),
  // bottom
  toPlane(0, -.2, -1, .05, DRAGON_BODY_SMOOTH_METADATA),
  // right
  toPlane(1, -.1, 0, .05, DRAGON_BODY_SMOOTH_METADATA),
  // left
  toPlane(-1, -.1, 0, .05, DRAGON_BODY_SMOOTH_METADATA),
];

// , matrix4Multiply(
//   matrix4Translate(0, -.15, 0),
// ))

const DRAGON_SHAPES_QUAD_RIGHT: ConvexShape<PlaneMetadata> = [
  // right
  toPlane(1, 0, 0, .03, DRAGON_BODY_SMOOTH_METADATA),
  // left
  toPlane(-1, 0, 0, .03, DRAGON_BODY_SMOOTH_METADATA),
  // front
  toPlane(0, 1, 0, .1, DRAGON_BODY_SMOOTH_METADATA),
  // front/top smoothing
  toPlane(0, 1, 1, .1, DRAGON_BODY_SMOOTH_METADATA),
  // front/bottom smoothing
  toPlane(0, 1, -1, .1, DRAGON_BODY_SMOOTH_METADATA),
  // rear
  toPlane(0, -1, 0, .1, DRAGON_BODY_SMOOTH_METADATA),
  // rear/top smoothing
  toPlane(0, -1, 1, .1, DRAGON_BODY_SMOOTH_METADATA),
  // top
  toPlane(0, 0, 1, .1, DRAGON_BODY_SMOOTH_METADATA),
  // bottom
  toPlane(0, 0, -1, .15, DRAGON_BODY_SMOOTH_METADATA),
  // knee smoothing
  toPlane(0, -1, -1, .15, DRAGON_BODY_SMOOTH_METADATA),
  // outer knee smoothing
  toPlane(3, 0, -1, .05, DRAGON_BODY_SMOOTH_METADATA),
];

const DRAGON_SHAPES_SHIN_RIGHT: ConvexShape<PlaneMetadata> = [
  // right
  toPlane(1, 0, 0, 0, DRAGON_BODY_SMOOTH_METADATA),
  // left
  toPlane(-1, 0, 0, .03, DRAGON_BODY_SMOOTH_METADATA),
  // front
  toPlane(0, 1, 0, .03, DRAGON_BODY_SMOOTH_METADATA),
  // rear
  toPlane(0, -1, -.2, .04, DRAGON_BODY_SMOOTH_METADATA),
  // knee
  toPlane(0, 0, 1, 0, DRAGON_BODY_SMOOTH_METADATA),
  // foot
  toPlane(0, -1, -1, .15, DRAGON_BODY_SMOOTH_METADATA),
];

// const DRAGON_SHAPES_QUAD_LEFT = transformConvexShape(DRAGON_SHAPES_QUAD_RIGHT, matrix4Scale(-1, 1));
// const DRAGON_SHAPES_SHIN_LEFT = transformConvexShape(DRAGON_SHAPES_SHIN_RIGHT, matrix4Scale(-1, 1));

const DRAGON_FACES_BODY = safeUnpackFaces(
  [...'AKQ]HS^EQ]E9YK9YN:VQQX?QXB:V@QMEQHHHHB?QKQHPQMN?QFQHJQHFXOJXOQUS?USHXYBXSNXS8)-()*+,),,-.(),*/0+),1234),3567)-0437-)-28953),98:;)-76<.-)-/=140).)>?=/*).?:821=).(.<@>)).659;@<)-@;:?>),+0-,'],
  FLAG_UNPACK_USE_ORIGINALS && decompose([[DRAGON_SHAPES_BODY, []]]),
);
const DRAGON_FACES_NECK = safeUnpackFaces(
  [...':EDLBDIBFCEF@KF@NFCNDIKDLISLGSLEVKKVKGUFIUFEVHKVHKWJEWJ3)0()*+,-./),/01(),(12)),.30/),+45,),*64+),,57-)--783.)-)296*).389210).698754('],
  FLAG_UNPACK_USE_ORIGINALS && decompose([[DRAGON_SHAPES_NECK, []]]),
);
const DRAGON_FACES_HEAD = safeUnpackFaces(
  [...'7H\\@DRMLRMLSDHPFDSDNNIKHKHHKEHKBNIMPMCPMEJMKJM2)+()*),(+,-)-./0,+)-,012-)-*3.+()-(-24)).)4563*)-10/65),6/.3),2154'],
  FLAG_UNPACK_USE_ORIGINALS && decompose([[DRAGON_SHAPES_HEAD, []]]),
);
const DRAGON_FACES_TAIL = safeUnpackFaces(
  [...'1JHKKHJKHEEHEEHJFHKF:KH(KJ:K/).()*+,-)--./0()+,.-)+(0))+*/+),)0/*),+/.,('],
  FLAG_UNPACK_USE_ORIGINALS && decompose([[DRAGON_SHAPES_TAIL, []]]),
);
const DRAGON_FACES_QUAD_RIGHT = safeUnpackFaces(
  [...':JNKJKNJENJBKJBDJMDJNEFNEFG>FD>FBAFBKFENFKNFNKHG>IBAHD>3)/()*+,-.)0/0123456),./6(),(65))--70/.)-+328,),*43+),)54*),1079),2198)-,897-'],
  FLAG_UNPACK_USE_ORIGINALS && decompose([[DRAGON_SHAPES_QUAD_RIGHT, []]])
);
const DRAGON_FACES_SHIN_RIGHT = safeUnpackFaces(
  [...'0HJHHEHHH:HJ9FJ9FH:FEHFJH.),()*+),,-./),+,/(),).-*),(/.)),*-,+'],
  FLAG_UNPACK_USE_ORIGINALS && decompose([[DRAGON_SHAPES_SHIN_RIGHT, []]]),
);

const [
  DRAGON_FACES_QUAD_LEFT,
  DRAGON_FACES_SHIN_LEFT,
] = [
  DRAGON_FACES_QUAD_RIGHT,
  DRAGON_FACES_SHIN_RIGHT,
].map(faces => {
  return faces.map(face => flipFace(face, [-1, 1, 1]));
});

// don't want to rotate as it will make the wing flap calculations difficult
const DRAGON_FACE_WING_1_RIGHT: Face<PlaneMetadata> = {
  rotateToModelCoordinates: MATRIX4_IDENTITY,
  toModelCoordinates: MATRIX4_IDENTITY,
  polygons: [
    [
      [0, -.1, 0], 
      [.2, -.2, 0], // B1
      [.1, 0, 0], // A1
      [0, 0, 0], 
    ],
  ],
  t: {}
};
// const DRAGON_FACES_WING_1_RIGHT: Face<PlaneMetadata>[] = [
//   DRAGON_FACE_WING_1_RIGHT,
//   flipFace(DRAGON_FACE_WING_1_RIGHT, [1, 1, -1]),
// ];

// intentionally swapping x, y as we want to rotate back to y axis, which we bend on 
// from wing 1
const DRAGON_FACES_WING_2_ROTATE_TO_MODEL_COORDINATES_VECTOR: ReadonlyVector3 = [
  0,
  0,
  -.46
  // Math.atan2(
  //   // (A1 - B1).x
  //   -.1,
  //   // (A1 - B1).y
  //   .2
  // ),
];
const DRAGON_FACES_WING_2_ROTATE_TO_MODEL_COORDINATES = matrix4RotateZXY(...DRAGON_FACES_WING_2_ROTATE_TO_MODEL_COORDINATES_VECTOR);

const DRAGON_FACE_WING_2_RIGHT: Face<PlaneMetadata> = {
  rotateToModelCoordinates: DRAGON_FACES_WING_2_ROTATE_TO_MODEL_COORDINATES,
  toModelCoordinates: DRAGON_FACES_WING_2_ROTATE_TO_MODEL_COORDINATES,
  polygons: [
    [
      // provided the first point is the only inset, the
      // model generator will support non-convex shapes
      [.1, 0, 0], 
      [0, 0, 0], // sticks to A1
      [.1, -.2, 0], // sticks to B1
      [.2, -.3, 0], // B2
      [.35, .1, 0], // A2
    ],
  ],
  t: {}
};
// const DRAGON_FACES_WING_2_RIGHT: Face<PlaneMetadata>[] = [
//   DRAGON_FACE_WING_2_RIGHT,
//   flipFace(DRAGON_FACE_WING_2_RIGHT, [1, 1, -1]),
// ];
const DRAGON_FACES_WING_3_ROTATE_TO_MODEL_COORDINATES_VECTOR: ReadonlyVector3 = [
  0,
  0,
  .36
  // Math.atan2(
  //   // (A2 - B2).x
  //   .15,
  //   // (A2 - B2).y
  //   .4
  // ),
];
const DRAGON_FACES_WING_3_ROTATE_TO_MODEL_COORDINATES = matrix4RotateZXY(...DRAGON_FACES_WING_3_ROTATE_TO_MODEL_COORDINATES_VECTOR);
const DRAGON_FACE_WING_3_RIGHT: Face<PlaneMetadata> = {
  rotateToModelCoordinates: DRAGON_FACES_WING_3_ROTATE_TO_MODEL_COORDINATES,
  toModelCoordinates: DRAGON_FACES_WING_3_ROTATE_TO_MODEL_COORDINATES,
  polygons: [
    [
      [.15, -.05, 0], // inset
      [.4, -.2, 0],
      [.3, .2, 0],
      [.15, .4, 0], // sticks to B2
      [0, 0, 0], // sticks to A2
    ],
  ],
  t: {}
}
// const DRAGON_FACES_WING_3_RIGHT: Face<PlaneMetadata>[] = [DRAGON_FACE_WING_3_RIGHT, flipFace(DRAGON_FACE_WING_3_RIGHT, []);
// console.log(DRAGON_FACES_WING_3_RIGHT[0].polygons[0].map(
//   p => vector3TransformMatrix4(DRAGON_FACES_WING_3_ROTATE_TO_MODEL_COORDINATES, ...p)
// ));

const [
  [DRAGON_FACES_WING_1_RIGHT, DRAGON_FACES_WING_1_LEFT],
  [DRAGON_FACES_WING_2_RIGHT, DRAGON_FACES_WING_2_LEFT],
  [DRAGON_FACES_WING_3_RIGHT, DRAGON_FACES_WING_3_LEFT],
] = [
  DRAGON_FACE_WING_1_RIGHT,
  DRAGON_FACE_WING_2_RIGHT,
  DRAGON_FACE_WING_3_RIGHT,
].map<[Face<PlaneMetadata>[], Face<PlaneMetadata>[]]>(
  face => {
    const rightFlippedY = flipFace(face, [1, 1, -1]);
    const right = [face, rightFlippedY];
    const left = right.map(face => flipFace(face, [-1, 1, 1]));
    return [right, left];
  },
);


const DRAGON_WING_RIGHT: BodyPart<DragonPartIds> = {
  id: DRAGON_PART_ID_WING_1_RIGHT,
  modelId: MODEL_ID_DRAGON_WING_1_RIGHT,
  preRotationOffset: [.05, .15, .31],
  //preRotationOffset: [.3, .11, .28],
  preRotation: [PI_01_1DP, 0, 0],
  //preRotationTransform: MATRIX4_IDENTITY,
  childParts: [{
    id: DRAGON_PART_ID_WING_2_RIGHT,
    modelId: MODEL_ID_DRAGON_WING_2_RIGHT,
    //postRotationTransform: matrix4Rotate(Math.atan2(.3, -.3), 0, 0, 1),
    postRotation: vectorNScale(DRAGON_FACES_WING_2_ROTATE_TO_MODEL_COORDINATES_VECTOR, -1),
    preRotationOffset: [.1, 0, 0],
    childParts: [{
      id: DRAGON_PART_ID_WING_3_RIGHT,
      modelId: MODEL_ID_DRAGON_WING_3_RIGHT,  
      preRotationOffset: vector3TransformMatrix4(
        DRAGON_FACES_WING_2_ROTATE_TO_MODEL_COORDINATES,
        .2, // B2.x
        -.3, // B2.y
        0
      ),
      postRotation: vectorNScaleThenAdd(
        DRAGON_FACES_WING_2_ROTATE_TO_MODEL_COORDINATES_VECTOR,
        DRAGON_FACES_WING_3_ROTATE_TO_MODEL_COORDINATES_VECTOR,
        -1,
      ),
      //postRotationTransform: DRAGON_FACES_WING_2_ROTATE_TO_MODEL_COORDINATES,
    }]
  }]
};
const DRAGON_WING_LEFT = synthesizeOppositeBodyPart(DRAGON_WING_RIGHT);

const DRAGON_LEG_RIGHT: BodyPart<DragonPartIds> = {
  id: DRAGON_PART_ID_QUAD_RIGHT,
  modelId: MODEL_ID_DRAGON_QUAD_RIGHT,
  preRotationOffset: [.11, 0, .1],
  preRotation: [-PI_01666_1DP, 0, 0],
  childParts: [{
    id: DRAGON_PART_ID_SHIN_RIGHT,
    modelId: MODEL_ID_DRAGON_SHIN_RIGHT,
    preRotationOffset: [.01, -.05, -.11],
    preRotation: [PI_0333_0DP, 0, 0],
    childParts: [{
      id: DRAGON_PART_ID_CLAW_RIGHT,
      preRotationOffset: [-.1, 0, -.22],
      postRotation: [0, -PI_025_1DP, -PI_05_1DP],
    }]
  }],
};
const DRAGON_LEG_LEFT = synthesizeOppositeBodyPart(DRAGON_LEG_RIGHT);

const DRAGON_PART: BodyPart<DragonPartIds> = {
  id: DRAGON_PART_ID_BODY,
  modelId: MODEL_ID_DRAGON_BODY,
  preRotationOffset: [0, 0, -.17],
  childParts: [
    {
      id: DRAGON_PART_ID_NECK,
      modelId: MODEL_ID_DRAGON_NECK,
      preRotationOffset: [0, .19, .26],
      childParts: [{
        id: DRAGON_PART_ID_HEAD,
        modelId: MODEL_ID_DRAGON_HEAD,
        preRotationOffset: [0, .15, .01],
      }],
    },
    {
      id: DRAGON_PART_ID_TAIL,
      modelId: MODEL_ID_DRAGON_TAIL,
      preRotationOffset: [0, -.19, .22],
    },
    DRAGON_LEG_RIGHT,
    DRAGON_LEG_LEFT,
    DRAGON_WING_RIGHT,
    DRAGON_WING_LEFT,
  ],
};

const DRAGON_ANIMATION_GLIDE_FRAME_DURATION = 400;
const DRAGON_ANIMATION_GLIDE_SEQUENCES: JointAnimationSequences<DragonPartIds> = [
  [
    DRAGON_PART_ID_BODY,
    DRAGON_ANIMATION_GLIDE_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, 0, 0],
  ],
  [
    DRAGON_PART_ID_TAIL,
    DRAGON_ANIMATION_GLIDE_FRAME_DURATION * 2,
    EASING_QUAD_IN_OUT,
    [PI_01_1DP, 0, 0],
  ],
  [
    DRAGON_PART_ID_QUAD_RIGHT,
    DRAGON_ANIMATION_GLIDE_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, 0, 0],
  ],
  [
    DRAGON_PART_ID_SHIN_RIGHT,
    DRAGON_ANIMATION_GLIDE_FRAME_DURATION,
    EASING_QUAD_IN,
    [-PI_02_1DP, 0, 0],
  ],
  [
    DRAGON_PART_ID_WING_1_RIGHT,
    DRAGON_ANIMATION_GLIDE_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, 0, 0],
    [0, -PI_002_2DP, 0],
  ],
  [
    DRAGON_PART_ID_WING_2_RIGHT,
    DRAGON_ANIMATION_GLIDE_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, PI_01_1DP, 0],
  ],
  [
    DRAGON_PART_ID_WING_3_RIGHT,
    DRAGON_ANIMATION_GLIDE_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, 0, 0],
  ],
];
const DRAGON_ANIMATION_GLIDE: ActionJointAnimationSequences<DragonPartIds> = [
  ACTION_ID_GLIDE,
  ...synthesizeFromOppositeJointAnimationSequences(
    DRAGON_PART,
    FLAG_UNPACK_ANIMATIONS
      ? safeUnpackJointAnimationSequences(
        ['(5,)HHH+C,)KHH,5,)HHH-5*)BHH.5,*HHHHGH/5,)HKH05,)HHH'],
        FLAG_UNPACK_USE_ORIGINALS && DRAGON_ANIMATION_GLIDE_SEQUENCES,
      ) as JointAnimationSequences<DragonPartIds>
      : DRAGON_ANIMATION_GLIDE_SEQUENCES,
  ),
];

const DRAGON_ANIMATION_FLAP_FRAME_DURATION = 400;
const DRAGON_ANIMATION_FLAP_SEQUENCES: JointAnimationSequences<DragonPartIds> = [
  [
    DRAGON_PART_ID_BODY,
    DRAGON_ANIMATION_FLAP_FRAME_DURATION,
    EASING_QUAD_IN,
    [0, 0, 0],
    [-PI_01_1DP, 0, 0],
  ],
  [
    DRAGON_PART_ID_QUAD_RIGHT,
    DRAGON_ANIMATION_FLAP_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, 0, 0],
    [PI_02_1DP, 0, 0],
  ],
  [
    DRAGON_PART_ID_SHIN_RIGHT,
    DRAGON_ANIMATION_FLAP_FRAME_DURATION*2,
    EASING_QUAD_IN,
    [-PI_02_1DP, 0, 0],
  ],
  [
    DRAGON_PART_ID_TAIL,
    DRAGON_ANIMATION_FLAP_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, 0, 0],
    [PI_02_1DP, 0, 0],
  ],
  [
    DRAGON_PART_ID_WING_1_RIGHT,
    DRAGON_ANIMATION_FLAP_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [-PI_01_1DP, -PI_04_1DP, 0],
    [-PI_02_1DP, PI_04_1DP, 0],
  ],
  [
    DRAGON_PART_ID_WING_2_RIGHT,
    DRAGON_ANIMATION_FLAP_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, -PI_02_1DP, 0],
    [0, PI_01_1DP, 0],
  ],
  [
    DRAGON_PART_ID_WING_3_RIGHT,
    DRAGON_ANIMATION_FLAP_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, PI_03_1DP, 0],
    [0, -PI_01_1DP, 0],
  ],
];
const DRAGON_ANIMATION_FLAP: ActionJointAnimationSequences<DragonPartIds> = [
  ACTION_ID_FLAP,
  ...synthesizeFromOppositeJointAnimationSequences(
    DRAGON_PART,
    FLAG_UNPACK_ANIMATIONS
      ? safeUnpackJointAnimationSequences(
        ['(5**HHHEHH,5,*HHHNHH-C*)BHH+5,*HHHNHH.5,*E;HBUH/5,*HBHHKH05,*HRHHEH'],
        FLAG_UNPACK_USE_ORIGINALS && DRAGON_ANIMATION_FLAP_SEQUENCES,
      ) as JointAnimationSequences<DragonPartIds>
      : DRAGON_ANIMATION_FLAP_SEQUENCES,
  ),
];

  
const DRAGON_ANIMATION_RUN_FRAME_DURATION = 200;
const DRAGON_ANIMATION_RUN_SEQUENCE: JointAnimationSequences<DragonPartIds> = [
  [
    DRAGON_PART_ID_QUAD_RIGHT,
    DRAGON_ANIMATION_RUN_FRAME_DURATION * 2,
    EASING_QUAD_IN_OUT,
    [PI_05_1DP, 0, 0],
    [-PI_03_1DP, 0, 0],
  ],
  [
    DRAGON_PART_ID_SHIN_RIGHT,
    DRAGON_ANIMATION_RUN_FRAME_DURATION,
    EASING_QUAD_IN,
    [-PI_03_1DP, 0, 0],
    [-PI_05_1DP, 0, 0],
    [PI_04_1DP, 0, 0],
    [-PI_05_1DP, 0, 0],
  ],
  [
    DRAGON_PART_ID_BODY,
    DRAGON_ANIMATION_RUN_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [-PI_005_2DP, PI_005_2DP, 0],
    [-PI_005_2DP, -PI_005_2DP, 0],
    [-PI_01_1DP, PI_005_2DP, 0],
    [-PI_01_1DP, -PI_005_2DP, 0],
  ],
  [
    DRAGON_PART_ID_TAIL,
    DRAGON_ANIMATION_RUN_FRAME_DURATION * .8,
    EASING_QUAD_IN_OUT,
    [0, 0, PI_005_2DP],
    [0, 0, -PI_005_2DP],
  ],
  [
    DRAGON_PART_ID_WING_1_RIGHT,
    DRAGON_ANIMATION_RUN_FRAME_DURATION * 2,
    EASING_QUAD_IN_OUT,
    [0, -PI_02_1DP, 0],
    [0, -PI_01_1DP, 0],
  ],
  [
    DRAGON_PART_ID_WING_2_RIGHT,
    DRAGON_ANIMATION_RUN_FRAME_DURATION * 2,
    EASING_QUAD_IN_OUT,
    [0, -PI_03_1DP, 0],
    [0, -PI_02_1DP, 0],
  ],
  [
    DRAGON_PART_ID_WING_3_RIGHT,
    DRAGON_ANIMATION_RUN_FRAME_DURATION * 2,
    EASING_QUAD_IN_OUT,
    [0, PI_03_1DP, 0],
    [0, PI_04_1DP, 0],
  ],
];
const DRAGON_ANIMATION_RUN: ActionJointAnimationSequences<DragonPartIds> = [
  ACTION_ID_RUN,
  ...synthesizeFromOppositeJointAnimationSequences(
    DRAGON_PART,
    FLAG_UNPACK_ANIMATIONS
      ? safeUnpackJointAnimationSequences(
        [',5,*XHH>HH-/*,>HH8HHUHH8HH(/,,FJHFFHEJHEFH+-,*HHJHHF.5,*HBHHEH/5,*H>HHBH05,*HRHHUH'],
        FLAG_UNPACK_USE_ORIGINALS && DRAGON_ANIMATION_RUN_SEQUENCE,
      ) as JointAnimationSequences<DragonPartIds>
      : DRAGON_ANIMATION_RUN_SEQUENCE,
    1,
  ),
];

const DRAGON_ANIMATION_WALK_FRAME_DURATION = 300;
const DRAGON_ANIMATION_WALK_SEQUENCE: JointAnimationSequences<DragonPartIds> = [
  [
    DRAGON_PART_ID_QUAD_RIGHT,
    DRAGON_ANIMATION_WALK_FRAME_DURATION * 2,
    EASING_QUAD_IN_OUT,
    [PI_03_1DP, 0, 0],
    [-PI_01_1DP, 0, 0],
  ],
  [
    DRAGON_PART_ID_SHIN_RIGHT,
    DRAGON_ANIMATION_WALK_FRAME_DURATION,
    EASING_QUAD_IN,
    [0, 0, 0],
    [-PI_02_1DP, 0, 0],
    [PI_01_1DP, 0, 0],
    [-PI_02_1DP, 0, 0],
  ],
  [
    DRAGON_PART_ID_BODY,
    DRAGON_ANIMATION_WALK_FRAME_DURATION * 2,
    EASING_QUAD_IN_OUT,
    [0, PI_005_2DP, 0],
    [0, -PI_005_2DP, 0],
  ],
  [
    DRAGON_PART_ID_TAIL,
    DRAGON_ANIMATION_WALK_FRAME_DURATION * 2,
    EASING_QUAD_IN_OUT,
    [0, 0, PI_005_2DP],
    [0, 0, -PI_005_2DP],
  ],
  [
    DRAGON_PART_ID_WING_1_RIGHT,
    DRAGON_ANIMATION_WALK_FRAME_DURATION * 2,
    EASING_QUAD_IN_OUT,
    [0, PI_02_1DP, 0],
    [0, PI_01_1DP, 0],
  ],
  [
    DRAGON_PART_ID_WING_2_RIGHT,
    DRAGON_ANIMATION_WALK_FRAME_DURATION * 2,
    EASING_QUAD_IN_OUT,
    [0, -PI_06_1DP, 0],
    [0, -PI_04_1DP, 0],
  ],
  [
    DRAGON_PART_ID_WING_3_RIGHT,
    DRAGON_ANIMATION_WALK_FRAME_DURATION * 2,
    EASING_QUAD_IN_OUT,
    [0, PI_04_1DP, 0],
    [0, PI_06_1DP, 0],
  ],
];
const DRAGON_ANIMATION_WALK: ActionJointAnimationSequences<DragonPartIds> = [
  ACTION_ID_WALK,
  ...synthesizeFromOppositeJointAnimationSequences(
    DRAGON_PART,
    FLAG_UNPACK_ANIMATIONS
      ? safeUnpackJointAnimationSequences(
        [',<,*RHHEHH-2*,HHHBHHKHHBHH(<,*HJHHFH+<,*HHJHHF.<,*HNHHKH/<,*H5HH;H0<,*HUHH[H'],
        FLAG_UNPACK_USE_ORIGINALS && DRAGON_ANIMATION_WALK_SEQUENCE,
      ) as JointAnimationSequences<DragonPartIds>
      : DRAGON_ANIMATION_WALK_SEQUENCE,
    1,
  ),
];

const DRAGON_ANIMATION_WALK_BACKWARD_SEQUENCE: JointAnimationSequences<DragonPartIds> = [
  [
    DRAGON_PART_ID_QUAD_RIGHT,
    300,
    EASING_QUAD_IN,
    [-PI_025_1DP, 0, 0],
    [PI_05_1DP, 0, 0],
  ],
  [
    DRAGON_PART_ID_SHIN_RIGHT,
    300,
    EASING_QUAD_IN_OUT,
    [-PI_0333_0DP, 0, 0],
    [PI_025_1DP, 0, 0],
  ],    
];
const DRAGON_ANIMATION_WALK_BACKWARD: ActionJointAnimationSequences<DragonPartIds> = [
  ACTION_ID_WALK_BACKWARD,
  ...synthesizeFromOppositeJointAnimationSequences(
    DRAGON_PART,
    FLAG_UNPACK_ANIMATIONS
      ? safeUnpackJointAnimationSequences(
        [',2**@HHXHH-2,*=HHPHH'],
        FLAG_UNPACK_USE_ORIGINALS && DRAGON_ANIMATION_WALK_BACKWARD_SEQUENCE,
      ) as JointAnimationSequences<DragonPartIds>
      : DRAGON_ANIMATION_WALK_BACKWARD_SEQUENCE,
    1,
  ),
];

const DRAGON_ANIMATION_IDLE_FRAME_DURATION = 999;
const DRAGON_ANIMATION_IDLE_SEQUENCE: JointAnimationSequences<DragonPartIds> = [
  [
    DRAGON_PART_ID_QUAD_RIGHT,
    DRAGON_ANIMATION_IDLE_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, 0, 0],
    [PI_001_2DP, 0, 0],
  ],
  [
    DRAGON_PART_ID_SHIN_RIGHT,
    DRAGON_ANIMATION_IDLE_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, 0, 0],
  ],
  [
    DRAGON_PART_ID_BODY,
    DRAGON_ANIMATION_IDLE_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, 0, 0],
    [-PI_001_2DP, 0, 0],
  ],
  [
    DRAGON_PART_ID_TAIL,
    DRAGON_ANIMATION_IDLE_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, 0, 0],
  ],
  [
    DRAGON_PART_ID_WING_1_RIGHT,
    DRAGON_ANIMATION_IDLE_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [-PI_001_2DP, PI_03_1DP, 0],
    [0, PI_031_2DP, 0],
  ],
  [
    DRAGON_PART_ID_WING_2_RIGHT,
    DRAGON_ANIMATION_IDLE_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, -PI_08_1DP, 0],
    //[0, 0, 0],
  ],
  [
    DRAGON_PART_ID_WING_3_RIGHT,
    DRAGON_ANIMATION_IDLE_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, PI_08_1DP, 0],
    //[0, 0, 0],
  ],
];
const DRAGON_ANIMATION_IDLE: ActionJointAnimationSequences<DragonPartIds> = [
  ACTION_ID_IDLE,
  ...synthesizeFromOppositeJointAnimationSequences(
    DRAGON_PART,
    FLAG_UNPACK_ANIMATIONS
      ? safeUnpackJointAnimationSequences(
        [',I,*HHHHHH-I,)HHH(I,*HHHHHH+I,)HHH.I,*HRHHQH/I,)H.H0I,)HbH'],
        FLAG_UNPACK_USE_ORIGINALS && DRAGON_ANIMATION_IDLE_SEQUENCE,
      ) as JointAnimationSequences<DragonPartIds>
      : DRAGON_ANIMATION_IDLE_SEQUENCE,
  )
];
  
const DRAGON_ANIMATION_FALL_FRAME_DURATION = 999;
const DRAGON_ANIMATION_FALL_SEQUENCE: JointAnimationSequences<DragonPartIds> = [
  [
    DRAGON_PART_ID_BODY,
    DRAGON_ANIMATION_FALL_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, 0, 0],
  ],
  [
    DRAGON_PART_ID_TAIL,
    DRAGON_ANIMATION_FALL_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [-PI_03_1DP, 0, 0],
  ],
  [
    DRAGON_PART_ID_WING_1_RIGHT,
    DRAGON_ANIMATION_FALL_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, -PI_03_1DP, 0],
  ],
  [
    DRAGON_PART_ID_WING_2_RIGHT,
    DRAGON_ANIMATION_FALL_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, -PI_03_1DP, 0],
  ],
  [
    DRAGON_PART_ID_WING_3_RIGHT,
    DRAGON_ANIMATION_FALL_FRAME_DURATION,
    EASING_QUAD_IN_OUT,
    [0, -PI_01_1DP, 0],
  ],
];
const DRAGON_ANIMATION_FALL: ActionJointAnimationSequences<DragonPartIds> = [
  ACTION_ID_IDLE,
  ...synthesizeFromOppositeJointAnimationSequences(
    DRAGON_PART,
    FLAG_UNPACK_ANIMATIONS
      ? safeUnpackJointAnimationSequences(
        ['(I,)HHH+I,)>HH.I,)H>H/I,)HEH0I,)HEH'],
        FLAG_UNPACK_USE_ORIGINALS && DRAGON_ANIMATION_FALL_SEQUENCE,
      ) as JointAnimationSequences<DragonPartIds>
      : DRAGON_ANIMATION_FALL_SEQUENCE,    
  ),
];

const DRAGON_ANIMATION_SHOOT_FRAME_DURATION = 200;
const DRAGON_ANIMATION_SHOOT_SEQUENCE: JointAnimationSequences<DragonPartIds> = [
  [
    DRAGON_PART_ID_BODY,
    DRAGON_ANIMATION_SHOOT_FRAME_DURATION,
    EASING_QUAD_IN,
    [-PI_01_1DP, 0, 0],
  ],
  [
    DRAGON_PART_ID_TAIL,
    DRAGON_ANIMATION_SHOOT_FRAME_DURATION,
    EASING_QUAD_IN,
    [-PI_01_1DP, 0, 0],
  ],
];
// NOTE no need to symthesize as the parts aren't symmetrical
const DRAGON_ANIMATION_SHOOT: ActionJointAnimationSequences<DragonPartIds> = [
  ACTION_ID_SHOOT,
  ...(
    FLAG_UNPACK_ANIMATIONS
      ? safeUnpackJointAnimationSequences(
        ['(/*)EHH+/*)EHH'],
        FLAG_UNPACK_USE_ORIGINALS && DRAGON_ANIMATION_SHOOT_SEQUENCE,
      ) as JointAnimationSequences<DragonPartIds>
      : DRAGON_ANIMATION_SHOOT_SEQUENCE
  ),
];
