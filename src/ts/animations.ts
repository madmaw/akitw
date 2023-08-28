type Easing = (t: number) => number;

const EASING_BOUNCE: Easing = t => Math.sin(Math.pow(t, 2) * Math.PI*2) * (1 - Math.pow(t, 2));
const EASING_BACK_IN: Easing = t => t * t * (9 * t - 8);
const EASING_EASE_IN: Easing = t => t * t;

function createAttributeAnimation<E, K extends keyof E, V extends E[K]>(
  duration: number,
  attribute: K,
  easing: Easing,
  update: (progress: number, e: E) => V,
  onComplete?: (e: E) => void,
) {
  let total = 0;
  return (e: E, delta: number): Booleanish => {
    total += delta;
    const progress = easing(Math.min(1, total/duration));
    const value = update(progress, e);
    e[attribute] = value;
    const result = total >= duration;
    if (result) {
      onComplete?.(e);
    }
    return result;
  }
}

function createEntityMatrixUpdate(transformAnimation: (p: number) => ReadonlyMatrix4) {
  return (progress: number, e: Entity) => {
    return matrix4Multiply(
      e.animationTransform,
      transformAnimation(progress),
    );
  }
}