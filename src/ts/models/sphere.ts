/// <reference path="./types.ts"/>

const SPHERE_PART_ID_BODY = 0;

type SpherePartId = 
  | typeof SPHERE_PART_ID_BODY
  ;

  const SPHERE_SEGMENTS_Z = 8;
  const SPHERE_SEGMENTS_Y = 4;
  const SPHERE_RADIUS = .5;

  const SPHERE_SHAPES_BODY: ConvexShape<PlaneMetadata> = new Array(SPHERE_SEGMENTS_Z).fill(0).map((_, i) => {
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
  ]);

const SPHERE_FACES_BODY = safeUnpackFaces(
  [...'Pc=4RD(RL(cS4j:HjVHcS\\c=\\RLhRDhLR(Sc4VjHSc\\LRhDR(=c4:jH=c\\DRh>L(-S4&VH-S\\>Lh>D(-=4&:H-=\\>DhD>(=-4:&H=-\\D>hL>(S-4V&HS-\\L>hJ),()*+),,(+-),-./,),.01/),+*23),-+34),45.-),560.),7832),3894),49:5),:;65),87<=),98=>),>?:9),?@;:),=<AB),>=BC),>CD?),DE@?),BAFG),CBGH),IDCH),JEDI),GFKL),GLMH),HMNI),NOJI),LK)(),(,ML),,/NM),1ON/)0)KFA<72*)06;@EJO10)'],
  FLAG_UNPACK_USE_ORIGINALS && decompose([[SPHERE_SHAPES_BODY, []]]),
);

const SPHERE_PART: BodyPart<SpherePartId> = {
  modelId: MODEL_ID_SPHERE,
};
