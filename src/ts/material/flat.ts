function flatMaterial(ctx: CanvasRenderingContext2D, y: number) {
  ctx.fillStyle = 'rgba(127,127,127,.5)';
  ctx.fillRect(0, y, MATERIAL_TERRAIN_TEXTURE_DIMENSION, MATERIAL_TERRAIN_TEXTURE_DIMENSION);
}