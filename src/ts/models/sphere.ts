/// <reference path="./types.ts"/>

const SPHERE_PART_ID_BODY = 0;

type SpherePartId = 
  | typeof SPHERE_PART_ID_BODY
  ;

  const SPHERE_SEGMENTS_Z = 12;
  const SPHERE_SEGMENTS_Y = 6;
  const SPHERE_RADIUS = .1;

  const SPHERE_SHAPES_BODY: ConvexShape<PlaneMetadata> = new Array(SPHERE_SEGMENTS_Z).fill(0).map((_, i) => {
    const az = Math.PI * 2 * i / SPHERE_SEGMENTS_Z;
    const cosz = Math.cos(az);
    const sinz = Math.sin(az);
    return new Array(SPHERE_SEGMENTS_Y).fill(0).map<Plane<PlaneMetadata>>((_, j) => {
      const ay = Math.PI * (j + 1) / (SPHERE_SEGMENTS_Y + 1) - Math.PI/2;
      const cosy = Math.cos(ay);
      const siny = Math.sin(ay);
      return toPlane(cosz * cosy, sinz * cosy, siny, SPHERE_RADIUS, {});
    });
  }).flat(1).concat([
    toPlane(0, 0, -1, SPHERE_RADIUS, {}),
    toPlane(0, 0, 1, SPHERE_RADIUS, {}),
  ]);

const SPHERE_FACES_BODY = decompose([[SPHERE_SHAPES_BODY, []]]);

const SPHERE_PART: BodyPart<SpherePartId> = {
  modelId: MODEL_ID_SPHERE,
};
