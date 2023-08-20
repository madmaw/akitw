type Face = {
  readonly toModelCoordinates: ReadonlyMatrix4,
  readonly rotateToModelCoordinates: ReadonlyMatrix4,
  readonly polygons: readonly ConvexPolygon[],
};

// the expectation is that z is always 0
type ConvexPolygon = readonly ReadonlyVector3[];

function convexPolygonContainsPoint(
  polygon: ConvexPolygon,
  [x, y]: ReadonlyVector3,
): number {
  const line1: Line = [[0, 1], [x, y]];
  const count = polygon.reduce((count, p1, i) => {
    const p2 = polygon[(i + 1)%polygon.length];
    if (lineIntersectsPoints(p1, p2, line1)) {
      count++;
    }
    return count;
  }, 0);
  return count % 2;
}

function dedupePolygon(polygon: ConvexPolygon) {
  return polygon.filter((p1, i) => {
    const p2 = polygon[(i + 1)%polygon.length];
    const length = vectorNLength(vectorNScaleThenAdd(p1, p2, -1));
    return length > EPSILON;
  });
}

function toFace(
  p1: ReadonlyVector3,
  p2: ReadonlyVector3,
  p3: ReadonlyVector3,
): Face {
  const d2 = vectorNNormalize(vectorNScaleThenAdd(p2, p1, -1));
  const d3 = vectorNNormalize(vectorNScaleThenAdd(p3, p1, -1));
  const normal = vectorNNormalize(vector3CrossProduct(d2, d3));
  const [translateToModelCoordinates, rotateToModelCoordinates] = planeToTransforms([
    normal, p1
  ]);

  const toModelCoordinates = matrix4Multiply(
    rotateToModelCoordinates,
    translateToModelCoordinates,
  );

  const toPlaneCoordinates = matrix4Invert(toModelCoordinates);
  const polygon = [p1, p2, p3].map(p => vector3TransformMatrix4(toPlaneCoordinates, ...p));
  // const center = polygon.reduce((total, p) => vectorNScaleThenAdd(total, p, 1/3));
  // const expandedPolygon = polygon.map(p => {
  //   const d = vectorNScaleThenAdd(p, center, -1);
  //   return vectorNScaleThenAdd(center, d, 1);
  // });


  return {
    polygons: [polygon],
    //polygons: [expandedPolygon],
    toModelCoordinates,
    rotateToModelCoordinates,
  }
}

function measureFace({
  polygons,
  toModelCoordinates,
}: Face): [Rect3, Vector3, number] {
  const allPoints = polygons.map(polygon => polygon.map(point => {
    return vector3TransformMatrix4(toModelCoordinates, ...point);
  })).flat(1);
  const bounds = allPoints.reduce<[Vector3, Vector3]>(([min, max], point) => {
    return [
      point.map((v, i) => Math.min(v, min[i])) as Vector3,
      point.map((v, i) => Math.max(v, max[i])) as Vector3,
    ];
  }, [allPoints[0], allPoints[0]]);
  const [min, max] = bounds;
  const center = min.map((v, i) => (v + max[i])/2) as Vector3;
  const radius = bounds.reduce(
    (acc, point) => {
      return Math.max(
        acc,
        vectorNLength(vectorNScaleThenAdd(point, center, -1)),
      );
    },
    0,
  );
  return [
    bounds,
    center,
    radius,
  ];
}