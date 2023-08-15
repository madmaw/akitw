type World = Record<number, Grid>;

type GridId = 1;
type Grid = readonly(readonly Tile[])[];

type Tile = Record<EntityId, Entity>;

type RenderGroupId = number;
type EntityId = number;
type Entity = StaticEntity | DynamicEntity;

type ModelId = number;

type BaseEntity = {
  readonly renderGroupId: RenderGroupId,
  readonly id: EntityId,
  readonly body: Part,
  position: Vector3,
  // collision and render bounds, whichever is larger
  readonly bounds: ReadonlyRect3,
};

type StaticEntity = {
  readonly face: Face,
  readonly rotateToPlaneCoordinates: ReadonlyMatrix4,
  readonly worldToPlaneCoordinates: ReadonlyMatrix4,
  // TODO toWorldCoordinates, rotateToWorldCoordinates
} & BaseEntity;

type DynamicEntity = {
  readonly face?: undefined,
  readonly collisionRadius: number,
  velocity: Vector3,
} & BaseEntity;

type Part = {
  readonly modelId: ModelId,
  readonly centerOffset: ReadonlyVector3,
  readonly centerRadius: number,
  readonly renderTransform: ReadonlyMatrix4,
};
