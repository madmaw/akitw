let nextEntityId = 1;
let nextRenderGroupId = 1;

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

// action ids are also masks
// order is priority 
const ACTION_ID_IDLE = 1;
const ACTION_ID_WALK = 2;
const ACTION_ID_WALK_BACKWARD = 4;
const ACTION_ID_RUN = 8;
const ACTION_ID_JUMP = 16;
const ACTION_ID_CANCEL = 512;
const ACTION_ID_TAKE_DAMAGE = 1024;

type ActionId = 
    | typeof ACTION_ID_IDLE 
    | typeof ACTION_ID_WALK
    | typeof ACTION_ID_WALK_BACKWARD
    | typeof ACTION_ID_RUN
    | typeof ACTION_ID_JUMP
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
  | ActiveEntity<PartId>
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
  rotation?: ReadonlyVector3,
  anim?: JointAnimation | Falsey,
  animAction?: ActionId | 0,
}

type BaseEntity<PartId extends number = number> = {
  readonly renderGroupId: RenderGroupId,
  readonly collisionRadius: number,
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

  readonly joints?: Record<PartId, Joint>,
  readonly body?: BodyPart<PartId>,
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
  animationTransform?: ReadonlyMatrix4,
  anims?: EntityAnimation[],
};

type PlaneMetadata = {
  readonly textureCoordinateTransform?: ReadonlyMatrix4,
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
  zRotation?: undefined,
} & BaseEntity<PartId>;

type BaseDynamicEntity<PartId extends number = number> = {
  readonly face?: undefined,
  velocity: Vector3,
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
} & BaseEntity<PartId>;

type DynamicEntity<PartId extends number = number> = {
  readonly entityType:
  | EntityTypeFireball
  | EntityTypeParticle
  | EntityTypeScenery
  | EntityTypeExplosion,
} & BaseDynamicEntity<PartId>;

type ActiveEntity<PartId extends number = number> = {
  readonly entityType: 
    | EntityTypeDragon,
  targetLateralPosition?: Vector2 | Vector3;
  maximumLateralVelocity: number,
  maximumLateralAcceleration: number,
} & BaseDynamicEntity<PartId>;
