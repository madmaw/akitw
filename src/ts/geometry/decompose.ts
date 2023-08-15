function decompose(shapes: readonly Shape[]): readonly Face[] {
  const allPlanes = decomposeShapesToPlanes(shapes);
  const faces = decomposeShapesToFaces(shapes, allPlanes);
  return faces;
}

function decomposeShapesToPlanes(shapes: readonly Shape[]): readonly Plane[] {
  return shapes.map(([shape, subtractions]) => {
    return [...shape, ...subtractions.flat(1)];
  }).flat(1);
}

function decomposeShapesToFaces(
  shapes: readonly Shape[],
  allPlanes: readonly Plane[],
): readonly Face[] {
  return shapes.map((shape, i) => {
    const [addition, subtractions] = shape;
    // break the shape into faces
    return [addition, ...subtractions]
      // index == 0 => addition
      // index > 0 => subtraction
      .map((convexShape, isSubtraction) => {
        const faces = isSubtraction
          ? convexShape.map(flipPlane)
          : convexShape;
        return faces.map<Face[]>(plane => {
          const [translate, rotateToModelCoordinates] = planeToTransforms(plane);
          const toModelCoordinates = matrix4Multiply(translate, rotateToModelCoordinates);
          const inverseRotate = matrix4Invert(rotateToModelCoordinates);
          const inverse = matrix4Invert(toModelCoordinates);
          const lines = calculateLines(addition, inverseRotate, inverse);
          const polygon = calculateConvexPerimeter(lines);
  
          // break up the polygon into smallest possible parts
          const allLines = calculateLines(allPlanes, inverseRotate, inverse);
          const polygons = decomposeConvexPolygon(polygon, allLines)
            .filter(polygon => {
              // remove any polygons that are too small
              // ignore any empty shapes
              if (polygon.length < 3) {
                return;
              }

              // remove any polygons that exist within a known shape
              const average: Vector3 = polygon.reduce<Vector3>(([ax, ay], [x, y]) => {
                return [ax + x/polygon.length, ay + y/polygon.length, 0];
              }, [0, 0, 0]);
              const modelAverage = vector3TransformMatrix4(toModelCoordinates, ...average);
              // check the center point isn't contained within a filled area
              return shapes.every((check, j) => {
                const [checkAddition, checkSubtractions] = check;
                const subtractionsContain = checkSubtractions.some(
                  checkSubtraction => convexShapeContainPoint(
                      checkSubtraction,
                      modelAverage,
                      i > j ? EPSILON : -EPSILON,
                    ),
                );
                const additionContains = convexShapeContainPoint(
                  checkAddition,
                  modelAverage,
                  i < j ? -EPSILON : EPSILON,
                );

                // we are comparing with the current shape
                if (shape == check) {
                  // it's inside the bounding shape
                  return additionContains
                    // the inset subtractions don't contain it
                    && !subtractionsContain
                    // the outset subtractions do contain it or we are adding
                    && (convexShape == checkAddition || checkSubtractions.some(
                      checkSubtraction => convexShapeContainPoint(
                        checkSubtraction,
                        modelAverage,
                        EPSILON,
                      ),
                    ));
                } else {
                  // we are comparing with other shapes in the object
                  // if the subtractions contain this polygon we can show it
                  return subtractionsContain
                  // if the shape doesn't contain this polygon we can show it
                    || !additionContains;
                }
              });
            });
          if (polygons.length) {
            const face: Face = {
              polygons,
              rotateToModelCoordinates,
              toModelCoordinates,
            };
            return [
              face,
            ];  
          }
          return [];
        });  
      });
  }).flat(3);
}

function calculateLines(
  planes: readonly Plane[],
  inverseRotate: ReadonlyMatrix4,
  inverse: ReadonlyMatrix4,
): readonly Line[] {
  return planes.map<Line[]>(([compareDirection, compareOffset]) => {
    const rotatedCompareNormal = vector3TransformMatrix4(
      inverseRotate,
      ...compareDirection,
    );
    if (Math.abs(rotatedCompareNormal[2]) > 1 - EPSILON) {
      return [];
    }
    const rotatedCompareOffset = vector3TransformMatrix4(
      inverse,
      ...compareOffset,
    );
    // work out the intersection line of this plane with the current plane
    const intersectionDirection = vectorNNormalize(
      vector3CrossProduct(rotatedCompareNormal, NORMAL_Z),
    );
    const planeDirection = vectorNNormalize(
      vector3CrossProduct(intersectionDirection, rotatedCompareNormal),
    );
    const intersectionProportion = rotatedCompareOffset[2]/planeDirection[2];
    const [ipx, ipy] = rotatedCompareOffset.map((v, i) => (
      v - intersectionProportion * planeDirection[i]
    ));
    // NOTE: these are actually vec3s
    const [idx, idy] = intersectionDirection;
    return [[
      [idx, idy],
      [ipx, ipy],
    ]];
  }).flat(1);
}

