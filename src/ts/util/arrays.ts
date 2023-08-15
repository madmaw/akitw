function transpose2DArray<T>(a: readonly (readonly T[])[]): T[][] {
  return create2DArray(a[0].length, a.length, (x, y) => a[y][x]);
}

function create2DArray<T>(
  width: number,
  height: number,
  f: (x: number, y: number) => T,
): T[][] {
  return new Array(width).fill(0).map((_, x) => {
    return new Array(height).fill(0).map((_, y) => f(x, y));
  });
}