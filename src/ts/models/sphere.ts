/// <reference path="./types.ts"/>

const SPHERE_PART_ID_BODY = 0;

type SpherePartId = 
  | typeof SPHERE_PART_ID_BODY
  ;

  const SPHERE_SEGMENTS_Z = 4;
  const SPHERE_SEGMENTS_Y = 3;
  const SPHERE_RADIUS = .4;

  const SPHERE_SHAPES_BODY: ConvexShape<PlaneMetadata> = FLAG_UNPACK_USE_ORIGINALS
    ? new Array(SPHERE_SEGMENTS_Z).fill(0).map((_, i) => {
      const az = Math.PI * 2 * i / SPHERE_SEGMENTS_Z;
      const cosz = Math.cos(az);
      const sinz = Math.sin(az);
      return new Array(SPHERE_SEGMENTS_Y).fill(0).map<Plane<PlaneMetadata>>((_, j) => {
        const ay = Math.PI * (j + 1) / (SPHERE_SEGMENTS_Y + 1) - Math.PI/2;
        const cosy = Math.cos(ay);
        const siny = Math.sin(ay);
        return toPlane(cosz * cosy, sinz * cosy, siny, SPHERE_RADIUS, { smoothingFlags: 1 });
      });
    }).flat(1).concat([
      toPlane(0, 0, -1, SPHERE_RADIUS, { smoothingFlags: 1 }),
      toPlane(0, 0, 1, SPHERE_RADIUS, { smoothingFlags: 1 }),
    ])
    : [];

const SPHERE_FACES_BODY = safeUnpackFaces(
  [...'8b.=S=.SS.bb=b.SbbSSSbS=b=S..b=.bS=Sb..===...S==b6),()*+),,(+-),./,-),*01+),12-+),23.-),4105),4621),2673),45)(),64(,),,/76),)50*),37/.'],
  FLAG_UNPACK_USE_ORIGINALS && decompose([[SPHERE_SHAPES_BODY, []]]),
);

const SPHERE_PART: BodyPart<SpherePartId> = {
  modelId: MODEL_ID_SPHERE,
};
