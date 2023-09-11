const ENVIRONMENT: 'test' | 'small' | 'ultra' = 'test' as any;

const FLAG_SHOW_GL_ERRORS = ENVIRONMENT == 'test';
const FLAG_SHOW_FPS = ENVIRONMENT == 'test';
const FLAG_DEBUG_SHORTENED_METHODS = ENVIRONMENT == 'test' && false;
const FLAG_QUICK_COLLISIONS = ENVIRONMENT != 'ultra';
const FLAG_CHECK_STARTS_OVERLAPPING = ENVIRONMENT == 'test';
const FLAG_LOW_POLY_TERRAIN = true;
const FLAG_SHRINK_FACES = false;
const FLAG_DEBUG_PHYSICS = ENVIRONMENT == 'test' && false;
const FLAG_FAST_READ_CANVASES = ENVIRONMENT != 'ultra';
const FLAG_CLOUDS = true || ENVIRONMENT != 'ultra';
const FLAG_ENFORCE_BOUNDARY = false;
const FLAG_SHORT_GLSL_VARIABLE_NAMES = ENVIRONMENT != 'test' || true;
const FLAG_UNPACK_CHECK_ORIGINALS = ENVIRONMENT == 'test';
const FLAG_UNPACK_USE_ORIGINALS = ENVIRONMENT == 'test';
// doesn't seem to help, also CC bugs out on the animation unpacker for some reason
const FLAG_UNPACK_ANIMATIONS = false;
const FLAG_CLEAR_COLOR = false;
const FLAG_PREVENT_DEFAULT = ENVIRONMENT != 'ultra';
const FLAG_PREVENT_DEFAULT_ON_MOUSE = ENVIRONMENT != 'ultra';
const FLAG_ALLOW_ZOOM = false && ENVIRONMENT == 'test';
const FLAG_REPOPULATE = true;
const FLAG_SLOW_HEAD_TURN = true || ENVIRONMENT != 'ultra';
const FLAG_SLOW_CAMERA = true;
const FLAG_EXPLICIT_TEXT_BASELINE = false;
const FLAG_HARD_CODE_CONSTANTS = true;
const FLAG_USE_PI = false;