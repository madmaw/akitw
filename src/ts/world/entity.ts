let nextEntityId = 1;
let nextRenderGroupId = 1;

function iterateEntityBounds(
  grid: Grid,
  { position, bounds: [[minx, miny], [maxx, maxy]] }: Pick<Entity, 'position' | 'bounds'>,
  f: (tile: Tile, x: number, y: number) => void,
) {
  const [px, py] = position;
  for (
    let x = Math.max(0, px + minx | 0);
    // TODO can replace .length with constant
    x <= Math.min(grid.length - 1, px + maxx);
    x++
  ) {
    const gridX = grid[x];
    for (
      let y = Math.max(0, py + miny | 0);
      // TODO can replace .length with constant
      y <= Math.min(gridX.length - 1, py + maxy);
      y++
    ) {
      f(gridX[y], x, y);
    }
  }
}

function addEntity(grid: Grid, entity: Entity) {
  iterateEntityBounds(grid, entity, tile => {
    tile[entity.id] = entity;
  });
}

function removeEntity(grid: Grid, entity: Entity) {
  iterateEntityBounds(grid, entity, tile => {
    delete tile[entity.id];
  });
}