
const skyCylinderRadius = HORIZON*.6;
const skyCylinderBody = createCylinder(
  skyCylinderRadius,
  skyCylinderRadius,
  12,
);

const skyCylinder: Shape<PlaneMetadata>[] = [
  [skyCylinderBody, []],
];