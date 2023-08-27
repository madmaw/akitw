const ENTITY_TYPE_DRAGON = 1;
const ENTITY_TYPE_SCENERY = 2;
const ENTITY_TYPE_FIREBALL = 3;
const ENTITY_TYPE_PARTICLE = 4;
const ENTITY_TYPE_TERRAIN = 5;

type EntityType =
  | typeof ENTITY_TYPE_DRAGON
  | typeof ENTITY_TYPE_SCENERY
  | typeof ENTITY_TYPE_FIREBALL
  | typeof ENTITY_TYPE_PARTICLE
  | typeof ENTITY_TYPE_TERRAIN
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

type BaseEntity = {
  readonly entityType: EntityType,
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
};

type PlaneMetadata = {
  readonly textureCoordinateTransform?: ReadonlyMatrix4,
};

type StaticEntity = {
  readonly face: Face<PlaneMetadata>,
  readonly rotateToPlaneCoordinates: ReadonlyMatrix4,
  readonly worldToPlaneCoordinates: ReadonlyMatrix4,
  // TODO toWorldCoordinates, rotateToWorldCoordinates
  // only render if is in this tile
  readonly renderTile?: Tile,
  velocity?: undefined,
  xRotation?: undefined,
  zRotation?: undefined,
} & BaseEntity;

type DynamicEntity = {
  readonly face?: undefined,
  velocity: Vector3,
  xRotation?: number,
  zRotation?: number,
  readonly restitution?: number,
  readonly gravity?: number,
  readonly renderTile?: undefined,
  readonly inverseMass?: number,
  
} & BaseEntity;

