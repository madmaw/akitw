const ENTITY_TYPE_ACTIVE = 1;
const ENTITY_TYPE_SCENERY = 2;
const ENTITY_TYPE_FIREBALL = 3;
const ENTITY_TYPE_PARTICLE = 4;
const ENTITY_TYPE_TERRAIN = 5;
const ENTITY_TYPE_EXPLOSION = 6;

type EntityTypeDragon = typeof ENTITY_TYPE_ACTIVE;
type EntityTypeScenery = typeof ENTITY_TYPE_SCENERY;
type EntityTypeFireball = typeof ENTITY_TYPE_FIREBALL;
type EntityTypeParticle = typeof ENTITY_TYPE_PARTICLE;
type EntityTypeTerrain = typeof ENTITY_TYPE_TERRAIN;
type EntityTypeExplosion = typeof ENTITY_TYPE_EXPLOSION;

type EntityType =
  | EntityTypeDragon
  | EntityTypeScenery
  | EntityTypeFireball
  | EntityTypeParticle
  | EntityTypeExplosion
  ;

// nothing collides with this
const COLLISION_GROUP_NONE = 0;
const COLLISION_GROUP_PLAYER = 1;
const COLLISION_GROUP_ENEMY = 2;
const COLLISION_GROUP_ITEMS = 4;
const COLLISION_GROUP_TERRAIN = 8;

type CollisionGroup =
  | typeof COLLISION_GROUP_NONE
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
type Entity = StaticEntity | DynamicEntity | ActiveEntity;

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
  fire?: number,
  // by how much this entity is on fire (0/undefined = not on fire)
  onFire?: number,

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
  // indicates that the entity dies when it goes out of view
  transient?: Booleanish,
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

type BaseDynamicEntity = {
  readonly face?: undefined,
  velocity: Vector3,
  xRotation?: number,
  zRotation?: number,
  readonly restitution?: number,
  inverseFriction?: number,
  readonly gravity?: number,
  readonly renderTile?: undefined,
  readonly inverseMass?: number,
  // the time the dynamic entity last made contact with the ground
  lastOnGroundTime?: number,
  // the angle at which we last made contact with the ground
  lastOnGroundNormal?: Vector3,
} & BaseEntity

type DynamicEntity = {
  readonly entityType:
  | EntityTypeFireball
  | EntityTypeParticle
  | EntityTypeScenery
  | EntityTypeExplosion,
} & BaseDynamicEntity;

type ActiveEntity = {
  readonly entityType: 
    | EntityTypeDragon,
  targetLateralPosition?: Vector2 | Vector3;
  maximumLateralVelocity: number,
} & BaseDynamicEntity;
