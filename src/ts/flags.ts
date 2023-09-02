const ENVIRONMENT: 'test' | 'small' | 'ultra' = 'test' as any;

const FLAG_SHOW_GL_ERRORS = ENVIRONMENT == 'test';
const FLAG_SHOW_FPS = ENVIRONMENT == 'test';
const FLAG_DEBUG_SHORTENED_METHODS = ENVIRONMENT == 'test';
const FLAG_QUICK_COLLISIONS = ENVIRONMENT != 'ultra';
const FLAG_CHECK_STARTS_OVERLAPPING = ENVIRONMENT == 'test';
const FLAG_LOW_POLY_TERRAIN = true;
const FLAG_SAFE_UNROTATED_VELOCITY = true;
const FLAG_SHRINK_FACES = false;
const FLAG_DEBUG_PHYSICS = ENVIRONMENT == 'test';
const FLAG_FAST_READ_CANVASES = ENVIRONMENT != 'ultra';
const FLAG_STONEY_SLOPES = ENVIRONMENT != 'test';
const FLAG_CLOUDS = ENVIRONMENT != 'ultra';
const FLAG_ENFORCE_BOUNDARY = true;
const FLAG_SHORT_GLSL_VARIABLE_NAMES = true;
