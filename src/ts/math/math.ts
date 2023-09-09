// const mathAngleDiff = (a: number, b: number) => mathSafeMod(b - a + Math.PI, Math.PI * 2) - Math.PI;

// const mathSafeMod = (a: number, n: number) => a - Math.floor(a/n) * n;

function mathAngleDiff(a: number, b: number){
  const c = b - a + Math.PI;
  const d = Math.PI * 2;
  return c - Math.floor(c/d)* d - Math.PI;
}