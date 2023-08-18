type World = Record<number, Grid>;

type GridId = 1;
type Grid = readonly(readonly Tile[])[];

type Tile = Record<EntityId, Entity>;

type RenderGroupId = number;
type EntityId = number;
type Entity = StaticEntity | DynamicEntity;

type ModelId = number;

type BaseEntity<PartId extends number = number> = {
  readonly renderGroupId: RenderGroupId,
  readonly id: EntityId,
  readonly partTransforms?: Record<PartId, ReadonlyMatrix4>,
  readonly body: Part<PartId>,
  position: Vector3,
  // collision and render bounds, whichever is larger
  readonly bounds: ReadonlyRect3,
};

type StaticEntity<PartId extends number = number> = {
  readonly face: Face,
  readonly rotateToPlaneCoordinates: ReadonlyMatrix4,
  readonly worldToPlaneCoordinates: ReadonlyMatrix4,
  // TODO toWorldCoordinates, rotateToWorldCoordinates
} & BaseEntity<PartId>;

type DynamicEntity<PartId extends number = number> = {
  readonly face?: undefined,
  readonly collisionRadius: number,
  velocity: Vector3,
  readonly restitution?: number,
  readonly gravity?: number,
} & BaseEntity<PartId>;

type Part<PartId extends number = number> = {
  readonly id: PartId,
  readonly modelId?: ModelId,
  readonly centerOffset: ReadonlyVector3,
  readonly centerRadius: number,
  readonly renderTransform: ReadonlyMatrix4,
};
