type Model = {
  readonly faces: readonly Face<PlaneMetadata>[],
  readonly bounds: ReadonlyRect3,
  readonly minimalInternalRadius: number,
  readonly center: ReadonlyVector3,
  readonly groupPointsToFaces: Map<ReadonlyVector3, Set<Face<PlaneMetadata>>>,
  //groupPointCache: ReadonlyVector3[],
  readonly indexCount: number,
  readonly vao: WebGLVertexArrayObject,
  billboard?: Booleanish,
};