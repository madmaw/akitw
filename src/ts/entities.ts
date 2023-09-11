/// <reference path="./world/types.ts"/>

//                0  1 2 3  4 5 6  7 8  9 0  1 2  3  4 5 6 7  8  9
const SYMBOLS = '🌴🌳🌲🌵🌿🌼🍖🐐🐄🐇🦌🐆🧍🛖🥚💎🦴';

const SYMBOL_INDEX_PALM_TREE = 0;
const SYMBOL_INDEX_DECIDUOUS_TREE = 1;
const SYMBOL_INDEX_PINE_TREE = 2;
const SYMBOL_INDEX_CACTUS = 3;
const SYMBOL_INDEX_HERB = 4;
const SYMBOL_INDEX_FLOWER = 5;
const SYMBOL_INDEX_MEAT = 6;
const SYMBOL_INDEX_GOAT = 7;
const SYMBOL_INDEX_COW = 8;
const SYMBOL_INDEX_RABBIT = 9;
const SYMBOL_INDEX_DEER = 10;
const SYMBOL_INDEX_LEOPARD = 11;
const SYMBOL_INDEX_HUMAN = 12;
const SYMBOL_INDEX_HUT = 13;
const SYMBOL_INDEX_EGG = 14;
const SYMBOL_INDEX_GEM = 15;
const SYMBOL_INDEX_BONE = 16;

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

type EntityFactory = (scale: number) => DynamicEntity;

const standardAttractions: Partial<Record<EntityType, number>> = {
  // will attempt to kill baby dragons
  [ENTITY_TYPE_BABY_DRAGON]: -5,
  [ENTITY_TYPE_PLAYER_CONTROLLED]: -3,
  [ENTITY_TYPE_FIRE]: -3,
  [ENTITY_TYPE_FIREBALL]: -4,
};

function prototypeEntityFactoryProvider(
  entityPrototype: Pick<
    Entity,
    | 'entityType'
    | 'collisionGroup'
    | 'collisionMask'
    | 'modelAtlasIndex'
    | 'health'
    | 'shadows'
    | 'inverseMass'
    | 'inverseFriction'
    | 'transient'
  >
  & Pick<
    IntelligentEntity,
    | 'roaming'
    | 'attraction'
    | 'foodChain'
  >,
  baseRadius: number,
  contained?: EntityFactory[],
): EntityFactory {
  return function(intrinsicScale: number) {

    const scale = baseRadius * intrinsicScale
    const resolutions = new Array(
      Math.min(
        Math.sqrt(scale * 2) + 2
          // boost entities that can move
          + (entityPrototype.inverseMass ? 1 : 0) | 0,
          RESOLUTIONS - 2,
        )
    )
      .fill(0)
      .map((_, i) => i);

    const radius = scale/2;
    const bounds = rect3FromRadius(radius);
    const entity: DynamicEntity = {
      ...entityPrototype as any,
      bounds,
      collisionRadius: radius,
      id: nextEntityId++,
      pos: VECTOR3_EMPTY,
      renderGroupId: nextRenderGroupId++,
      resolutions,
      velocity: [0, 0, 0],
      modelVariant: VARIANT_SYMBOLS,
      entityBody: {
        modelId: entityPrototype.entityType == ENTITY_TYPE_INTELLIGENT
          ? MODEL_ID_BILLBOARD_TWO_SIDED
          : MODEL_ID_BILLBOARD,
      },
      bodyTransform: matrix4Scale(scale),
      gravity: entityPrototype.inverseMass ? DEFAULT_GRAVITY : 0,
      // xRotation: 0,
      // yRotation: 0,
      // zRotation: 0,
      maximumLateralVelocity: .005,
      maximumLateralAcceleration: .00001,
      contained: contained?.map(contained => contained(1)),
    };
    return entity;
  };
};

const meatFactory = prototypeEntityFactoryProvider({
  entityType: ENTITY_TYPE_ITEM,
  collisionGroup: COLLISION_GROUP_ITEMS,
  collisionMask: COLLISION_GROUP_TERRAIN,
  modelAtlasIndex: SYMBOL_INDEX_MEAT,
  inverseMass: 4,
  inverseFriction: .1,
  health: 2,
  transient: 1,
}, .5);

