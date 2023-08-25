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

type BaseEntity<PartId extends number = number> = {
  readonly renderGroupId: RenderGroupId,
  readonly id: EntityId,
  readonly partTransforms?: Record<PartId, ReadonlyMatrix4>,
  // all the resolutions that this entity renders in
  // to the bodies that we will render those in 
  readonly resolutionBodies: Record<number, Part<PartId>>;
  position: Vector3,
  // collision and render bounds, whichever is larger
  readonly bounds: ReadonlyRect3,
  logs?: any[][];
};

type PlaneMetadata = {
  readonly textureCoordinateTransform?: ReadonlyMatrix4,
};

type StaticEntity<PartId extends number = number> = {
  readonly face: Face<PlaneMetadata>,
  readonly rotateToPlaneCoordinates: ReadonlyMatrix4,
  readonly worldToPlaneCoordinates: ReadonlyMatrix4,
  // TODO toWorldCoordinates, rotateToWorldCoordinates
  // only render if is in this tile
  readonly renderTile?: Tile,

} & BaseEntity<PartId>;

type DynamicEntity<PartId extends number = number> = {
  readonly face?: undefined,
  readonly collisionRadius: number,
  velocity: Vector3,
  readonly restitution?: number,
  readonly gravity?: number,
  readonly renderTile?: undefined,
} & BaseEntity<PartId>;

type Part<PartId extends number = number> = {
  readonly id: PartId,
  readonly modelId?: ModelId,
  readonly centerOffset: ReadonlyVector3,
  readonly centerRadius: number,
  readonly renderTransform: ReadonlyMatrix4,
  // reference to textures/colours/etc...
  variant: VariantId;
  // the index of the atlas to use
  atlasIndex?: number,
};
