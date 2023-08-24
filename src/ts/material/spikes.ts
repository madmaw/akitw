
function spikeFeatureFactory(
  minDepthScale: number,
  dDepthScale: number,
): FeatureFactory {
  return function (r: number, z: number) {
    const d = (minDepthScale + dDepthScale * Math.random()) * r;
    const axy = Math.atan2(d, r);
    const cosaxy = Math.cos(axy);
    const sinaxy = Math.sin(axy);
    const color = Math.random() * 127 | 0;
    return function (dx: number, dy: number, c: number, existingDepth: number) {
      const dxysq = dx * dx + dy * dy;
      if (dxysq < r * r) {
        const depth = (1 - Math.sqrt(dxysq)/r) * d;
        const depthValue = z + depth / (MATERIAL_DEPTH_RANGE * 2);
        if (depthValue >= existingDepth) {
          const az = Math.atan2(dy, dx);
          const [nx, ny] = vectorNNormalize(
            [
                Math.cos(az) * sinaxy,
                Math.sin(az) * sinaxy,
                cosaxy,
            ],
          );

          return [
            (nx + 1) * 127 | 0,
            (ny + 1) * 127 | 0,
            depthValue | 0,
            127 + color
          ];
        }
      }
    };
  };
}