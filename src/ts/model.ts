type Model = {
  faces: readonly Face[],
  bounds: ReadonlyRect3,
  radius: number,
  center: ReadonlyVector3,
  groupPointsToFaces: Map<ReadonlyVector3, Set<Face>>,
  groupPointCache: ReadonlyVector3[],
  indexCount: number,
  vao: WebGLVertexArrayObject,
};