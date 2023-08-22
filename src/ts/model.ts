type Model = {
  faces: readonly Face<PlaneMetadata>[],
  bounds: ReadonlyRect3,
  radius: number,
  center: ReadonlyVector3,
  groupPointsToFaces: Map<ReadonlyVector3, Set<Face<PlaneMetadata>>>,
  //groupPointCache: ReadonlyVector3[],
  indexCount: number,
  vao: WebGLVertexArrayObject,
};