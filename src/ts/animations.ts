type Easing = (t: number) => number;

function EASING_BOUNCE(t: number) {
  return Math.sin(Math.pow(t, 2) * PI_2_0DP) * (1 - Math.pow(t, 2));
}
function EASING_BACK_IN (t) {
  return t * t * (9 * t - 8);
}
const EASING_QUAD_IN: Easing = t => t * t;
const EASING_QUAD_OUT: Easing = t => 1 - Math.pow(1 - t, 2);
const EASING_QUAD_IN_OUT: Easing = t => t <= .5 ? t * t * 2 : 1 - Math.pow(t-1, 2) * 2;
const EASING_LINEAR: Easing = t => t;
const EASING_SINUSOIDAL: Easing = t => Math.sin(t*PI_1_0DP);

const EASINGS = [
  EASING_BOUNCE,
  EASING_BACK_IN,
  EASING_QUAD_IN,
  EASING_QUAD_OUT,
  EASING_QUAD_IN_OUT,
  EASING_LINEAR,
  EASING_SINUSOIDAL,
];

type Anim<T> = (e: T, delta: number) => Booleanish;

function createAttributeAnimation<E, K extends keyof E>(
  duration: number,
  attribute: K,
  easing: Easing,
  update: (progress: number, v: E[K]) => E[K],
  onComplete?: (e: E) => void,
): Anim<E> {
  let total = 0;
  return (e: E, delta: number): Booleanish => {
    total += delta;
    const t = duration > 0
      ? Math.min(1, total/duration)
      : Math.abs(((total/-duration) % 2) - 1);
    const progress = easing(t);
    const oldValue = e[attribute];
    const value = update(progress, oldValue);
    e[attribute] = value;
    const result = total > duration && duration > 0;
    if (result) {
      onComplete?.(e);
    }
    return result;
  }
}

function createMatrixUpdate(transformAnimation: (p: number) => ReadonlyMatrix4) {
  return (progress: number, previousValue: ReadonlyMatrix4) => {
    return matrix4Multiply(
      previousValue,
      transformAnimation(progress),
    );
  }
}

function createVectorLerpUpdate(to: ReadonlyVector3, wrapAngles?: Booleanish) {
  let initialValue: ReadonlyVector3 | undefined;
  let delta: ReadonlyVector3 | undefined;
  return (progress: number, previousValue: ReadonlyVector3): ReadonlyVector3 => {
    if (!initialValue) {
      initialValue = previousValue || [0, 0, 0];
      delta = initialValue.map((v, i) => {
        return wrapAngles
          ? mathAngleDiff(v, to[i])
          : to[i] - v;
      }) as any;
    }

    return vectorNScaleThenAdd(initialValue, delta, progress);
  };
}

function createCompositeAnimation<E>(
  ...anims: Anim<E>[]
): Anim<E> {
  let currentAnim: Anim<E> | Falsey;
  return (e: E, delta: number) => {
    if (!currentAnim) {
      currentAnim = anims.shift();
    }
    if (!currentAnim || currentAnim(e, delta)) {
      currentAnim = 0;
      return !anims.length;
    }
  };
}
