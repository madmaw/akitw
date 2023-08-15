// normalized direction, point
type Line = readonly [ReadonlyVector2, ReadonlyVector2];

// p1, p2, p2 rotated -a around p1, a 
type FiniteLine = readonly [ReadonlyVector3, ReadonlyVector2, number];

function toLine([x1, y1]: ReadonlyVector3, [x2, y2]: ReadonlyVector3): Line {
  const delta = vectorNNormalize<Vector2>([x2 - x1, y2 - y1]);
  return [delta, [x1, y1]];
}

function toFiniteLine(p1: ReadonlyVector3, p2: ReadonlyVector3): FiniteLine {
  const [px1, py1] = p1;
  const [px2, py2] = p2;
  const dx = px2 - px1;
  const dy = py2 - py1;
  const a = Math.atan2(dy, dx);
  const r = vector2Rotate(
    -a,
    [dx, dy],
    p1,
  )
  return [
    p1,
    r,
    a,
  ];
}

function lineIntersectsPoints(p1: ReadonlyVector3, p2: ReadonlyVector3, line1: Line): number | false {
  const delta = vectorNScaleThenAdd(p2, p1, -1);
  const [dirx, diry] = vectorNNormalize(delta);
  // TODO might be able to just cast
  const [x1, y1] = p1;
  const line2: Line = [[dirx, diry], [x1, y1]];
  const intersection1 = lineIntersection(
    line1,
    line2,
  );
  const intersection2 = lineIntersection(
    line2,
    line1,
  );
  return intersection1 > 0
    && intersection2 > 0
    && intersection2 < vectorNLength(delta)
    && intersection1;
}

function lineDeltaAndLength(p1: ReadonlyVector3, p2: ReadonlyVector3, line: Line): [number | undefined, number, ReadonlyVector3] {
  const delta = vectorNScaleThenAdd(p2, p1, -1);
  const length = vectorNLength(delta);
  const direction = vectorNNormalize(delta);
  // TODO might be able to just cast
  const [dirx, diry] = direction;
  const [x1, y1] = p1;
  const edge: Line = [
    [dirx, diry],
    [x1, y1],
  ];
  const nextIntersectionD = lineIntersection(edge, line);
  return [nextIntersectionD, length, direction];
}

function  lineIntersection(
  [n1, [px1, py1]]: Line,
  [[nx2, ny2], [px2, py2]]: Line,
): number | undefined {
  const dx = px2 - px1;
  const dy = py2 - py1;
  const a = Math.atan2(ny2, nx2);
  const [rnx1, rny1] = vector2Rotate(-a, n1);
  // parallel
  if (Math.abs(rny1) < EPSILON) {
    return;
  }
  const [rdx, rdy] = vector2Rotate(-a, [dx, dy]);
  return rdy/rny1;
}

function closestLinePointVector([p1, rp2, a]: FiniteLine, p: ReadonlyVector2): ReadonlyVector2 {
  const [px1, py1] = p1;
  const [rpx2, rpy2] = rp2;
  let [rpx, rpy] = vector2Rotate(-a, p, p1);
  let cx: number;
  let cy: number;
  if (rpx < px1) {
    cx = px1;
    cy = py1;
  } else if (rpx > rpx2 ) {
    cx = rpx2;
    cy = rpy2;
  } else {
    cx = rpx;
    cy = py1;
  }
  return vector2Rotate(a, [rpx - cx, rpy - cy]);
}