type Terrain = (x: number, y: number) => number;

function weightedAverageTerrainFactory(
  depths: number[][],
  sampleRadius: number,
  randomness: number,
): Terrain {
  // TODO can be a constant
  const width = depths.length;
  const height = depths[0].length;
  const randomBits: number[][] = create2DArray(
    width,
    height, 
    () => {
      return Math.random() * randomness;
    },
  );
  return function(wx: number, wy: number) {
    const tx = wx * width;
    const ty = wy * height;
    const sampleRadiusSquared = sampleRadius * sampleRadius;
    let totalWeight = 0;
    let totalWeightedDepth = 0;

    for (let x = tx - sampleRadius | 0; x < tx + sampleRadius; x++) {
      for (let y = ty - sampleRadius | 0; y < ty + sampleRadius; y++) {
        const dx = tx - x;
        const dy = ty - y;
        const distanceSquared = dx * dx + dy * dy;
        if (
          x >= 0
          && y >= 0
          && x < width
          && y < height
          && sampleRadiusSquared > distanceSquared
        ) {
          const randomDepth = randomBits[x][y];
          const depth = depths[x][y] + randomDepth;
          const weight = Math.pow(1 - Math.sqrt(distanceSquared)/Math.sqrt(sampleRadiusSquared), 2);
          totalWeightedDepth += weight * depth;
          totalWeight += weight;
        }
      }
    }
    return totalWeight > 0
      ? totalWeightedDepth/totalWeight * 4
      : 0;
  };
}