function calculateConvexPerimeter(lines: readonly Line[]) {
  // work out the intersections
  const intersections = lines.map<([number, ReadonlyVector3] | 0)>(line => {
    let maxD: number | undefined;
    let maxLineIndex: number | undefined;
    const [[nx2, ny2], [px2, py2]] = line;
    lines.forEach((compare, compareIndex) => {
      const [[nx1, ny1], [px1, py1]] = compare; 
      const cosAngle = vectorNDotProduct([-ny2, nx2], [nx1, ny1]);
      if (cosAngle > EPSILON) {
        const d = (nx1 * py2 - nx1 * py1 - ny1 * px2 + ny1 * px1)/(ny1 * nx2 - nx1 * ny2);
        if (!(d < maxD)) {
          maxD = d;
          maxLineIndex = compareIndex;
        }
      }
    });
    return maxD != null
      ? [maxLineIndex, [px2 + nx2 * maxD, py2 + ny2 * maxD, 0]]
      : 0;
  });

  // walk the perimeter
  let intersection = intersections.find(i => i);
  let startIndex = -1;
  const perimeterIntersections: [number, ReadonlyVector3][] = [];
  while (intersection && startIndex < 0) {
    const nextIntersection = intersections[intersection[0]];
    perimeterIntersections.push(intersection);
    intersection = nextIntersection;
    startIndex = perimeterIntersections.indexOf(
      intersection as [number, ReadonlyVector3],
    );
  }
  // trim off any non circular bits
  perimeterIntersections.splice(0, startIndex);
  // convert to points
  const perimeter = perimeterIntersections.map(
    intersection => intersection[1],
  );
  return perimeter;
}

function decomposeConvexPolygon(polygon: ConvexPolygon, lines: readonly Line[]): ConvexPolygon[] {
  // find a line that bisects the polygon
  const intersectionPointsAndIndices = lines.map(line => {
    const intersections = polygon.map<[ReadonlyVector3, number][]>((p0, i) => {
      const i1 = (i + 1) % polygon.length;
      const p1 = polygon[i1];
      const p2 = polygon[(i + 2) % polygon.length];
      const p3 = polygon[(i + 3) % polygon.length];

      const [prevIntersectionD] = lineDeltaAndLength(p0 as any, p1 as any, line);
      const [currentIntersectionD, currentLength, currentDirection] = lineDeltaAndLength(p1 as any, p2 as any, line);
      const [nextIntersectionD] = lineDeltaAndLength(p2 as any, p3 as any, line);

      if (
        // the line is parallel
        currentIntersectionD == null
        // the previous line is parallel and we are near the point
        || prevIntersectionD == null && currentIntersectionD < EPSILON
        // the next line is parallel and we are near the point
        || nextIntersectionD == null && currentIntersectionD > currentLength - EPSILON
        // the intersection is off the start of the line
        || currentIntersectionD < -EPSILON
        // the intersection is off the end of the line
        || currentIntersectionD > currentLength + EPSILON
        ) {
        return [];
      }
      // TODO vectorNScaleThenSubtract? (add?)
      const intersectionPoint = vectorNScaleThenAdd(
        p1,
        currentDirection,
        currentIntersectionD,
      );
      return [[intersectionPoint, i1]];
    })
      .flat(1)
      .filter(([p1], i, a) => {
        const [p2] = a[(i+1)%a.length];
        const d = vectorNLength(vectorNScaleThenAdd(p1, p2, -1));
        return d > EPSILON;
      });
    if (intersections.length == 2) {
      return intersections;
    }
    return [];
  }).flat(1);
  if (intersectionPointsAndIndices.length) {
    // bisect
    const [[p1, i1], [p2, i2]] = intersectionPointsAndIndices;
    const poly1: ConvexPolygon = [
      p1,
      ...polygon.slice(i1+1, i2 > i1 ? i2 + 1 : polygon.length),
      ...polygon.slice(0, i2 > i1 ? 0 : i2 + 1),
      p2,
    ];
    const poly2: ConvexPolygon = [
      p2,
      ...polygon.slice(i2+1, i2 > i1 ? polygon.length : i1 + 1),
      ...polygon.slice(0, i2 > i1 ? i1 + 1 : 0),
      p1,
    ];
    return [poly1, poly2].map(
      poly => decomposeConvexPolygon(dedupePolygon(poly), lines)
    ).flat(1);
  }
  return [polygon];
}

