/// <reference path="./types.ts"/>

const skyCylinderRadius = HORIZON*.6;
const skyCylinderBody = createCylinder(
  skyCylinderRadius,
  skyCylinderRadius,
  12,
);

const SHAPES_SKY_CYLINDER: Shape<PlaneMetadata>[] = [
  [skyCylinderBody, []],
];

const SKY_CYLINDER_FACES = decompose(SHAPES_SKY_CYLINDER);