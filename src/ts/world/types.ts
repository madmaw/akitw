let nextEntityId = 1;
let nextRenderGroupId = 1;

const ENTITY_TYPE_ACTIVE = 1;
const ENTITY_TYPE_SCENERY = 2;
const ENTITY_TYPE_FIREBALL = 3;
const ENTITY_TYPE_PARTICLE = 4;
const ENTITY_TYPE_TERRAIN = 5;
const ENTITY_TYPE_FIRE = 7;

type EntityTypeDragon = typeof ENTITY_TYPE_ACTIVE;
type EntityTypeScenery = typeof ENTITY_TYPE_SCENERY;
type EntityTypeFireball = typeof ENTITY_TYPE_FIREBALL;
type EntityTypeParticle = typeof ENTITY_TYPE_PARTICLE;
type EntityTypeTerrain = typeof ENTITY_TYPE_TERRAIN;
type EntityTypeFire = typeof ENTITY_TYPE_FIRE;

type EntityType =
  | EntityTypeDragon
  | EntityTypeScenery
  | EntityTypeFireball
  | EntityTypeParticle
  | EntityTypeFire
  ;

// nothing collides with this
const COLLISION_GROUP_NONE = 0;
const COLLISION_GROUP_PLAYER = 1;
const COLLISION_GROUP_ENEMY = 2;
const COLLISION_GROUP_ITEMS = 4;
const COLLISION_GROUP_TERRAIN = 8;
const COLLISION_GROUP_SCENERY = 16;

type CollisionGroup =
  | typeof COLLISION_GROUP_NONE
  | typeof COLLISION_GROUP_PLAYER
  | typeof COLLISION_GROUP_ENEMY
  | typeof COLLISION_GROUP_ITEMS
  | typeof COLLISION_GROUP_TERRAIN
  | typeof COLLISION_GROUP_SCENERY
  ;

// action ids are also masks
// order is priority 
const ACTION_ID_IDLE = 1;
const ACTION_ID_WALK = 2;
const ACTION_ID_WALK_BACKWARD = 4;
const ACTION_ID_RUN = 8;
const ACTION_ID_GLIDE = 16;
const ACTION_ID_FLAP = 32;
const ACTION_ID_CANCEL = 512;
const ACTION_ID_TAKE_DAMAGE = 1024;

type ActionId = 
    | typeof ACTION_ID_IDLE 
    | typeof ACTION_ID_WALK
    | typeof ACTION_ID_WALK_BACKWARD
    | typeof ACTION_ID_RUN
    | typeof ACTION_ID_FLAP
    | typeof ACTION_ID_GLIDE
    | typeof ACTION_ID_CANCEL
    | typeof ACTION_ID_TAKE_DAMAGE
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
type Entity<PartId extends number = number> = 
  | StaticEntity<PartId>
  | DynamicEntity<PartId>
  | DragonEntity<PartId>
  | FireEntity<PartId>
  ;

// return true when done
type EntityAnimation = (e: Entity, delta: number) => Booleanish;
type JointAnimation = (j: Joint, delta: number) => Booleanish;

type BodyPart<PartId extends number = number> = {
  readonly modelId?: ModelId,
  readonly id?: PartId
  readonly preRotation?: ReadonlyVector3,
  readonly postRotation?: ReadonlyVector3,
  readonly preRotationOffset?: ReadonlyVector3,
  readonly children?: readonly BodyPart<PartId>[],
};

type Joint = {
  // rotation
  ['r']?: ReadonlyVector3,
  anim?: JointAnimation | Falsey,
  animAction?: ActionId | 0,
}

type BaseEntity<PartId extends number = number> = {
  readonly renderGroupId: RenderGroupId,
  readonly id: EntityId,
  // all the resolutions that this entity renders in
  readonly resolutions: number[];

  // TODO remove position from static entity
  position: ReadonlyVector3,
  // collision and render bounds, whichever is larger
  readonly bounds: ReadonlyRect3,
  logs?: any[][];

  readonly joints?: Record<PartId, Joint>,
  body?: BodyPart<PartId> | Falsey,
  // reference to textures/colours/etc...
  modelVariant?: VariantId;
  // the index of the atlas to use
  modelAtlasIndex?: number,

  dead?: Booleanish,
  // what will hit us
  collisionGroup: CollisionGroup,
  // what we will hit
  collisionMask?: number,
  health?: number,
  // indicates that the entity dies when it goes out of view
  transient?: Booleanish,
  // persistent transform applied to the body
  transform?: ReadonlyMatrix4;
  // temporary attribute used to pass info between animations
  // animation transform
  ['at']?: ReadonlyMatrix4,
  anims?: EntityAnimation[],
};

type PlaneMetadata = {
  readonly textureCoordinateTransform?: ReadonlyMatrix4,
  // if the orring the flags is non-zero, two planes will attempt to be smoothed. undefined = smoothing with nothing
  readonly smoothingFlags?: number,
};

type StaticEntity<PartId extends number = number> = {
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
  yRotation?: undefined,
  zRotation?: undefined,
  shadows?: Falsey,
} & BaseEntity<PartId>;

type BaseDynamicEntity<PartId extends number = number> = {
  readonly face?: undefined,
  velocity: Vector3,
  zRotation?: number,
  readonly collisionRadius: number,
  readonly restitution?: number,
  inverseFriction?: number,
  gravity?: number,
  readonly renderTile?: undefined,
  readonly inverseMass?: number,
  // the time the dynamic entity last made contact with the ground
  lastOnGroundTime?: number,
  // the angle at which we last made contact with the ground
  lastOnGroundNormal?: Vector3,
  shadows?: Booleanish,
} & BaseEntity<PartId>;

type DynamicEntity<PartId extends number = number> = {
  readonly entityType:
    | EntityTypeFireball
    | EntityTypeParticle
    | EntityTypeScenery
  ,
  xRotation?: undefined,
  yRotation?: undefined,
} & BaseDynamicEntity<PartId>;

type ActiveEntity<PartId extends number = number> = {
  // lateral, so the z point can be ignored
  targetLateralPosition?: ReadonlyVector3;
  maximumLateralVelocity: number,
  maximumLateralAcceleration: number,
  xRotation: number,
  yRotation: number,
  zRotation: number,
} & BaseDynamicEntity<PartId>;

type DragonEntity<PartId extends number = number> = {
  readonly entityType: 
    | EntityTypeDragon,
  fireReservior?: number,
  lastFired?: number,
} & ActiveEntity<PartId>;

type FireEntity<PartId extends number = number> = {
  readonly entityType: 
    | EntityTypeFire,
  lastSpawnedParticle?: number,
  xRotation?: undefined,
  yRotation?: undefined,
} & BaseDynamicEntity<PartId>;