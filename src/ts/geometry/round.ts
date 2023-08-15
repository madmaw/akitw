// not used
function round(
  // base shape to round
  shape: ConvexShape,
  // the radius to round to, or, if negative, to subtract from the base shape
  r: number,
  // corners or edges
  edges?: boolean,
): ConvexShape {
  const faces = decompose([[shape, []]]);
  const normals = faces.flatMap(({ polygons, toModelCoordinates: toWorldCoordinates }) => {
    return polygons.flatMap((polygon) => {
      return polygon.map((point, i) => {
        const nextPoint = polygon[(i + 1)%polygon.length];
        const [worldPoint, nextWorldPoint] = [point, nextPoint].map(point => {
          return vector3TransformMatrix4(toWorldCoordinates, ...point);
        });
        return edges
          ?  vectorNScale(vectorNAdd(worldPoint, nextWorldPoint), .5)
          : worldPoint
          ;
      });
    });
  });
  const newPlanes = normals.filter((normal, i) => {
    return !normals.slice(0, i).some(compare => {
      return vectorNEquals(normal, compare);
    });
  }).map(normal => {
    const [x, y, z] = vectorNNormalize(normal);
    return toPlane(
      x, y, z,
      r > 0 ? r : vectorNLength(normal) + r,
    );
  });
  return [...shape, ...newPlanes];
}
