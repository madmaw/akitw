const ENTITY_TYPE_DRAGON = 1;
const ENTITY_TYPE_SCENERY = 2;
const ENTITY_TYPE_FIREBALL = 3;
const ENTITY_TYPE_PARTICLE = 4;
const ENTITY_TYPE_TERRAIN = 5;
const ENTITY_TYPE_FIRE = 6;
const ENTITY_TYPE_EXPLOSION = 7;

type EntityTypeDragon = typeof ENTITY_TYPE_DRAGON;
type EntityTypeScenery = typeof ENTITY_TYPE_SCENERY;
type EntityTypeFireball = typeof ENTITY_TYPE_FIREBALL;
type EntityTypeParticle = typeof ENTITY_TYPE_PARTICLE;
type EntityTypeTerrain = typeof ENTITY_TYPE_TERRAIN;
type EntityTypeFire = typeof ENTITY_TYPE_FIRE;
type EntityTypeExplosion = typeof ENTITY_TYPE_EXPLOSION;

type EntityType =
  | EntityTypeDragon
  | EntityTypeScenery
  | EntityTypeFireball
  | EntityTypeParticle
  | EntityTypeFire
  | EntityTypeExplosion
  ;

const COLLISION_GROUP_PLAYER = 1;
const COLLISION_GROUP_ENEMY = 2;
const COLLISION_GROUP_ITEMS = 4;
const COLLISION_GROUP_TERRAIN = 8;

type CollisionGroup =
  | typeof COLLISION_GROUP_PLAYER
  | typeof COLLISION_GROUP_ENEMY
  | typeof COLLISION_GROUP_ITEMS
  | typeof COLLISION_GROUP_TERRAIN
  ;

type World = Grid[];

type GridId = 1;
type Grid = readonly(Tile[])[];

type Tile = {
  entities: Record<EntityId, Entity>,
  populated?: Booleanish,
  resolution: number,
};

type RenderGroupId = number;
type EntityId = number;
type Entity = StaticEntity | DynamicEntity;

type ModelId = number;

// return true when done
type EntityAnimation = (e: Entity, delta: number) => Booleanish;

type BaseEntity = {
  readonly renderGroupId: RenderGroupId,
  // TODO make optional so, if it's 0 we can just use the position directly
  readonly centerOffset: ReadonlyVector3,
  readonly collisionRadiusFromCenter: number,
  readonly id: EntityId,
  // all the resolutions that this entity renders in
  readonly resolutions: number[];

  position: Vector3,
  // collision and render bounds, whichever is larger
  readonly bounds: ReadonlyRect3,
  logs?: any[][];
  // the radius of the fire associated with this entity
  readonly fire?: number,

  readonly modelId?: ModelId,
  // reference to textures/colours/etc...
  modelVariant?: VariantId;
  // the index of the atlas to use
  modelAtlasIndex?: number,
  readonly modelTransform?: ReadonlyMatrix4,
  dead?: Booleanish,
  // what will hit us
  collisionGroup: CollisionGroup,
  // what we will hit
  collisionMask?: number,
  health?: number,
  animationTransform?: ReadonlyMatrix4,
  animations?: EntityAnimation[],
};

type PlaneMetadata = {
  readonly textureCoordinateTransform?: ReadonlyMatrix4,
};

type StaticEntity = {
  readonly entityType: EntityTypeTerrain,
  readonly face: Face<PlaneMetadata>,
  readonly rotateToPlaneCoordinates: ReadonlyMatrix4,
  readonly worldToPlaneCoordinates: ReadonlyMatrix4,
  // TODO toWorldCoordinates, rotateToWorldCoordinates
  // only render if is in this tile
  readonly renderTile?: Tile,
  velocity?: undefined,
  readonly inverseMass?: undefined,
  xRotation?: undefined,
  zRotation?: undefined,
} & BaseEntity;

type DynamicEntity = {
  readonly entityType:
    | EntityTypeDragon
    | EntityTypeFire
    | EntityTypeFireball
    | EntityTypeParticle
    | EntityTypeScenery
    | EntityTypeExplosion,
  readonly face?: undefined,
  velocity: Vector3,
  xRotation?: number,
  zRotation?: number,
  readonly restitution?: number,
  readonly gravity?: number,
  readonly renderTile?: undefined,
  readonly inverseMass?: number,
} & BaseEntity;
