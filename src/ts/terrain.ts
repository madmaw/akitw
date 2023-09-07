/// <reference path="./world/types.ts"/>
// bit flags
const BIOME_ROAD = 0;
const BIOME_BEACH = 1;
const BIOME_CIVILISATION = 2;
const BIOME_DESERT = 3;
const BIOME_TROPICAL = 4;
const BIOME_GRASSLAND = 5;
const BIOME_BROADLEAF_FOREST = 6;
const BIOME_CONIFEROUS_FOREST = 7;
const BIOME_MOUNTAINS = 8;

type Biome = 
  | typeof BIOME_ROAD
  | typeof BIOME_BEACH
  | typeof BIOME_CIVILISATION
  | typeof BIOME_DESERT
  | typeof BIOME_TROPICAL
  | typeof BIOME_GRASSLAND
  | typeof BIOME_BROADLEAF_FOREST
  | typeof BIOME_MOUNTAINS
  ;

const BIOME_LOOKUP_TABLE: ([
  // probability
  number,
  // entity type to create
  Pick<
    Entity,
    | 'entityType'
    | 'collisionGroup'
    | 'collisionMask'
    | 'health'
    | 'inverseMass'
    | 'modelAtlasIndex'
    | 'shadows'
  >,
  // scale
  number,
] | [
  // do nothing
  number
])[][] = [
  // road
  [],
  // beach
  [],
  // civilisation
  [
    // hut
    [
      9,
      {
        entityType: ENTITY_TYPE_SCENERY,
        collisionGroup: COLLISION_GROUP_SCENERY,
        modelAtlasIndex: 11,
        health: 9,
      },
      4,
    ],
    // house
    // [5, ENTITY_TYPE_SCENERY, 11, 4],
    // // church
    // [2, ENTITY_TYPE_SCENERY, 12, 6],
    // // mosque
    // [2, ENTITY_TYPE_SCENERY, 13, 6],
    // // bank
    // [1, ENTITY_TYPE_SCENERY, 14, 7],
    // // castle
    // [1, ENTITY_TYPE_SCENERY, 15, 9],
  ],
  // desert
  [
    [99],
    // cactus
    [
      1,
      {
        entityType: ENTITY_TYPE_SCENERY, 
        collisionGroup: COLLISION_GROUP_SCENERY,
        modelAtlasIndex: 3,
        health: 3,
        shadows: 1,
      },
      3,
    ],
  ],
  // tropical
  [
    // palm tree
    [
      1,
      {
        entityType: ENTITY_TYPE_SCENERY, 
        collisionGroup: COLLISION_GROUP_SCENERY,
        modelAtlasIndex: 0,
        health: 9,
        shadows: 1,
      }, 
      5,
    ],
  ],
  // grassland
  [
    [999],
    // flower
    [
      9,
      {
        entityType: ENTITY_TYPE_SCENERY,
        collisionGroup: COLLISION_GROUP_NONE,
        modelAtlasIndex: 5,
      },
      .2,
    ],
    // cow
    [
      1,
      {
        entityType: ENTITY_TYPE_INTELLIGENT,
        collisionGroup: COLLISION_GROUP_ENEMY,
        collisionMask: COLLISION_GROUP_SCENERY | COLLISION_GROUP_PLAYER | COLLISION_GROUP_TERRAIN,
        modelAtlasIndex: 9,
        health: 4,
        inverseMass: .5,
        shadows: 1,
      },
      2
    ],
    // rabbit
    [
      2,
      {
        entityType: ENTITY_TYPE_INTELLIGENT,
        collisionGroup: COLLISION_GROUP_ENEMY,
        collisionMask: COLLISION_GROUP_SCENERY | COLLISION_GROUP_PLAYER | COLLISION_GROUP_TERRAIN,
        modelAtlasIndex: 10,
        health: 1,
        inverseMass: 6,
        shadows: 1,
      },
      1
    ]
    
  ],
  // broadleaf forest
  [
    // deciduous tree
    [
      1,
      {
        entityType: ENTITY_TYPE_SCENERY,
        collisionGroup: COLLISION_GROUP_SCENERY,
        modelAtlasIndex: 1,
        health: 9,
        shadows: 1,
      },
      6,
    ],
  ],
  // coniferous forest
  [
    // pine tree
    [
      1,
      {
        entityType: ENTITY_TYPE_SCENERY,
        collisionGroup: COLLISION_GROUP_SCENERY,
        modelAtlasIndex: 2,
        health: 9,
        shadows: 1,
      },
      5,
    ],
  ],
  // mountains
  [
    [99],
    // herb
    [
      9,
      {
        entityType: ENTITY_TYPE_SCENERY,
        collisionGroup: COLLISION_GROUP_NONE,
        modelAtlasIndex: 4,
      },
      .4,
    ],
    // goat
    [
      .1,
      {
        entityType: ENTITY_TYPE_INTELLIGENT,
        collisionGroup: COLLISION_GROUP_ENEMY,
        collisionMask: COLLISION_GROUP_SCENERY | COLLISION_GROUP_PLAYER | COLLISION_GROUP_TERRAIN,
        modelAtlasIndex: 8,
        health: 4,
        inverseMass: 1,
        shadows: 1,
      },
      1.5,
    ],
  ],
]

//intensities
type ZoneTile = [
  // road/empty
  number,
  // beach
  number,
  // civilisation
  number,
  // desert
  number,
  // tropical
  number,
  // grassland
  number,
  // broadleaf forest
  number,
  // coniferous forest
  number,
  // mountains
  number,
];

type Terrain = (x: number, y: number) => number;

function weightedAverageTerrainFactory(
  depths: number[][],
): Terrain {
  return function(wx: number, wy: number) {
    const tx = wx * DEPTH_DIMENSION;
    const ty = wy * DEPTH_DIMENSION;
    const dcx = wx * 2 - 1;
    const dcy = wy * 2 - 1;
    //const sampleRadius = worldSampleRadius * DEPTH_DIMENSION;
    const sampleRadius = 3;
    const sampleRadiusSquared = sampleRadius * sampleRadius;
    const roundedSampleRadius = sampleRadius | 0;
    let totalWeight = 0;
    let totalWeightedDepth = 0;

    //const sharpness = Math.max(0, depths[tx | 0][ty | 0]/9);
    const sharpness = Math.pow(1 - (dcx * dcx + dcy * dcy), 4) * 3;

    for (let x = tx - roundedSampleRadius | 0; x < tx + sampleRadius; x++) {
      for (let y = ty - roundedSampleRadius | 0; y < ty + sampleRadius; y++) {
        const dx = tx - x;
        const dy = ty - y;
        const distanceSquared = dx * dx + dy * dy;
        
        if (sampleRadiusSquared > distanceSquared) {
          const sharpWeight = Math.pow(1 - Math.sqrt(distanceSquared)/sampleRadius, sharpness);
          const smoothWeight = Math.cos((Math.sqrt(distanceSquared)/sampleRadius) * Math.PI/2);
          const weight = sharpWeight * Math.min(1, sharpness) + smoothWeight * Math.max(0, 1 - sharpness);

          const depth = x < 0
            || y < 0
            || x >= DEPTH_DIMENSION
            || y >= DEPTH_DIMENSION
            ? -2
            : depths[x][y];
          totalWeightedDepth += weight * depth;
          totalWeight += weight;
        }
    }
    }
    return totalWeight > 0
      ? totalWeightedDepth/totalWeight * WORLD_DEPTH_SCALE
      : 0;
  };
}