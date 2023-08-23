function riverStonesFeatureFactory(
  depthScale: number,
): FeatureFactory {
  return function(r: number, z: number): Feature {
    const c = Math.random() * 127;
    return function(dx: number, dy: number, _: number, existingDepth: number) {
      const stoneDepth = r * depthScale;
      const dzsq = r * r - dx * dx - dy * dy;
      if (dzsq > 0) {
        const dz = Math.sqrt(dzsq);
        const depth = Math.min(stoneDepth, dz);
        const depthValue = z + depth / (MATERIAL_DEPTH_RANGE * 2);
        if (depthValue > existingDepth) {
          const [nx, ny] = dz < stoneDepth ? vectorNNormalize([dx, dy, dz]) : [0, 0];
          return [
            (nx + 1) * 127 | 0,
            (ny + 1) * 127 | 0,
            depthValue | 0,
            127 + c | 0
          ];  
        }
      }
    };
  };
}