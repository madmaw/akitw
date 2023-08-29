type Model = {
  readonly faces: readonly Face<PlaneMetadata>[],
  readonly bounds: ReadonlyRect3,
  // should be used for dynamic entities
  readonly minimalInternalRadius: number,
  // should be used for static entities
  readonly maximalExternalRadius: number,
  readonly center: ReadonlyVector3,
  readonly groupPointsToFaces: Map<ReadonlyVector3, Set<Face<PlaneMetadata>>>,
  //groupPointCache: ReadonlyVector3[],
  readonly indexCount: number,
  readonly vao: WebGLVertexArrayObject,
};