
function staticFeature(): Feature {
  const color = Math.random() * 127 + 127;
  return function (dx: number, dy: number, c: number, existingDepth: number) {
    return [
      128,
      128,
      existingDepth,
      color
    ];
  };
}