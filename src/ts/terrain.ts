type Terrain = (x: number, y: number) => number;

function weightedAverageTerrainFactory(
  depths: number[][],
): Terrain {
  return function(wx: number, wy: number) {
    const tx = wx * DEPTH_DIMENSION;
    const ty = wy * DEPTH_DIMENSION;
    const dcx = wx * 2 - 1;
    const dcy = wy * 2 - 1;
    //const sampleRadius = worldSampleRadius * DEPTH_DIMENSION;
    const sampleRadius = 3;
    const sampleRadiusSquared = sampleRadius * sampleRadius;
    const roundedSampleRadius = sampleRadius | 0;
    let totalWeight = 0;
    let totalWeightedDepth = 0;

    //const sharpness = Math.max(0, depths[tx | 0][ty | 0]/9);
    const sharpness = Math.pow(1 - (dcx * dcx + dcy * dcy), 4) * 3;

    for (let x = tx - roundedSampleRadius | 0; x < tx + sampleRadius; x++) {
      for (let y = ty - roundedSampleRadius | 0; y < ty + sampleRadius; y++) {
        const dx = tx - x;
        const dy = ty - y;
        const distanceSquared = dx * dx + dy * dy;
        
        if (sampleRadiusSquared > distanceSquared) {
          const sharpWeight = Math.pow(1 - Math.sqrt(distanceSquared)/sampleRadius, sharpness);
          const smoothWeight = Math.cos((Math.sqrt(distanceSquared)/sampleRadius) * Math.PI/2);
          const weight = sharpWeight * Math.min(1, sharpness) + smoothWeight * Math.max(0, 1 - sharpness);

          const depth = x < 0
            || y < 0
            || x >= DEPTH_DIMENSION
            || y >= DEPTH_DIMENSION
            ? -2
            : depths[x][y];
          totalWeightedDepth += weight * depth;
          totalWeight += weight;
        }
    }
    }
    return totalWeight > 0
      ? totalWeightedDepth/totalWeight * WORLD_DEPTH_SCALE
      : 0;
  };
}