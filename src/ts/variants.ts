type VariantId = 
  | typeof VARIANT_NULL
  | typeof VARIANT_TERRAIN
  | typeof VARIANT_SYMBOLS
  ;

const VARIANT_NULL = 0;
const VARIANT_TERRAIN = 1;
const VARIANT_SYMBOLS = 2;

type Variant = {
  atlasTextureId: AtlusTextureId,
  materialTextureId: MaterialTextureId,
  materialTextureColors: readonly number[],
  materialTextureScale?: number,
  materialDepth?: number,
}

const TERRAIN_COLORS: readonly number[] = [
  // sand
  .8, .7, .5, 1,
  .8, .8, .7, 1,
  // grass
  .3, .7, .2, 1,
  .2, .6, .4, .2,
  // stone
  .1, .1, .1, 1,
  .2, .1, .1, 1,
];

const VARIANTS: Record<VariantId, Variant> = {
  [VARIANT_NULL]: {
    atlasTextureId: TEXTURE_EMPTY_MAP_MIPMAP,
    materialTextureId: TEXTURE_EMPTY_ARRAY,
    materialTextureColors: [
      // red
      1, 0, 0, 1,
      1, 0, 0, 1,
      // green
      0, 1, 0, 1,
      0, 1, 0, 1,
      // blue
      0, 0, 1, 1,
      0, 0, 1, 1,
    ],
  },
  [VARIANT_TERRAIN]: {
    atlasTextureId: TEXTURE_WORLD_MAP_MIPMAP,
    materialTextureId: TEXTURE_TERRAIN,
    materialTextureScale: WORLD_DIMENSION,
    materialTextureColors: TERRAIN_COLORS,
    materialDepth: MATERIAL_TERRAIN_DEPTH_RANGE,
  },
  [VARIANT_SYMBOLS]: {
    atlasTextureId: TEXTURE_SYMBOL_MAP_MIPMAP,
    materialTextureId: TEXTURE_EMPTY_ARRAY,
    materialTextureColors: [
      // red
      1, 0, 0, .7,
      1, 0, 0, .7,
      // green
      0, 1, 0, .7,
      0, 1, 0, .7,
      // blue
      0, 0, 1, .7,
      0, 0, 1, .7,
    ],
  },
}
