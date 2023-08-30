
const skyCylinderRadius = HORIZON*.6;
const skyCylinderBody = createCylinder(
  skyCylinderRadius,
  skyCylinderRadius,
  12,
);

const skyCylinderShapes: Shape<PlaneMetadata>[] = [
  [skyCylinderBody, []],
];

const skyCylinderFaces = decompose(skyCylinderShapes);