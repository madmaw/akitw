const KEY_SHIFT = 16;
const KEY_CAPS_LOCK = 20;
const KEY_SPACE = 32;
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_A = 65;
const KEY_C = 67;
const KEY_D = 68;
const KEY_E = 69;
const KEY_F = 70;
const KEY_G = 71;
const KEY_I = 73;
const KEY_J = 74;
const KEY_K = 75;
const KEY_M = 77;
const KEY_Q = 81;
const KEY_S = 83;
const KEY_W = 87;
const KEY_X = 88;
const KEY_Y = 89;
const KEY_Z = 90;
const KEY_LESS_THAN = 188;
const KEY_GREATER_THAN = 190;
const KEY_SYNTHETIC_LEFT_MOUSE_BUTTON = 1;

type KeyCode =
    | typeof KEY_SHIFT
    | typeof KEY_CAPS_LOCK
    | typeof KEY_SPACE
    | typeof KEY_LEFT
    | typeof KEY_UP
    | typeof KEY_RIGHT
    | typeof KEY_DOWN
    | typeof KEY_A
    | typeof KEY_C
    | typeof KEY_D
    | typeof KEY_E
    | typeof KEY_F
    | typeof KEY_G
    | typeof KEY_J
    | typeof KEY_K
    | typeof KEY_M
    | typeof KEY_I
    | typeof KEY_Q
    | typeof KEY_S
    | typeof KEY_W
    | typeof KEY_X
    | typeof KEY_Y
    | typeof KEY_Z
    | typeof KEY_LESS_THAN
    | typeof KEY_GREATER_THAN
    | typeof KEY_SYNTHETIC_LEFT_MOUSE_BUTTON
    ;

const INPUT_LEFT = KEY_A;
const INPUT_RIGHT = KEY_D;
const INPUT_UP = KEY_W;
const INPUT_DOWN = KEY_S;
const INPUT_WALK = KEY_SHIFT;
const INPUT_JUMP = KEY_SPACE;
const INPUT_FIRE = KEY_SYNTHETIC_LEFT_MOUSE_BUTTON;

type Input = 
    | typeof INPUT_LEFT
    | typeof INPUT_RIGHT
    | typeof INPUT_UP
    | typeof INPUT_DOWN
    | typeof INPUT_WALK
    | typeof INPUT_JUMP
    | typeof INPUT_FIRE
    ;

const CARDINAL_INPUT_VECTORS: readonly [Input, ReadonlyVector2, number?][] = [
  [INPUT_LEFT, [-1, 0]],
  [INPUT_RIGHT, [1, 0]],
  [INPUT_UP, [0, 1], 1],
  [INPUT_DOWN, [0, -1]],
];

type InputValue = {
  isRead?: Booleanish,
  value: number,
};
const keyStates: Partial<Record<KeyCode, InputValue>> = {};

function readInput(input: Input, peeking?: Booleanish): number {
  const value = keyStates[input] || { value: 0 };
  keyStates[input] = value;
  if (!peeking) {
    value.isRead = 1;
  }
  return value.value;
}

function setKeyState(keyCode: KeyCode, value: number) {
  if (!keyStates[keyCode]?.value || !value) {
    keyStates[keyCode] = {
      value,
    };  
  }
}

function someInputUnread(input: Input) {
  return !keyStates[input]?.isRead;
}

