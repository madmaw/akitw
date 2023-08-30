const NORMAL_X: ReadonlyVector3 = [1, 0, 0];
const NORMAL_Y: ReadonlyVector3 = [0, 1, 0];
const NORMAL_Z: ReadonlyVector3 = [0, 0, 1];


const EPSILON = .0001;
const DEFAULT_GRAVITY = .00001;


const RESOLUTIONS = 8;
const WORLD_DIMENSION = Math.pow(2, RESOLUTIONS);

const DEPTH_RESOLUTIONS = 6;
const DEPTH_DIMENSION = Math.pow(2, DEPTH_RESOLUTIONS);
const WORLD_DEPTH_SCALE = WORLD_DIMENSION/DEPTH_DIMENSION;

const MIN_FOCAL_LENGTH = .1;
const HORIZON = WORLD_DIMENSION * 9;
const MAX_FOG_DEPTH = HORIZON/2;
const SKY_LOW: ReadonlyVector3 = [.5, .8, 1];
const SKY_HIGH: ReadonlyVector3 = [0, .6, .9];
const WATER: ReadonlyVector3 = [.0, .1, .3];
const SHORE: ReadonlyVector3 = [.1, .5, .5];

const MAX_COLLISION_STEPS = 9;
const MAX_COLLISIONS = 8;

//const MATERIAL_TERRAIN_TEXTURE_DIMENSION = 2048;
const MATERIAL_TERRAIN_TEXTURE_DIMENSION = 1024;
const MATERIAL_SYMBOL_TEXTURE_DIMENSION = 256;
const MATERIAL_TERRAIN_DEPTH_RANGE = .2;

const MAX_TREE_HEIGHT = 4;