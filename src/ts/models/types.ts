const MODEL_ID_SKY_CYLINDER = 0;
const MODEL_ID_CUBE = 1;
const MODEL_ID_SPHERE = 2;
const MODEL_ID_BILLBOARD = 3;
const MODEL_ID_DRAGON_BODY = 4;
const MODEL_ID_DRAGON_NECK = 5;
const MODEL_ID_DRAGON_HEAD = 6;
const MODEL_ID_DRAGON_TAIL = 7;
const MODEL_ID_DRAGON_QUAD_RIGHT = 8;
const MODEL_ID_DRAGON_QUAD_LEFT = 9;
const MODEL_ID_DRAGON_SHIN_RIGHT = 10;
const MODEL_ID_DRAGON_SHIN_LEFT = 11;
const MODEL_ID_DRAGON_WING_1_RIGHT = 12;
const MODEL_ID_DRAGON_WING_1_LEFT = 13;
const MODEL_ID_DRAGON_WING_2_RIGHT = 14;
const MODEL_ID_DRAGON_WING_2_LEFT = 15;
const MODEL_ID_DRAGON_WING_3_RIGHT = 16;
const MODEL_ID_DRAGON_WING_3_LEFT = 17;

type ModelId = 
  | typeof MODEL_ID_SKY_CYLINDER
  | typeof MODEL_ID_CUBE
  | typeof MODEL_ID_BILLBOARD
  | typeof MODEL_ID_DRAGON_BODY
  | typeof MODEL_ID_DRAGON_NECK
  | typeof MODEL_ID_DRAGON_HEAD
  | typeof MODEL_ID_DRAGON_TAIL
  | typeof MODEL_ID_DRAGON_QUAD_RIGHT
  | typeof MODEL_ID_DRAGON_QUAD_LEFT
  | typeof MODEL_ID_DRAGON_SHIN_RIGHT
  | typeof MODEL_ID_DRAGON_SHIN_LEFT
  | typeof MODEL_ID_DRAGON_WING_1_RIGHT
  | typeof MODEL_ID_DRAGON_WING_1_LEFT
  | typeof MODEL_ID_DRAGON_WING_2_RIGHT
  | typeof MODEL_ID_DRAGON_WING_2_LEFT
  | typeof MODEL_ID_DRAGON_WING_3_RIGHT
  | typeof MODEL_ID_DRAGON_WING_3_LEFT
  | number
  ;

type Model = {
  readonly faces: readonly Face<PlaneMetadata>[],
  readonly bounds: ReadonlyRect3,
  // should be used for dynamic entities
  readonly maximalInternalRadius: number,
  // should be used for static entities
  readonly maximalExternalRadius: number,
  readonly center: ReadonlyVector3,
  readonly groupPointsToFaces: Map<ReadonlyVector3, Set<Face<PlaneMetadata>>>,
  //groupPointCache: ReadonlyVector3[],
  readonly indexCount: number,
  readonly vao: WebGLVertexArrayObject,
};