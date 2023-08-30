const defaultPlaneMetadata: PlaneMetadata = {};

const MODEL_ID_SKY_CYLINDER = 0;
const MODEL_ID_CUBE = 1;
const MODEL_ID_BILLBOARD = 2;
const MODEL_ID_DRAGON_BODY = 3;
const MODEL_ID_DRAGON_NECK = 4;
const MODEL_ID_DRAGON_HEAD = 5;
const MODEL_ID_DRAGON_TAIL = 6;
const MODEL_ID_DRAGON_QUAD_RIGHT = 7;
const MODEL_ID_DRAGON_QUAD_LEFT = 8;
const MODEL_ID_DRAGON_CALF_RIGHT = 8;
const MODEL_ID_DRAGON_CALF_LEFT = 10;

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
  | typeof MODEL_ID_DRAGON_CALF_RIGHT
  | typeof MODEL_ID_DRAGON_CALF_LEFT
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