const gemFactory = prototypeEntityFactoryProvider({
  entityType: ENTITY_TYPE_ITEM,
  collisionGroup: COLLISION_GROUP_ITEMS,
  collisionMask: COLLISION_GROUP_TERRAIN,
  modelAtlasIndex: SYMBOL_INDEX_GEM,
  inverseMass: 4,
  health: 9,
  transient: 1,
}, .5);

const boneFactory = prototypeEntityFactoryProvider({
  entityType: ENTITY_TYPE_SCENERY,
  collisionGroup: COLLISION_GROUP_NONE,
  collisionMask: COLLISION_GROUP_TERRAIN,
  modelAtlasIndex: SYMBOL_INDEX_BONE,
  inverseMass: 4,
  health: 1,
  transient: 1,
}, .5);

const BIOME_LOOKUP_TABLE: ([
  // probability
  number,
  // entity type to create
  EntityFactory,
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
      1,
      prototypeEntityFactoryProvider(
        {
          entityType: ENTITY_TYPE_SCENERY,
          collisionGroup: COLLISION_GROUP_SCENERY,
          modelAtlasIndex: SYMBOL_INDEX_HUT,
          health: 9,
        },
        4,
        [gemFactory]
      ),
    ],
    // cow
    [
      1,
      prototypeEntityFactoryProvider(
        {
          entityType: ENTITY_TYPE_INTELLIGENT,
          collisionGroup: COLLISION_GROUP_ENEMY,
          collisionMask: COLLISION_GROUP_SCENERY
            | COLLISION_GROUP_PLAYER
            | COLLISION_GROUP_TERRAIN,
          modelAtlasIndex: SYMBOL_INDEX_COW,
          health: 9,
          inverseMass: .5,
          inverseFriction: 1,
          shadows: 1,
          attraction: standardAttractions,
        },
        2.5,
        [meatFactory],
      ),
    ],
    // human
    [
      1,
      prototypeEntityFactoryProvider(
        {
          entityType: ENTITY_TYPE_INTELLIGENT,
          collisionGroup: COLLISION_GROUP_ENEMY,
          collisionMask: COLLISION_GROUP_SCENERY
            | COLLISION_GROUP_PLAYER
            | COLLISION_GROUP_TERRAIN,
          modelAtlasIndex: SYMBOL_INDEX_HUMAN,
          health: 7,
          inverseMass: .8,
          inverseFriction: 1,
          shadows: 1,
          foodChain: 1,
          attraction: {
            ...standardAttractions,
            [ENTITY_TYPE_PLAYER_CONTROLLED]: 2,
          },
        },
        2,
      ),
    ],
  ],
  // desert
  [
    [1e3],
    // cactus
    [
      9,
      prototypeEntityFactoryProvider(
        {
          entityType: ENTITY_TYPE_SCENERY, 
          collisionGroup: COLLISION_GROUP_SCENERY,
          modelAtlasIndex: SYMBOL_INDEX_CACTUS,
          health: 3,
          shadows: 1,
        },
        3,  
      ),
    ],
    // leopard
    [
      1,
      prototypeEntityFactoryProvider(
        {
          entityType: ENTITY_TYPE_INTELLIGENT,
          collisionGroup: COLLISION_GROUP_ENEMY,
          collisionMask: COLLISION_GROUP_SCENERY
            | COLLISION_GROUP_PLAYER
            | COLLISION_GROUP_TERRAIN
            | COLLISION_GROUP_ENEMY,
          modelAtlasIndex: SYMBOL_INDEX_LEOPARD,
          health: 9,
          inverseMass: 1,
          inverseFriction: 1,
          shadows: 1,
          roaming: 15,
          attraction: {
            ...standardAttractions,
            [ENTITY_TYPE_PLAYER_CONTROLLED]: 2,
            [ENTITY_TYPE_BABY_DRAGON]: 3,
            [ENTITY_TYPE_INTELLIGENT]: 3,
          },
          foodChain: 2,
        },
        2,
        [boneFactory],
      ),
    ],    
  ],
  // tropical
  [
    // palm tree
    [
      1,
      prototypeEntityFactoryProvider(
        {
          entityType: ENTITY_TYPE_SCENERY, 
          collisionGroup: COLLISION_GROUP_SCENERY,
          modelAtlasIndex: SYMBOL_INDEX_PALM_TREE,
          health: 99,
          shadows: 1,
        }, 
        5,  
      ),
    ],
  ],
  // grassland
  [
    [1e4],
    // flower
    [
      99,
      prototypeEntityFactoryProvider(
        {
          entityType: ENTITY_TYPE_SCENERY,
          collisionGroup: COLLISION_GROUP_NONE,
          modelAtlasIndex: SYMBOL_INDEX_FLOWER,
        },
        .2,
      ),
    ],
    // rabbit
    [
      9,
      prototypeEntityFactoryProvider(
        {
          entityType: ENTITY_TYPE_INTELLIGENT,
          collisionGroup: COLLISION_GROUP_ENEMY,
          collisionMask: COLLISION_GROUP_SCENERY
            | COLLISION_GROUP_PLAYER
            | COLLISION_GROUP_TERRAIN,
          modelAtlasIndex: SYMBOL_INDEX_RABBIT,
          health: 4,
          inverseMass: 6,
          inverseFriction: 1,
          shadows: 1,
          attraction: standardAttractions,
        },
        1,
        [boneFactory],
      ),
    ],
    // deer
    [
      2,
      prototypeEntityFactoryProvider(
        {
          entityType: ENTITY_TYPE_INTELLIGENT,
          collisionGroup: COLLISION_GROUP_ENEMY,
          collisionMask: COLLISION_GROUP_SCENERY
            | COLLISION_GROUP_PLAYER
            | COLLISION_GROUP_TERRAIN,
          modelAtlasIndex: SYMBOL_INDEX_DEER,
          health: 9,
          inverseMass: .8,
          inverseFriction: 1,
          shadows: 1,
          attraction: standardAttractions,
        },
        2,
        [meatFactory],
      ),
    ],
    
  ],
  // broadleaf forest
  [
    // deciduous tree
    [
      1,
      prototypeEntityFactoryProvider(
        {
          entityType: ENTITY_TYPE_SCENERY,
          collisionGroup: COLLISION_GROUP_SCENERY,
          modelAtlasIndex: SYMBOL_INDEX_DECIDUOUS_TREE,
          health: 99,
          shadows: 1,
        },
        6,  
      ),
    ],
  ],
  // coniferous forest
  [
    // pine tree
    [
      1,
      prototypeEntityFactoryProvider(
        {
          entityType: ENTITY_TYPE_SCENERY,
          collisionGroup: COLLISION_GROUP_SCENERY,
          modelAtlasIndex: SYMBOL_INDEX_PINE_TREE,
          health: 99,
          shadows: 1,
        },
        5,  
      ),
    ],
  ],
  // mountains
  [
    [1e3],
    // herb
    [
      99,
      prototypeEntityFactoryProvider(
        {
          entityType: ENTITY_TYPE_SCENERY,
          collisionGroup: COLLISION_GROUP_NONE,
          modelAtlasIndex: SYMBOL_INDEX_HERB,
        },
        .4,
      ),
    ],
    // goat
    [
      1,
      prototypeEntityFactoryProvider(
        {
          entityType: ENTITY_TYPE_INTELLIGENT,
          collisionGroup: COLLISION_GROUP_ENEMY,
          collisionMask: COLLISION_GROUP_SCENERY
            | COLLISION_GROUP_PLAYER
            | COLLISION_GROUP_TERRAIN,
          modelAtlasIndex: SYMBOL_INDEX_GOAT,
          health: 6,
          inverseMass: 1,
          inverseFriction: 1,
          shadows: 1,
          attraction: standardAttractions,
        },
        1.5,  
        [boneFactory],
      ),
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
