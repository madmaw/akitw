const U_WORLD_POSITION = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'a' : 'uWorldPosition';
const U_WORLD_ROTATION_MATRIX = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'b' : 'uWorldRotation';
const U_PROJECTION_MATRIX = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'c' : 'uProjection';
const U_CAMERA_POSITION = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'd' : 'uCameraPosition';
const U_FOCUS_POSITION = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'e' : 'uFocusPosition';
const U_MATERIAL_ATLAS = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'f' : 'uMaterialAtlas';
const U_MATERIAL_TEXTURE = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'g' : 'uMaterialTexture';
const U_MATERIAL_COLORS = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'h' : 'uMaterialColors';
const U_TIME = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'i' : 'uTime';
const U_ATLAS_TEXTURE_INDEX_AND_MATERIAL_TEXTURE_SCALE_AND_DEPTH = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'j' : 'uAtlasTextureIndex';
const U_SHADOWS = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'k' : 'uShadows';

const A_VERTEX_MODEL_POSITION = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'z' : "aVertexModelPosition";
const A_VERTEX_MODEL_ROTATION_MATRIX = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'y' : 'aVertexModelRotation';
const A_VERTEX_MODEL_SMOOTHING_ROTATION_MATRIX = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'x' : 'aVertexModelSmoothingRotation';
const A_MODEL_ATLAS_TEXTURE_POSITION_MATRIX = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'w' : 'aModelTexturePosition';

const V_MODEL_POSITION = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'Z' : 'vModelPosition';
const V_WORLD_POSITION = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'Y' : 'vWorldPosition';
const V_MODEL_ROTATION_MATRIX = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'X' : 'vModelRotation';
const V_MODEL_SMOOTHING_ROTATION_MATRIX = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'W' : 'vModelSmoothingRotation';
const V_INVERSE_MODEL_SMOOTHING_ROTATION_MATRIX = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'V' : 'vInverseModelSmoothingRotation';
const V_WORLD_PLANE_NORMAL = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'U' : 'vWorldPlaneNormal';
const V_WORLD_ATLAS_TEXTURE_POSITION_MATRIX = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'T' : 'vWorldTexturePosition';

const O_COLOR = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'S' : "oColor";

const VERTEX_SHADER = `#version 300 es
  precision lowp float;

  in vec4 ${A_VERTEX_MODEL_POSITION};
  in mat4 ${A_VERTEX_MODEL_ROTATION_MATRIX};
  in mat4 ${A_VERTEX_MODEL_SMOOTHING_ROTATION_MATRIX};
  in mat4 ${A_MODEL_ATLAS_TEXTURE_POSITION_MATRIX};

  uniform vec4 ${U_WORLD_POSITION};
  uniform mat4 ${U_WORLD_ROTATION_MATRIX};
  uniform mat4 ${U_PROJECTION_MATRIX};
  
  out vec4 ${V_WORLD_POSITION};
  out mat4 ${V_WORLD_ATLAS_TEXTURE_POSITION_MATRIX};
  out vec4 ${V_MODEL_POSITION};
  out mat4 ${V_MODEL_ROTATION_MATRIX};
  out mat4 ${V_MODEL_SMOOTHING_ROTATION_MATRIX};
  out mat4 ${V_INVERSE_MODEL_SMOOTHING_ROTATION_MATRIX};
  out vec4 ${V_WORLD_PLANE_NORMAL};

  void main(void) {
    ${V_MODEL_POSITION} = ${A_VERTEX_MODEL_POSITION};
    ${V_WORLD_ATLAS_TEXTURE_POSITION_MATRIX} = ${A_MODEL_ATLAS_TEXTURE_POSITION_MATRIX} * inverse(${U_WORLD_ROTATION_MATRIX});
    ${V_WORLD_POSITION} = ${U_WORLD_POSITION} + ${U_WORLD_ROTATION_MATRIX} * ${A_VERTEX_MODEL_POSITION};
    ${V_MODEL_ROTATION_MATRIX} = ${A_VERTEX_MODEL_ROTATION_MATRIX};
    ${V_WORLD_PLANE_NORMAL} = ${U_WORLD_ROTATION_MATRIX} * ${V_MODEL_ROTATION_MATRIX} * vec4(0,0,1,1);
    
    ${V_MODEL_SMOOTHING_ROTATION_MATRIX} = ${A_VERTEX_MODEL_SMOOTHING_ROTATION_MATRIX};
    ${V_INVERSE_MODEL_SMOOTHING_ROTATION_MATRIX} = inverse(${V_MODEL_SMOOTHING_ROTATION_MATRIX});

    gl_Position = ${U_PROJECTION_MATRIX} * ${V_WORLD_POSITION};
  }
`;

const STEP = .01;
//const NUM_STEPS = MATERIAL_DEPTH_RANGE/STEP | 0;
//const MATERIAL_DEPTH_SCALE = (256/(MATERIAL_TEXTURE_DIMENSION * MATERIAL_DEPTH_RANGE)).toFixed(1);
//const MATERIAL_DEPTH_SCALE = (1/MATERIAL_DEPTH_RANGE).toFixed(1);
//const MATERIAL_DEPTH_SCALE = (MATERIAL_DEPTH_RANGE/2).toFixed(1);
const MAX_MATERIAL_TEXTURE_COUNT = 3;
const MAX_SHADOWS = 9;

const L_MAX_DEPTH = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'A' : 'maxDepth';
const L_CAMERA_DELTA = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'B' : 'cameraDistance';
const L_SURFACE_CAMERA_DIRECTION = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'C' : 'surfaceCameraDirection';
const L_SURFACE_SCALING = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'D' : 'surfaceScaling';
const L_MAX_PIXEL = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'E' : 'maxPixel';
const L_MAX_COLOR = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'F' : 'maxColor';
const L_MATERIALNESS = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'G' : 'materialness';
const L_TEXTURE_INDEX = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'H' : 'textureIndex';
const L_BASE_COLOR = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'I' : 'baseColor';
const L_DEPTH_ADJUST = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'J' : 'depthAdjust';
const L_DEPTH = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'K' : 'depth';
const L_MAX_STEP_COUNT = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'L' : 'maxStepCount';
const L_STEP_COUNT = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'M' : 'stepCount';
const L_SURFACE_DEPTH = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'N' : 'surfaceDepth';
const L_DIVISOR = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'O' : 'divisor';
const L_WATERINESS = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'P' : 'wateriness';
const L_WATER_DISTANCE = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'Q' : 'waterDistance';
const L_LIGHTING = FLAG_SHORT_GLSL_VARIABLE_NAMES ? 'R' : 'lighting';

const FRAGMENT_SHADER = `#version 300 es
  precision lowp float;

  in mat4 ${V_WORLD_ATLAS_TEXTURE_POSITION_MATRIX};
  in vec4 ${V_WORLD_POSITION};
  in vec4 ${V_MODEL_POSITION};
  in mat4 ${V_MODEL_ROTATION_MATRIX};
  in mat4 ${V_MODEL_SMOOTHING_ROTATION_MATRIX};
  in mat4 ${V_INVERSE_MODEL_SMOOTHING_ROTATION_MATRIX};
  in vec4 ${V_WORLD_PLANE_NORMAL};

  uniform mat4 ${U_WORLD_ROTATION_MATRIX};
  uniform vec3 ${U_CAMERA_POSITION};
  uniform vec4 ${U_WORLD_POSITION};
  uniform vec3 ${U_FOCUS_POSITION};
  uniform lowp sampler2DArray ${U_MATERIAL_ATLAS};
  uniform lowp sampler2DArray ${U_MATERIAL_TEXTURE};
  uniform vec4 ${U_MATERIAL_COLORS}[${MAX_MATERIAL_TEXTURE_COUNT * 2}];
  uniform float ${U_TIME};
  uniform vec3 ${U_ATLAS_TEXTURE_INDEX_AND_MATERIAL_TEXTURE_SCALE_AND_DEPTH};
  uniform vec4 ${U_SHADOWS}[${MAX_SHADOWS}];

  out vec4 ${O_COLOR};

  void main(void) {
    vec3 ${L_CAMERA_DELTA} = ${U_CAMERA_POSITION} - ${V_WORLD_POSITION}.xyz;
    vec4 ${L_SURFACE_CAMERA_DIRECTION} = ${V_INVERSE_MODEL_SMOOTHING_ROTATION_MATRIX} * vec4(normalize(${L_CAMERA_DELTA}), 1);
    // NOTE: surface scaling will be positive for camera facing surfaces
    float ${L_SURFACE_SCALING} = dot(${V_WORLD_PLANE_NORMAL}.xyz, ${L_SURFACE_CAMERA_DIRECTION}.xyz);
    float il = max(1. - pow(length(${U_FOCUS_POSITION} - ${V_WORLD_POSITION}.xyz)/4., 2.), 0.);
    float ${L_MAX_DEPTH} = -1.;
    vec4 ${L_MAX_PIXEL};
    vec4 ${L_MAX_COLOR};
    // TODO look up material based on adjusted position
    // TODO probably needs to be another matrix to do this
    vec4 ${L_MATERIALNESS} = texture(
      ${U_MATERIAL_ATLAS},
      vec3((${V_WORLD_ATLAS_TEXTURE_POSITION_MATRIX} * (${V_WORLD_POSITION} - ${U_WORLD_POSITION})).xy, ${U_ATLAS_TEXTURE_INDEX_AND_MATERIAL_TEXTURE_SCALE_AND_DEPTH}.x)
    );
    if (${L_MATERIALNESS}.w < .5) {
      discard;
      return;
    }
    vec4 ${L_BASE_COLOR} = (
      ${U_MATERIAL_COLORS}[0]*${L_MATERIALNESS}.x
        + ${U_MATERIAL_COLORS}[2]*${L_MATERIALNESS}.y
        + ${U_MATERIAL_COLORS}[4]*${L_MATERIALNESS}.z
    )/(${L_MATERIALNESS}.x + ${L_MATERIALNESS}.y + ${L_MATERIALNESS}.z);

    for (
      int ${L_TEXTURE_INDEX}=0;
      ${L_TEXTURE_INDEX} < ${MAX_MATERIAL_TEXTURE_COUNT};
      ${L_TEXTURE_INDEX}++
    ) {
      // material
      vec4 tm;
      float ${L_DEPTH_ADJUST} = ((
        ${L_TEXTURE_INDEX} > 0
          ? ${L_TEXTURE_INDEX} > 1
            ? ${L_MATERIALNESS}.z
            : ${L_MATERIALNESS}.y
          : ${L_MATERIALNESS}.x
        ) - 1.) * ${U_ATLAS_TEXTURE_INDEX_AND_MATERIAL_TEXTURE_SCALE_AND_DEPTH}.z/2.;
      float ${L_DEPTH} = ${U_ATLAS_TEXTURE_INDEX_AND_MATERIAL_TEXTURE_SCALE_AND_DEPTH}.z*il/2.;

      // distances
      vec4 p;
      float ${L_MAX_STEP_COUNT} = ${U_ATLAS_TEXTURE_INDEX_AND_MATERIAL_TEXTURE_SCALE_AND_DEPTH}.z * il/${STEP};
      for (float ${L_STEP_COUNT} = 0.; ${L_STEP_COUNT} <= ${L_MAX_STEP_COUNT}; ${L_STEP_COUNT}++) {
        ${L_DEPTH} -= ${STEP};
        p = vec4(${V_WORLD_POSITION}.xyz + ${L_SURFACE_CAMERA_DIRECTION}.xyz * ${L_DEPTH} / ${L_SURFACE_SCALING}, 1);

        vec4 tm1 = texture(
          ${U_MATERIAL_TEXTURE},
          vec3(
            (${V_WORLD_ATLAS_TEXTURE_POSITION_MATRIX} * (p - ${U_WORLD_POSITION})).xy * ${U_ATLAS_TEXTURE_INDEX_AND_MATERIAL_TEXTURE_SCALE_AND_DEPTH}.y,
            ${L_TEXTURE_INDEX}
          )
        );
  
        float ${L_SURFACE_DEPTH} = (tm1.z - .5) * ${U_ATLAS_TEXTURE_INDEX_AND_MATERIAL_TEXTURE_SCALE_AND_DEPTH}.z/2.;
        if (${L_SURFACE_DEPTH} > ${L_DEPTH}) {
          float d0 = ${L_DEPTH} + ${STEP};
          float s0 = d0 - (tm.z - .5) * ${U_ATLAS_TEXTURE_INDEX_AND_MATERIAL_TEXTURE_SCALE_AND_DEPTH}.z/2.;
          float s1 = d0 - ${L_SURFACE_DEPTH};
          float ${L_DIVISOR} = ${STEP} - s1 + s0;
          // make sure it's not almost parallel, if it is, defer until next iteration
          if (abs(${L_DIVISOR}) > .0) {  
            float si = s0 * ${STEP}/${L_DIVISOR};
            ${L_DEPTH} += ${STEP} - si;
            p = vec4(
              ${V_WORLD_POSITION}.xyz + ${L_SURFACE_CAMERA_DIRECTION}.xyz * (d0 - si) / ${L_SURFACE_SCALING},
              1
            );
            ${L_STEP_COUNT} = ${L_MAX_STEP_COUNT};
          }
        }
        tm = texture(
          ${U_MATERIAL_TEXTURE},
          vec3(
            (${V_WORLD_ATLAS_TEXTURE_POSITION_MATRIX} * (p - ${U_WORLD_POSITION})).xy * ${U_ATLAS_TEXTURE_INDEX_AND_MATERIAL_TEXTURE_SCALE_AND_DEPTH}.y,
            ${L_TEXTURE_INDEX}
          )
        );  
      }

      // TODO depth adjust should be applied before here
      if (${L_DEPTH} + ${L_DEPTH_ADJUST} > ${L_MAX_DEPTH}) {
        ${L_MAX_DEPTH} = ${L_DEPTH} + ${L_DEPTH_ADJUST};
        ${L_MAX_PIXEL} = tm;
        ${L_MAX_COLOR} = mix(
          ${L_BASE_COLOR},
          ${U_MATERIAL_COLORS}[${L_TEXTURE_INDEX}*2+1],
          tm.w * 2. - 1.
        );
      }
    }

    vec2 n = ${L_MAX_PIXEL}.xy * 2. - 1.;
    vec3 m = normalize(
      ${U_WORLD_ROTATION_MATRIX}
        * ${V_MODEL_ROTATION_MATRIX}
        * ${V_MODEL_SMOOTHING_ROTATION_MATRIX}
        * vec4(
          mix(
            vec3(0, 0, 1),
            vec3(n, sqrt(1. - n.x*n.x - n.y*n.y)),
            il
          ),
          1
        )
      ).xyz;
    ${L_BASE_COLOR} = ${L_MAX_COLOR} * il + ${L_BASE_COLOR} * (1. - il);

    vec3 ${L_WATER_DISTANCE} = ${L_CAMERA_DELTA}
      * (1. - max(0., sin(${U_TIME}/1999.)/9.-${V_WORLD_POSITION}.z)/max(${L_CAMERA_DELTA}.z + ${L_MAX_DEPTH}, .1));
    float ${L_WATERINESS} = 1. - pow(1. - clamp(${L_CAMERA_DELTA}.z - ${L_WATER_DISTANCE}.z - ${L_MAX_DEPTH}, 0., 1.), 9.);
    // lighting
    float ${L_LIGHTING} = max(
      .3, 
      // TODO pre normalise
      1. - (1. - dot(m, normalize(vec3(1, 2, 3)))) * ${L_BASE_COLOR}.w
    );
    for (int ii=0; ii<${MAX_SHADOWS}; ii++) {
      vec3 ${L_CAMERA_DELTA} = (${V_WORLD_POSITION} - ${U_SHADOWS}[ii]).xyz;
      ${L_LIGHTING} = min(
        ${L_LIGHTING},
        max(
          0.,
          1. - (clamp(-${L_CAMERA_DELTA}.z/${U_SHADOWS}[ii].w, 0., 1.)
            - pow(length(${L_CAMERA_DELTA}.xy)/${U_SHADOWS}[ii].w, 2.))
        )
      );
    }
    vec3 fc = mix(
      // water
      mix(
        ${L_BASE_COLOR}.xyz * max(${L_LIGHTING}, 1. - ${L_BASE_COLOR}.w),
        mix(vec3(${SHORE.join()}), vec3(${WATER.join()}), pow(min(1., ${L_WATERINESS}), 2.)),
        ${L_WATERINESS}  
      ),
      // fog
      vec3(${SKY_LOW.join()}),
      min(1., length(${L_WATER_DISTANCE})/${MAX_FOG_DEPTH}.) * max(${L_BASE_COLOR}.w, ${L_WATERINESS})
      // 
    );
    ${O_COLOR} = vec4(sqrt(fc), 1);
  }
`;

window.onload = async () => {
  const depths = create2DArray<number>(DEPTH_DIMENSION + 1, DEPTH_DIMENSION + 1, (x, y) => {
    // pin edges to below sea level
    const dx = DEPTH_DIMENSION/2 - x;
    const dy = DEPTH_DIMENSION/2 - y;
    if (Math.abs(dx) == DEPTH_DIMENSION/2 || Math.abs(dy) == DEPTH_DIMENSION/2) {
      return -1;
    }
    const r = Math.sqrt(dx * dx + dy * dy);
    if(r > DEPTH_DIMENSION/2 - 4 && r < DEPTH_DIMENSION/2 - 3) {
      return .2;
    }
  });

  for (let i=0; i<DEPTH_RESOLUTIONS; i++) {
    const chunkDimension = Math.pow(2, DEPTH_RESOLUTIONS - i);
    const chunkCount = DEPTH_DIMENSION / chunkDimension;
     
    for (let chunkX = 0; chunkX < chunkCount; chunkX++) {
      for (let chunkY = 0; chunkY < chunkCount; chunkY++) {
        const x0 = chunkX * chunkDimension;
        const x1 = x0 + chunkDimension/2;
        const x2 = x0 + chunkDimension;
        const y0 = chunkY * chunkDimension;
        const y1 = y0 + chunkDimension/2;
        const y2 = y0 + chunkDimension;
        const toSetFrom: readonly [ReadonlyVector2, ReadonlyVector2[]][] = [
          // mid point from corners
          [[x1, y1], [[x0, y0], [x2, y0], [x2, y2], [x0, y2]]],
          // left edge from adjacent
          [[x0, y1], [[x0, y0], [x1, y1], [x0, y2]]],
          // right edge from adjacent
          [[x2, y1], [[x2, y0], [x1, y1], [x2, y2]]],
          // top edge from adjacent
          [[x1, y0], [[x0, y0], [x1, y1], [x2, y0]]],
          // bottom edge from adjacent
          [[x1, y2], [[x0, y2], [x1, y1], [x2, y2]]],
        ]
        toSetFrom.forEach(([[x, y], from]) => {
          if (depths[x][y] == null) {
            const dx = x - DEPTH_DIMENSION/2;
            const dy = y - DEPTH_DIMENSION/2;
            const averageDepth = from.reduce((acc, [x, y]) => {
              return acc + depths[x][y];
            }, 0)/from.length;
            const dcenterSquared = (dx * dx + dy * dy)*4/(DEPTH_DIMENSION*DEPTH_DIMENSION);
            const inverseRandomness = Math.pow(i, 2+dcenterSquared * 2) * Math.pow(1 / (Math.abs(averageDepth)+1), .5);
            const targetDepth = Math.pow(Math.max(0, 1 - dcenterSquared), 9) * 5;
            
            const rnd = 1 - Math.random() * Math.min(2, 1 + dcenterSquared);
            //const rnd = Math.random();
            const depth = (averageDepth * 2 + targetDepth)/3 + Math.pow(Math.abs(rnd), inverseRandomness) * rnd * 9;
            depths[x][y] = depth;
          }
        })
      }
    }
  }

  const terrain = weightedAverageTerrainFactory(depths);

  function terrainNormal(scaledWorldPoint: ReadonlyVector3 | ReadonlyVector2) {
    const offsets: ReadonlyVector2[] = [
      [-1/WORLD_DIMENSION, 0],
      [.7/WORLD_DIMENSION, -.7/WORLD_DIMENSION],
      [.7/WORLD_DIMENSION, .7/WORLD_DIMENSION]];
    // const offsets: ReadonlyVector2[] = [
    //   [-1/(worldWidth * worldTerrainScale), 0],
    //   [1/(worldWidth * worldTerrainScale), -1/(worldHeight * worldTerrainScale)],
    //   [1/(worldWidth * worldTerrainScale), 1/(worldHeight * worldTerrainScale)],
    // ];
    const [p0, p1, p2] = offsets.map<Vector3>(offset => {
      const point = vectorNScaleThenAdd(offset, scaledWorldPoint);
      
      return [
        ...vectorNScale(point, WORLD_DIMENSION),
        terrain(...point),
      ];
    }) as [Vector3, Vector3, Vector3];
    //const face = toFace(...points);
    //const { rotateToModelCoordinates } = face;
    // could also use cross product
    //return vector3TransformMatrix4(rotateToModelCoordinates, 0, 0, 1);
    return vectorNNormalize(
      vector3CrossProduct(
        vectorNNormalize(vectorNScaleThenAdd(p1, p0, -1)),
        vectorNNormalize(vectorNScaleThenAdd(p2, p0, -1)),
      ),
    );  
  }

  const zones = create2DArray(MATERIAL_TERRAIN_TEXTURE_DIMENSION, MATERIAL_TERRAIN_TEXTURE_DIMENSION, (x, y) => {
    let result =  new Array(9).fill(0) as ZoneTile;
    // set the mountain, road, desert, beach, grassland values based on x and y and normal
    const worldPoint: ReadonlyVector2 = [x/MATERIAL_TERRAIN_TEXTURE_DIMENSION, y/MATERIAL_TERRAIN_TEXTURE_DIMENSION];
    const depth = terrain(...worldPoint);
    const dx = x - MATERIAL_TERRAIN_TEXTURE_DIMENSION/2;
    const dy = y - MATERIAL_TERRAIN_TEXTURE_DIMENSION/2;
    const dc = Math.sqrt(dx *dx + dy * dy);
    const slopeNormal = vectorNDotProduct(
      terrainNormal(worldPoint),
      NORMAL_Z,
    );
    result[BIOME_ROAD] = 1 - Math.abs(MATERIAL_TERRAIN_TEXTURE_DIMENSION*.4 - dc)/2;
    result[BIOME_BEACH] = Math.pow(Math.random(), Math.max(0, depth - .2) * 50);
    result[BIOME_DESERT] = Math.pow(slopeNormal, 9) - Math.pow(Math.random(), Math.max(0, depth - 9)/2);
    result[BIOME_MOUNTAINS] = Math.max(
      // steeper gets rockier
      (1 - Math.pow(slopeNormal, 2)) * Math.pow(Math.random(), .1),
      // as it gets higher, more rocky
      1 - Math.pow(Math.max(0, Math.min(1, (30 - depth)/30)), 2),
    );
    
    result = result.map(v => Math.max(0, v, Math.min(1, v))) as ZoneTile;
    result[BIOME_GRASSLAND] = Math.max(
      // any other boime up until this point reduces grassiness
      Math.pow(1 - Math.max(...result), .5),
      // random patches of grass are ok
      // NOTE: slope normal should never be 0 (vertical)
      Math.pow(Math.random(), 99/slopeNormal),
    );
    return result;
  });
  // populate the zones with active biomes
  ([
    [
      BIOME_TROPICAL,
      9999,
      clusteredDistributionFactory(
        3,
        3,
        3,
        2,
        .3,
        2,
      ),
      (zx, zy, z) => {
        const v = 1 - Math.min(1, Math.abs(z - 1)/.5);
        return Math.pow(zones[zx][zy][BIOME_GRASSLAND] * v, .1);
      }
    ],
    [
      BIOME_BROADLEAF_FOREST,
      9999,
      clusteredDistributionFactory(
        9,
        9,
        4,
        2,
        .1,
        3,
      ),
      (zx, zy, z) => {
        const v = 1 - Math.min(1, Math.abs(z - 4)/3);
        return Math.pow(zones[zx][zy][BIOME_GRASSLAND] * v, .1);
      }
    ],
    [
      BIOME_CONIFEROUS_FOREST,
      9999,
      clusteredDistributionFactory(
        6,
        6,
        2,
        2,
        .1,
        4,
      ),
      (zx, zy, z) => {
        const v = 1 - Math.min(1, Math.abs(z - 6)/3);
        return Math.pow((1 - zones[zx][zy][BIOME_MOUNTAINS]) * v, .1);
      }
    ],
    [
      BIOME_CIVILISATION,
      999,
      clusteredDistributionFactory(
        9,
        9,
        2,
        2,
        .1,
        4,
      ),
      (zx, zy, z) => {
        const v = 1 - Math.min(1, Math.abs(z - 3)/2);
        return Math.pow((zones[zx][zy][BIOME_GRASSLAND]) * v, .1);
      }
    ],

  ] as [Biome, number, Distribution, (x: number, y: number, z: number) => number][]).map(
    ([biome, quantity, distribution, filter]) => {
      new Array(quantity).fill(0).map(() => {
        const [x, y, distributionScale] = distribution(MATERIAL_TERRAIN_TEXTURE_DIMENSION);
        const zx = Math.abs(x | 0)%MATERIAL_TERRAIN_TEXTURE_DIMENSION;
        const zy = Math.abs(y | 0)%MATERIAL_TERRAIN_TEXTURE_DIMENSION;
        const z = terrain(
          zx/MATERIAL_TERRAIN_TEXTURE_DIMENSION,
          zy/MATERIAL_TERRAIN_TEXTURE_DIMENSION,
        );  
        const filterScale = filter(zx, zy, z);
        const scale = filterScale * distributionScale;
        if (scale > 0) {
          zones[zx][zy][biome] = Math.min(1, scale + zones[zx][zy][biome]);
        }
      });
    }
  );
  
  
  function populate([[minx, miny], [maxx, maxy]]: ReadonlyRect2, destructiblesOnly?: Booleanish) {
    for (let tx=minx; tx<maxx; tx++) {
      for (let ty=miny; ty<maxy; ty++) {
        const x = tx + Math.random();
        const y = ty + Math.random();
        const zx = x * MATERIAL_TERRAIN_TEXTURE_DIMENSION/WORLD_DIMENSION | 0;
        const zy = y * MATERIAL_TERRAIN_TEXTURE_DIMENSION/WORLD_DIMENSION | 0
        const biomes = zones[zx][zy];
        const totalBiomeValues = biomes.reduce((acc, v) => acc + v, 0);
        let targetBiomeValue = totalBiomeValues * Math.random();
        let biome = -1;
        while (targetBiomeValue > 0) {
          biome++;
          targetBiomeValue -= biomes[biome];
        }
        const choices = BIOME_LOOKUP_TABLE[biome];
        if (choices.length) {
          const totalChoiceValues = choices.reduce((acc, [v]) => acc + v, 0);
          let targetChoiceValue = totalChoiceValues * Math.random();
          let choiceIndex = -1;
          while (targetChoiceValue > 0) {
            choiceIndex++;
            targetChoiceValue -= choices[choiceIndex][0];
          }
          const [
            _,
            entityPrototype,
            choiceScale,
          ] = choices[choiceIndex];
          if (choiceScale) {
            const biomeScale = biomes[biome];
            const scale = choiceScale * biomeScale;

            const radius = scale/2;
            const resolutions = new Array(Math.min(Math.sqrt(scale * 2) + 2 | 0, RESOLUTIONS - 2))
              .fill(0)
              .map((_, i) => i);

            const bounds = rect3FromRadius(radius);
            const z = terrain(x / WORLD_DIMENSION, y/WORLD_DIMENSION);
            const position: Vector3 = [x, y, z + radius * .8];
            const entity: DynamicEntity = {
              ...entityPrototype as any,
              bounds,
              collisionRadius: radius,
              id: nextEntityId++,
              position,
              renderGroupId: nextRenderGroupId++,
              resolutions,
              velocity: [0, 0, 0],
              modelVariant: VARIANT_SYMBOLS,
              body: {
                modelId: MODEL_ID_BILLBOARD,
              },
              transform: matrix4Scale(scale),
              gravity: entityPrototype.inverseMass ? DEFAULT_GRAVITY : 0,
              xRotation: 0,
              yRotation: 0,
              zRotation: 0,
              maximumLateralVelocity: .01,
              maximumLateralAcceleration: .00002,
              inverseFriction: 0,              
            };
            // don't overlap with anything
            if (
              (entity.health || !destructiblesOnly)
                && biomeScale > .4
                && !iterateEntityBounds(entity).some(t => {
                  for(let entityId in t.entities) {
                    const e = t.entities[entityId];
                    if(!e.face && rectNOverlaps(e.position, e.bounds, position, bounds)) {
                      return 1;
                    }
                  }
                })
            ) {
              addEntity(entity);  
            }
          }
        }
      }
    }
  }
  
  const world: World = new Array(RESOLUTIONS).fill(0).map((_, resolution) => {
    const resolutionDimension = Math.pow(2, RESOLUTIONS - resolution);
    return create2DArray<Tile>(
      resolutionDimension,
      resolutionDimension,
      () => ({
        entities: {},
        // unused?
        resolution,
      }),
    );
  });
  const reversedWorld = [...world].reverse();

  function iterateEntityBounds(
    { 
      resolutions,
      position,
      bounds: [[minx, miny], [maxx, maxy]],
     }: Pick<Entity, 'position' | 'bounds' | 'resolutions'>,
    f?: (tile: Tile, x: number, y: number) => void,
    populate?: Booleanish,
  ) {
    let tiles: Tile[] = [];
    for (let resolution of resolutions) {
      const divisor = Math.pow(2, resolution);
      const resolutionDimension = Math.pow(2, RESOLUTIONS - resolution);
      const [px, py] = position;
      for (
        let x = Math.max(0, (px + minx - EPSILON)/divisor | 0);
        x <= Math.min(resolutionDimension - 1, (px + maxx + EPSILON)/divisor);
        x++
      ) {
        for (
          let y = Math.max(0, (py + miny - EPSILON)/divisor | 0);
          y <= Math.min(resolutionDimension - 1, (py + maxy + EPSILON)/divisor);
          y++
        ) {
          const tile = populate
            ? getAndMaybePopulateTile(x, y, resolution)
            : world[resolution][x][y];
          f?.(tile, x, y);
          tiles.push(tile);
        }
      }  
    }
    return tiles;
  }
  
  function addEntity(entity: Entity, activeTiles?: Set<Tile>) {
    const tiles = iterateEntityBounds(entity);
    if (!entity.transient || !activeTiles || tiles.some(tile => activeTiles.has(tile))) {
      tiles.forEach(tile => {
        tile.entities[entity.id] = entity;
      });
    }
  }
  
  function removeEntity(entity: Entity) {
    iterateEntityBounds(entity, tile => {
      delete tile.entities[entity.id];
    });
  }
  

  const groundPointCache: Record<number, Record<number, ReadonlyVector3>> = {};
  function getAndMaybePopulateTile(tx: number, ty: number, resolution: number): Tile {
    const grid = world[resolution];
    const resolutionScale = Math.pow(2, resolution);
    let tile = grid[tx][ty];
    const gx = tx * resolutionScale;
    const gy = ty * resolutionScale;

    if (!tile.populated) {
      grid[tx][ty] = tile;
      tile.populated = 1;
      // generate terrain
      // create points around the edge at the highest resolution
      const points = [
        [1, 0, gx, gy],
        [0, 1, gx + resolutionScale, gy],
        [-1, 0, gx + resolutionScale, gy + resolutionScale],
        [0, -1, gx, gy + resolutionScale],
      ].map(([dx, dy, sx, sy]) => {
        return new Array(resolutionScale).fill(0).map<Vector3>((_, i) => {
          const x = sx + i * dx;
          const y = sy + i * dy;
          return [
            x,
            y,
            terrain(
              x / WORLD_DIMENSION,
              y / WORLD_DIMENSION,
            )
          ];
        });
      }).flat(1);

      // connect points
      let axisPoint: Vector3;;
      let workingArray: Vector3[];
      if (resolution > 1 || !FLAG_LOW_POLY_TERRAIN) {
        // synthesize a center point
        const cx = gx + resolutionScale/2;
        const cy = gy + resolutionScale/2;
        axisPoint = [cx, cy, terrain(cx / WORLD_DIMENSION, cy / WORLD_DIMENSION)];
        workingArray = points;
      } else {
        const index = resolution ? 1 : (tx+ty)%points.length;
        const cut = points.splice(0, index+1);
        points.push(...cut.slice(0, index));  
        axisPoint = cut[index]
        workingArray = points.slice(0, -1);
      }
      const groundFaces = workingArray.map((point, i) => {
        const nextPoint = points[(i+1)%points.length];
        return toFace<PlaneMetadata>({
          textureCoordinateTransform: matrix4Scale(1/WORLD_DIMENSION),
        }, axisPoint, point, nextPoint);
      });
      const {
        faces,
        bounds,
        id: modelId,
      } = appendModel(
        groundFaces,
        (v, transform) => {
          const uncachedResult = vector3TransformMatrix4(transform, ...v);
          // z is always the same for a given x/y
          const [x, y] = uncachedResult;
          const ix = x + .1 | 0;
          const iy = y + .1 | 0;
          const xGroundPointCache = groundPointCache[ix] || {};
          groundPointCache[ix] = xGroundPointCache;
          const cachedResult = xGroundPointCache[iy] || uncachedResult;
          xGroundPointCache[iy] = cachedResult;
          return cachedResult;
        },
        (_, modelPoint) => {
          return terrainNormal(vectorNScale(modelPoint, 1/WORLD_DIMENSION));
        },
        VECTOR3_EMPTY,
      );
      const renderGroupId = nextRenderGroupId++;
      faces.forEach(face => {
        const id = nextEntityId++;

        // Note: we use the model bounds here as they will be about the same
        // for terrain tiles, at least for x/y axis
        const worldToPlaneCoordinates = matrix4Invert(face.toModelCoordinates);
        const rotateToPlaneCoordinates = matrix4Invert(face.rotateToModelCoordinates);
            
        const entity: StaticEntity = {
          entityType: ENTITY_TYPE_TERRAIN,
          resolutions: [resolution],
          position: [0, 0, 0],
          worldToPlaneCoordinates,
          rotateToPlaneCoordinates,
          bounds,
          face,
          id,
          renderGroupId,
          renderTile: tile,
          body: {
            modelId,
          },
          modelVariant: VARIANT_TERRAIN,
          collisionGroup: COLLISION_GROUP_TERRAIN,
        };
        addEntity(entity);
      });
    }
    return tile;
  }
 
  const gl = Z.getContext('webgl2');

  let projectionMatrix: ReadonlyMatrix4;
  
  let cameraZoom = -2;
  let cameraZRotation = 0;
  let cameraXRotation = 0;
  let cameraPosition = VECTOR3_EMPTY;

  const onResize = () => {
    Z.width = Z.clientWidth;
    Z.height = Z.clientHeight;
    gl.viewport(0, 0, Z.clientWidth, Z.clientHeight);
    projectionMatrix = matrix4Multiply(
      matrix4Perspective(
        Math.PI/4,
        Z.clientWidth/Z.clientHeight,
        MIN_FOCAL_LENGTH,
        HORIZON,
      ),
      matrix4Rotate(
        -Math.PI/2,
        1,
        0,
        0,
      ),
    )
  };
  window.onresize = onResize;
  onResize();
  if (FLAG_CLEAR_COLOR) {
    gl.clearColor(...SKY_LOW, 1);
  }

  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

  const program = gl.createProgram();
  if (program == null && FLAG_SHOW_GL_ERRORS) {
    throw new Error();
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS) && FLAG_SHOW_GL_ERRORS) {
    throw new Error(gl.getProgramInfoLog(program));
  }
  gl.useProgram(program);

  const [
    aModelPosition,
    aModelRotationMatrix,
    aModelSmoothingRotationMatrix,
    aAtlasTexturePositionMatrix,
  ] = [
    A_VERTEX_MODEL_POSITION,
    A_VERTEX_MODEL_ROTATION_MATRIX,
    A_VERTEX_MODEL_SMOOTHING_ROTATION_MATRIX,
    A_MODEL_ATLAS_TEXTURE_POSITION_MATRIX,
  ].map(
    attribute => gl.getAttribLocation(program, attribute)
  );
  const [
    uWorldPosition,
    uWorldRotationMatrix,
    uProjectionMatrix,
    uCameraPosition,
    uFocusPosition,
    uMaterialAtlas,
    uMaterialTexture,
    uMaterialColors,
    uAtlasTextureIndexAndMaterialTextureScaleAndDepth,
    uTime,
    uShadows,
  ] = [
    U_WORLD_POSITION,
    U_WORLD_ROTATION_MATRIX,
    U_PROJECTION_MATRIX,
    U_CAMERA_POSITION,
    U_FOCUS_POSITION,
    U_MATERIAL_ATLAS,
    U_MATERIAL_TEXTURE,
    U_MATERIAL_COLORS,
    U_ATLAS_TEXTURE_INDEX_AND_MATERIAL_TEXTURE_SCALE_AND_DEPTH,
    U_TIME,
    U_SHADOWS,
  ].map(
    uniform => gl.getUniformLocation(program, uniform)
  );

  const models: Model[] = [];
  function appendModel(
    faces: readonly Face<PlaneMetadata>[],
    toModelPoint: (planePoint: ReadonlyVector3, transform: ReadonlyMatrix4) => ReadonlyVector3,
    toSurfaceNormal: (face: Face<PlaneMetadata>, modelPoint: ReadonlyVector3) => ReadonlyVector3,
    explicitCenter?: ReadonlyVector3,
  ): Model & { id: number } {
    const groupPointsToFaces = new Map<ReadonlyVector3, Set<Face<PlaneMetadata>>>();

    // need to populate the points -> faces, otherwise the smoothing
    // doesn't work
    const allPoints = faces.map(
      face => {
        const { polygons, toModelCoordinates } = face;
        return polygons.map(
          polygon => {
            return polygon.map(
              point => {
                const modelPoint = toModelPoint(point, toModelCoordinates);
                const faces = groupPointsToFaces.get(point) || new Set();
                faces.add(face);
                groupPointsToFaces.set(modelPoint, faces);
                return modelPoint;
              }
            );
          }
        );
      }
    ).flat(2);

    const unadjustedBounds = allPoints.reduce<[ReadonlyVector3, ReadonlyVector3]>(
      ([min, max], point) => {
        return [
          point.map((v, i) => Math.min(v, min[i])) as Vector3,
          point.map((v, i) => Math.max(v, max[i])) as Vector3,
        ];
      },
      [allPoints[0], allPoints[0]],
    );

    const [unadjustedMin, unadjustedMax] = unadjustedBounds;
    const center = explicitCenter || vectorNScale(vectorNScaleThenAdd(unadjustedMin, unadjustedMax), .5);
    const bounds: ReadonlyRect3 = [
      vectorNScaleThenAdd(unadjustedMin, center, -1),
      vectorNScaleThenAdd(unadjustedMax, center, -1),
    ];

    const minimalInternalRadius = Math.max(...vectorNScaleThenAdd(unadjustedMax, unadjustedMin, -1))/2;
    const maximalExternalRadius = Math.max(...allPoints.map(
      p => vectorNLength(vectorNScaleThenAdd(p, center, -1)))
    );

    const [
      modelPoints,
      modelRotations,
      smoothingTransforms,
      modelTextureTransforms,
      indices,
    ] = faces.reduce<[
      // model positions
      ReadonlyVector3[],
      // plane to model transformation
      ReadonlyMatrix4[],
      // smoothing transformation
      ReadonlyMatrix4[],
      // model position to texture position
      ReadonlyMatrix4[],
      // indices
      number[],
    ]>(([
      modelPoints,
      modelRotations,
      smoothingTransforms,
      modelTextureTransforms,
      indices,
    ], face) => {
      const {
        polygons,
        rotateToModelCoordinates,
        toModelCoordinates,
        t: {
          textureCoordinateTransform,
        }
      } = face;
      const rotateFromModelCoordinates = matrix4Invert(rotateToModelCoordinates);
      const fromModelCoordinates = matrix4Invert(toModelCoordinates);
  
      const polygonPoints = polygons.flat(1);
      const modelPointsSet = polygonPoints.reduce((acc, point) => {
        return acc.add(toModelPoint(point, toModelCoordinates));
      }, new Set<ReadonlyVector3>());

      const modelPointsUnique = [...modelPointsSet];

      const newModelTextureTransforms = modelPointsUnique.map<ReadonlyMatrix4>(() => {
        // obtain from plane metadata 
        return textureCoordinateTransform || fromModelCoordinates;
      });

      const newModelRotations = new Array<ReadonlyMatrix4>(modelPointsUnique.length)
        .fill(rotateToModelCoordinates);

      const newSmoothingTransforms = modelPointsUnique.map(modelPoint => {
        const normal = toSurfaceNormal(face, modelPoint);
        // rotate the normal back to the face coordinates
        const planeNormal = vector3TransformMatrix4(rotateFromModelCoordinates, ...normal);
        const cosa = vectorNDotProduct(NORMAL_Z, planeNormal);
        const a = Math.acos(cosa);
        const transform = Math.abs(a) > EPSILON
          ? matrix4Rotate(
            a,
            ...vectorNNormalize(
              vector3CrossProduct(NORMAL_Z, planeNormal),
            ),
          )
          : MATRIX4_IDENTITY;
        return transform;
        //return matrix4Identity();
      });

      const newIndices = polygons.reduce<number[]>((indices, polygon, i) => {
        const polygonIndices = polygon.map(point => {
          const worldPoint = toModelPoint(point, toModelCoordinates);
          return modelPointsUnique.indexOf(worldPoint);
        });
        const originIndex = polygonIndices[0];
        const newIndices = polygonIndices.slice(1, -1).map((currentIndex, i) => {
          // + 2 because the offset is from 1
          const nextIndex = polygonIndices[i + 2];
          return [originIndex, currentIndex, nextIndex];
        }).flat(1).map(v => v + modelPoints.length);
        return [...indices, ...newIndices];
      }, []);
  
      return [
        [...modelPoints, ...modelPointsUnique],
        [...modelRotations, ...newModelRotations],
        [...smoothingTransforms, ...newSmoothingTransforms],
        [...modelTextureTransforms, ...newModelTextureTransforms],
        [...indices, ...newIndices],
      ];
    }, [[], [], [], [], []]);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
  
    ([
      [aModelPosition, modelPoints],
      [aModelRotationMatrix, modelRotations],
      [aModelSmoothingRotationMatrix, smoothingTransforms],
      [aAtlasTexturePositionMatrix, modelTextureTransforms],
    ] as const).forEach(([attribute, vectors]) => {
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vectors.flat(1)), gl.STATIC_DRAW);
      let count = 0;
      while (count * 4 < vectors[0].length) {
        const length = Math.min(4, vectors[0].length - count * 4);
        gl.enableVertexAttribArray(attribute + count);
        gl.vertexAttribPointer(
          attribute + count,
          length,
          gl.FLOAT,
          false,
          vectors[0].length > 4 ? 64 : 0,
          count * 16,
        );
        count++;
      }
    });
  
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    const model: Model & {
      id: number,
    } = {
      bounds,
      faces,
      center,
      maximalInternalRadius: minimalInternalRadius,
      maximalExternalRadius,
      groupPointsToFaces,
      indexCount: indices.length,
      vao,
      id: models.length,
    };
    models.push(model);
    return model;
  }

  const [
    skyCylinderModel,
    cubeModel,
    sphereModel,
    billboardModel,
  ] = ([
    SKY_CYLINDER_FACES,
    CUBE_FACES_BODY,
    SPHERE_FACES_BODY,
    BILLBOARD_FACES,
    DRAGON_FACES_BODY,
    DRAGON_FACES_NECK,
    DRAGON_FACES_HEAD,
    DRAGON_FACES_TAIL,
    DRAGON_FACES_QUAD_RIGHT,
    DRAGON_FACES_QUAD_LEFT,
    DRAGON_FACES_SHIN_RIGHT,
    DRAGON_FACES_SHIN_LEFT,
    DRAGON_FACES_WING_1_RIGHT,
    DRAGON_FACES_WING_1_LEFT,
    DRAGON_FACES_WING_2_RIGHT,
    DRAGON_FACES_WING_2_LEFT,
    DRAGON_FACES_WING_3_RIGHT,
    DRAGON_FACES_WING_3_LEFT,
  ]).map<Model>((faces) => {
    //const modelPointCache: ReadonlyVector3[] = [];
    const modelPointCache: Map<ReadonlyVector3, Set<Face<PlaneMetadata>>> = new Map()
    const getCachedTransformedPoint = (point: ReadonlyVector3, toModelCoordinates: ReadonlyMatrix4) => {
      const modelPoint = vector3TransformMatrix4(toModelCoordinates, ...point);
      const cachedModelPoint = [...modelPointCache.keys()].find(cachedPoint => {
        const d = vectorNLength(vectorNScaleThenAdd(cachedPoint, modelPoint, -1));
        // TODO * 9 seems arbitrary
        return d < EPSILON * 9;
      });
      return cachedModelPoint;
    };
    // populate cache
    faces.forEach(face => {
      const {
        polygons,
        toModelCoordinates,
      } = face;
      polygons.forEach(polygon => {
        polygon.forEach(point => {
          let cachedTransformedPoint = getCachedTransformedPoint(point, toModelCoordinates);
          if (cachedTransformedPoint == null) {
            cachedTransformedPoint = vector3TransformMatrix4(toModelCoordinates, ...point);
            modelPointCache.set(cachedTransformedPoint, new Set());
          }
          modelPointCache.get(cachedTransformedPoint).add(face);
        });
      });
    });

    return appendModel(
      faces,
      getCachedTransformedPoint, 
      (face, modelPoint) => {
        const {
          t: {
            smoothingFlags,
          }
        } = face;
        const smoothedFaces = [...modelPointCache.get(modelPoint)].filter(test => {
          return (test.t.smoothingFlags & smoothingFlags) || test == face;
        });
        return vectorNNormalize(
          smoothedFaces.reduce<ReadonlyVector3>(
            (acc, { rotateToModelCoordinates }) => {
              return vectorNScaleThenAdd(
                acc,
                vector3TransformMatrix4(rotateToModelCoordinates, ...NORMAL_Z),
              )
            },
            VECTOR3_EMPTY,
          )
        );
      },
    );
  });
  // material, 2d/1d texture, features 
  const proceduralMaterials: [number, ...Material[][]][] = [
    // TEXTURE_EMPTY_MAP
    [
      MATERIAL_TERRAIN_TEXTURE_DIMENSION,
      [
        ctx => {
          ctx.fillStyle = 'red';
          ctx.fillRect(0, 0, MATERIAL_TERRAIN_TEXTURE_DIMENSION, MATERIAL_TERRAIN_TEXTURE_DIMENSION);
        }
      ],
    ],
    // TEXTURE_WORLD_MAP
    [
      MATERIAL_TERRAIN_TEXTURE_DIMENSION,
      [
        ctx => {
          const imageData = ctx.getImageData(0, 0, MATERIAL_TERRAIN_TEXTURE_DIMENSION, MATERIAL_TERRAIN_TEXTURE_DIMENSION);
          for (let x=0; x<MATERIAL_TERRAIN_TEXTURE_DIMENSION; x++) {
            for (let y=0; y<MATERIAL_TERRAIN_TEXTURE_DIMENSION; y++) {
              //const depth = terrain((x + .5)/MATERIAL_TEXTURE_DIMENSION, (y + .5)/MATERIAL_TEXTURE_DIMENSION);
              /*
              const depth = terrain(x/MATERIAL_TERRAIN_TEXTURE_DIMENSION, y/MATERIAL_TERRAIN_TEXTURE_DIMENSION);
              const dx = x - MATERIAL_TERRAIN_TEXTURE_DIMENSION/2;
              const dy = y - MATERIAL_TERRAIN_TEXTURE_DIMENSION/2;
              const dc = Math.sqrt(dx *dx + dy * dy);
              const slopeNormal = FLAG_STONEY_SLOPES
                ? vectorNDotProduct(
                  terrainNormal(vectorNScale([x, y], 1/MATERIAL_TERRAIN_TEXTURE_DIMENSION)),
                  NORMAL_Z,
                )
                : 1;

              const sandiness = Math.max(
                //1 - Math.pow(Math.max(0, Math.min(1, depth*2)), 2), 
                // road
                1 - Math.abs(MATERIAL_TERRAIN_TEXTURE_DIMENSION*.4 - dc)/2,
                // distribute randomly based on elevation (shore line)
                Math.pow(Math.random(), Math.max(0, depth - .2) * 50),
                // distribute randomly based on elevation (mountain tops)
                Math.pow(slopeNormal, 9) - Math.pow(Math.random(), Math.max(0, depth - 9)/2),
              );
              const stoniness = Math.max(
                (1 - Math.pow(slopeNormal, 2)) * Math.pow(Math.random(), .1),
                // as it gets higher, more rocky
                1 - Math.pow(Math.max(0, Math.min(1, (30 - depth)/30)), 2),
                // some random rocks
                //Math.pow(Math.random(), 99),
              );

              const grassiness = Math.max(
                1 - Math.max(sandiness, stoniness),
                // slope normal should never be 0
                Math.pow(Math.random(), 99/slopeNormal),
                //Math.pow(slopeNormal * Math.random(), 9),
              )
              */
             const biomes = zones[x][y];
             const grassiness = biomes[BIOME_GRASSLAND] * Math.pow(Math.random(), .1);
             const sandiness = Math.min(
                1,
                biomes[BIOME_BEACH]
                  + biomes[BIOME_DESERT] * Math.random()
                  + biomes[BIOME_CIVILISATION]
                  + biomes[BIOME_ROAD]
              );
              const stoniness = Math.min(
                1,
                biomes[BIOME_CIVILISATION] * Math.random()
                  + biomes[BIOME_DESERT] * Math.pow(Math.random(), 9)
                  + biomes[BIOME_MOUNTAINS]
              );

              imageData.data.set([
                // sandiness
                sandiness * 255 | 0,
                // grassiness
                grassiness * 255 | 0,
                // rockiness
                stoniness * 255 | 0,
                // transparency
                255,
              ], (y * MATERIAL_TERRAIN_TEXTURE_DIMENSION + x) * 4);
            }
          }
          ctx.putImageData(imageData, 0, 0);
        },
      ],
    ],
    ...[
      // TEXTURE_SYMBOL_MAP
      //0  1 2 3  4 5 6  7 8  9 0  1 2  3  4 5
      '🌴🌳🌲🌵🌿🌼🌻🍖🐐🐄🛖🏠⛪🕌🏦🏰',
      // TEXTURE_SYMBOL_BRIGHT_MAP
      '🔥',
    ].map<[number, ...Material[][]]>(s => {
      return [
        MATERIAL_SYMBOL_TEXTURE_DIMENSION,
        ...[...s].map<Material[]>(c => {
          return [
            (ctx, y) => {
              ctx.font = `${MATERIAL_SYMBOL_TEXTURE_DIMENSION*.8 | 0}px serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              ctx.fillText(c, MATERIAL_SYMBOL_TEXTURE_DIMENSION/2, y + MATERIAL_SYMBOL_TEXTURE_DIMENSION);
            },
          ];   
        }),
      ]
    }),
    // TEXTURE_EMPTY_MATERIAL
    [
      MATERIAL_TERRAIN_TEXTURE_DIMENSION,
      [flatMaterial],
      // TODO can we remove these two empty arrays (will it roll around?)
      [flatMaterial],
      [flatMaterial],
    ],
    // TEXTURE_SKYBOX
    [
      MATERIAL_TERRAIN_TEXTURE_DIMENSION,
      [
        ctx => {
          // const gradient = ctx.createLinearGradient(0, 0, 0, MATERIAL_TERRAIN_TEXTURE_DIMENSION);
          // gradient.addColorStop(0, 'rgb(128,128,128)');
          // gradient.addColorStop(1, 'rgba(128,128,128,0)');
          // ctx.fillStyle = gradient;
          // ctx.fillRect(0, 0, MATERIAL_TERRAIN_TEXTURE_DIMENSION, MATERIAL_TERRAIN_TEXTURE_DIMENSION);
          const gradient = ctx.createLinearGradient(0, 0, 0, MATERIAL_TERRAIN_TEXTURE_DIMENSION);
          gradient.addColorStop(1, 'red'); // horizon
          gradient.addColorStop(.8, '#0F0');
          gradient.addColorStop(.2, '#0F0');
          gradient.addColorStop(0, 'red');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, MATERIAL_TERRAIN_TEXTURE_DIMENSION, MATERIAL_TERRAIN_TEXTURE_DIMENSION);

          if (FLAG_CLOUDS) {
            const distribution = clusteredDistributionFactory(9, 9, 1, 2, .8, 5);
            ctx.fillStyle = '#00F';
            for (let i=0; i<999; i++) {
              const [x, y, scale] = distribution(MATERIAL_TERRAIN_TEXTURE_DIMENSION)
              const r = 9 * scale;
              if (x < MATERIAL_TERRAIN_TEXTURE_DIMENSION - r) {
                ctx.beginPath();
                ctx.arc(
                  x,
                  MATERIAL_TERRAIN_TEXTURE_DIMENSION,
                  r,
                  0,
                  Math.PI * 2
                );
                ctx.fill();
    
              }
            }
          }
        },
      ],
      // TODO can we remove these two empty arrays (will it roll around?)
      // [flatMaterial],
      // [flatMaterial],
    ],
    // TEXTURE_TERRAIN_MATERIAL
    [
      MATERIAL_TERRAIN_TEXTURE_DIMENSION,
      // sand
      [
        flatMaterial,
        featureMaterial(
          staticFeature,
          16,
          999,
          randomDistributionFactory(.5, 2),
        ),  
        featureMaterial(
          riverStonesFeatureFactory(.6),
          64,
          99,
          randomDistributionFactory(.5, 2),
        ),  
      ],
      // grass
      [
        flatMaterial,
        featureMaterial(
          spikeFeatureFactory(4, 4),
          24,
          4096,
          randomDistributionFactory(
            .5,
            2,
          ),
        ),  
      ],
      // stone
      [
        flatMaterial,
        featureMaterial(
          staticFeature,
          16,
          999,
          randomDistributionFactory(1, 2),
        ),  
        featureMaterial(
          riverStonesFeatureFactory(1),
          48,
          999,
          clusteredDistributionFactory(9, 24, 2, 1, .5, 2),
        ),  
      ],
    ],
    // TEXTURE_DRAGON_BODY_MATERIAL
    [
      MATERIAL_TERRAIN_TEXTURE_DIMENSION,
      [
        flatMaterial,
        featureMaterial(
          riverStonesFeatureFactory(.8),
          16,
          9999,
          randomDistributionFactory(0, 0),
        ),  
      ],
    ]
  ];

  // make some textures
  
  const materialCanvases = await Promise.all(
    proceduralMaterials.map<Promise<[TexImageSource, number?, number?]>>(
      ([dimension, ...frames]) => {
        const materialCanvas = document.createElement('canvas');
        //document.body.appendChild(materialCanvas);
        materialCanvas.width = dimension;
        materialCanvas.height = dimension * frames.length; 
        const ctx = materialCanvas.getContext(
          '2d',
          FLAG_FAST_READ_CANVASES
            ? {
              willReadFrequently: true,
            }
            : undefined
        );
        frames.forEach((frame, i) => {
          frame.forEach(material => {
            material(ctx, i * dimension);
          });
        });
        return Promise.resolve([materialCanvas, dimension, frames.length]);
      }),
  );
  let textureId = gl.TEXTURE0;

  materialCanvases.forEach(([materialCanvas, dimension = MATERIAL_TERRAIN_TEXTURE_DIMENSION, frames = 1]) => {
    // need mipmap and non-mipmap versions of some textures (so we do all textures)
    new Array(2).fill(0).forEach((_, i) => {
      gl.activeTexture(textureId++);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
      gl.texImage3D(
        gl.TEXTURE_2D_ARRAY,
        0,
        gl.RGBA,
        dimension,
        dimension, 
        frames,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        materialCanvas,
      );
      if (i) {
        gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
      } else {
        // faster, but looks shit
        // gl.texParameteri(
        //   gl.TEXTURE_2D_ARRAY,
        //   gl.TEXTURE_MIN_FILTER,
        //   gl.NEAREST,
        // );
        // less static on textures, but slower
        gl.texParameteri(
          gl.TEXTURE_2D_ARRAY,
          gl.TEXTURE_MIN_FILTER,
          gl.LINEAR,
        );
      }
    });
  });  

  if (FLAG_ENFORCE_BOUNDARY) {
    // add in the walls
    new Array(4).fill(0).forEach((_, i) => {
      const zRotationMatrix = matrix4Rotate(i * Math.PI/2, 0, 0, 1);
      const polygons: ConvexPolygon[] = [[
        [WORLD_DIMENSION_MINUS_1/2, WORLD_DIMENSION_MINUS_1/2, 0],
        [WORLD_DIMENSION_MINUS_1/2, -WORLD_DIMENSION_MINUS_1/2, 0],
        [-WORLD_DIMENSION_MINUS_1/2, -WORLD_DIMENSION_MINUS_1/2, 0],
        [-WORLD_DIMENSION_MINUS_1/2, WORLD_DIMENSION_MINUS_1/2, 0],
      ]];
      const rotateToModelCoordinates = matrix4Multiply(
        zRotationMatrix,
        matrix4Rotate(-Math.PI/2, 0, 1, 0),
      );
      const toModelCoordinates = matrix4Multiply(
        matrix4Translate(WORLD_DIMENSION/2, WORLD_DIMENSION/2, 0),
        matrix4Translate(
          ...vector3TransformMatrix4(zRotationMatrix, WORLD_DIMENSION_MINUS_1/2, 0, 0),
        ),
        rotateToModelCoordinates,
      );
      const face: Face<PlaneMetadata> = {
        polygons,
        rotateToModelCoordinates,
        toModelCoordinates,
        t: {},
      };

      // append a model just to calculate the bounds
      const {
        bounds,
      } = appendModel(
        [face],
        (v, transform) => vector3TransformMatrix4(transform, ...v),
        // wrong, but we don't use this model anyway
        () => NORMAL_Z,
        VECTOR3_EMPTY,
      );

      addEntity({
        entityType: ENTITY_TYPE_TERRAIN,
        resolutions: [0],
        face,
        bounds,
        collisionGroup: COLLISION_GROUP_TERRAIN,
        id: nextEntityId++,
        position: VECTOR3_EMPTY,
        renderGroupId: nextRenderGroupId++,
        rotateToPlaneCoordinates: matrix4Invert(rotateToModelCoordinates),
        worldToPlaneCoordinates: matrix4Invert(toModelCoordinates),
      });
    });
  }

  // add in some trees
  populate([[0, 0], [WORLD_DIMENSION, WORLD_DIMENSION]]);
  // const treeDistribution = clusteredDistributionFactory(
  //   1/WORLD_DIMENSION,
  //   5/WORLD_DIMENSION,
  //   2,
  //   2,
  //   .3,
  //   3,
  // );
  // new Array(WORLD_DIMENSION*4).fill(0).forEach(() => {

  //   const [x, y, scale] = treeDistribution(1);

  //   const scaledCoordinates: Vector2 = [x, y];
  //   const z = terrain(...scaledCoordinates);
  //   const terrainNormalZ = terrainNormal(scaledCoordinates)[2];
  //   if (z > .5 && terrainNormalZ > .9) {
  //     const atlasIndex = (z + 7 + Math.random())/9 | 0;
      
  //     const adjustedScale = Math.pow((terrainNormalZ - .9) * 9, 2) * scale;
  //     const {
  //       maximalInternalRadius: minimalInternalRadius,
  //       bounds,
  //     } = billboardModel;

  //     const modelScale = (adjustedScale + .5) * MAX_TREE_HEIGHT;
  //     const collisionRadius = minimalInternalRadius * modelScale;
  
  //     const renderGroupId = nextRenderGroupId++;
  //     const position: Vector3 = [
  //       ...vectorNScale(scaledCoordinates, WORLD_DIMENSION),
  //       z + collisionRadius*.8,
  //     ] as Vector3;
  
  //     const entity: DynamicEntity<BillboardPartIds> = {
  //       entityType: ENTITY_TYPE_SCENERY,
  //       resolutions: new Array(adjustedScale * 4 + 3 + 2 * Math.random() | 0).fill(0).map((_, i) => i),
  //       position,
  //       id: nextEntityId++,
  //       bounds,
  //       renderGroupId,
  //       gravity: 0,
  //       collisionRadius: collisionRadius,
  //       body: BILLBOARD_PART,
  //       transform: matrix4Scale(modelScale),
  //       modelVariant: VARIANT_SYMBOLS,
  //       modelAtlasIndex: atlasIndex,
  //       velocity: [0, 0, 0],
  //       collisionGroup: COLLISION_GROUP_SCENERY,
  //       health: (adjustedScale+1) * 9,
  //       shadows: 1,
  //     };
  //     addEntity(entity);
  //   }
  // });

  const playerRadius = .3;
  // add in a "player"
  const player: DragonEntity<DragonPartIds> = {
    entityType: ENTITY_TYPE_PLAYER_CONTROLLED,
    resolutions: [0],
    body: DRAGON_PART,
    joints: {
      [DRAGON_PART_ID_BODY]: {},
      [DRAGON_PART_ID_NECK]: {},
      [DRAGON_PART_ID_HEAD]: {},
      [DRAGON_PART_ID_TAIL]: {},
      [DRAGON_PART_ID_QUAD_RIGHT]: {},
      [DRAGON_PART_ID_QUAD_LEFT]: {},
      [DRAGON_PART_ID_SHIN_RIGHT]: {},
      [DRAGON_PART_ID_SHIN_LEFT]: {},
      [DRAGON_PART_ID_WING_1_RIGHT]: {},
      [DRAGON_PART_ID_WING_2_RIGHT]: {},
      [DRAGON_PART_ID_WING_3_RIGHT]: {},
    },
    bounds: rect3FromRadius(playerRadius),
    // collision radius must fit within the bounds, so the model render radius will almost certainly
    // be larger than that
    collisionRadius: playerRadius,
    id: nextEntityId++,
    position: [
      WORLD_DIMENSION*.5,
      WORLD_DIMENSION*.1,
      terrain(.5, .1) + playerRadius,
    ],
    renderGroupId: nextRenderGroupId++,
    xRotation: 0,
    yRotation: 0,
    zRotation: 0,
    velocity: [0, 0, 0],
    maximumLateralVelocity: .01,
    maximumLateralAcceleration: .00002,
    gravity: DEFAULT_GRAVITY,
    collisionGroup: COLLISION_GROUP_PLAYER,
    collisionMask: COLLISION_GROUP_TERRAIN
      | COLLISION_GROUP_SCENERY
      | COLLISION_GROUP_ENEMY
      | COLLISION_GROUP_ITEMS,
    inverseMass: 1,
    shadows: 1,
    modelVariant: VARIANT_DRAGON_BODY,
  };
  addEntity(player);

  window.onmousedown = () => {
    setKeyState(INPUT_FIRE, 1);
    Z.requestPointerLock();
  };
  window.onmouseup = () => {
    setKeyState(INPUT_FIRE, 0);
  };
  window.onmousemove = (e: MouseEvent) => {
    const movement: ReadonlyVector2 = [e.movementX, e.movementY];
    const rotation = vectorNLength(movement)/399;
    if (rotation > EPSILON) {
      cameraZRotation -= movement[0]/399;
      cameraXRotation = Math.max(
        -Math.PI/2,
        Math.min(
          Math.PI/6,
          cameraXRotation - movement[1]/199,
        ),
      );
    }
  };
  if (FLAG_ALLOW_ZOOM) {
    window.onwheel = (e: WheelEvent) => {
      const v = e.deltaY/999;
      // TODO 
      if (Math.abs(cameraZoom) < 1 || true) {
        cameraZoom -= v;
      } else {
        if (v < 0 && cameraZoom > 0 || v > 0 && cameraZoom < 0) {
          cameraZoom /= Math.abs(v);
        } else {
          cameraZoom *= Math.abs(v);
        }  
      }
    };  
  }
  window.onkeydown = (e: KeyboardEvent) => {
    setKeyState(e.keyCode as KeyCode, 1);
    if (FLAG_PREVENT_DEFAULT) {
      e.preventDefault();
    }
  };
  window.onkeyup = (e: KeyboardEvent) => {
    setKeyState(e.keyCode as KeyCode, 0);
    if (FLAG_PREVENT_DEFAULT) {
      e.preventDefault();
    }
  };

  const lastFrameTimes: number[] = [];
  let then = 0;
  let time = 99;
  let tick = 0;
  function animate(now: number) {
    const delta = now - then;
    then = now;
    tick++;
    //const cappedDelta = 16;
    const cappedDelta = Math.min(delta, 40);
    time += cappedDelta;
    
    if (FLAG_SHOW_FPS) {
      lastFrameTimes.push(delta);
      const recentFrameTimes = lastFrameTimes.slice(-30);
      const spf = recentFrameTimes.reduce((acc, n) => {
        return acc + n/recentFrameTimes.length;
      }, 0);
      if (spf > 0 && fps) {
        fps.innerText = `${Math.round(1000/spf)}`;
      }  
    }

    const cameraZRotationMatrix = matrix4Rotate(cameraZRotation, 0, 0, 1);

    // TODO don't iterate entire world (only do around player), render at lower LoD
    // further away
    const handledEntities: Record<EntityId, Truthy> = {};
    const renderedEntities: Record<RenderGroupId, Truthy> = {};
    // variantId -> modelId -> position, rotation, resolution, atlasIndex
    const toRender: Partial<Record<VariantId, Record<ModelId, [ReadonlyVector3, ReadonlyMatrix4, number, number][]>>> = {};
    const shadows: ReadonlyVector4[] = [];

    // TODO get all the appropriate tiles at the correct resolutions for the entity
    const playerWorldPosition: Vector2 = vectorNScale(player.position, 1/WORLD_DIMENSION).slice(0, 2) as any;
    const offsets: ReadonlyVector2[] = [[0, 0], [0, 1], [1, 0], [1, 1]];
    const [tiles] = reversedWorld.reduce<[Set<Tile>, ReadonlyVector2[]]>(([tiles, cellsToCheck], _, reverseResolution) => {
      const scale = 1/Math.pow(2, reverseResolution + 1);
      const resolution = reversedWorld.length - reverseResolution - 1;
      // add in all the tiles within the bounds, but not in the view area
      let nextCellsToCheck: ReadonlyVector2[] = [];
      cellsToCheck.forEach((cell) => {
        const [gridX, gridY] = cell;
        const worldPosition = vectorNScale(vectorNScaleThenAdd(cell, [.5, .5]), scale);
        const distance = vectorNLength(
          vectorNScaleThenAdd(playerWorldPosition, worldPosition, -1),
          // approximate distance to the edge
        ) - scale/2;
        const minResolution = Math.pow(Math.max(0, distance * 2), .4) * RESOLUTIONS - .5;
        //const minResolution = Math.min(distance * resolutions * 8, 6);
        if (resolution > minResolution && resolution) {
          nextCellsToCheck.push(
            ...offsets.map(offset => vectorNScaleThenAdd(vectorNScale(cell, 2), offset)),
          );
        } else {
          tiles.add(getAndMaybePopulateTile(gridX | 0, gridY | 0, resolution));
          if (FLAG_REPOPULATE) {
            // secretly refresh this tile
            if (resolution == 4 && Math.random() < .0001) {
              const gridScale = Math.pow(2, resolution);
              populate(
                [
                  [gridX * gridScale, gridY * gridScale],
                  [(gridX+1)*gridScale, (gridY+1)*gridScale],
                ],
                // only populate things that can be killed, otherwise the world
                // fills up with rubbish
                1,
              );
            }
          }  
        }
      });
      return [tiles, nextCellsToCheck];
    }, [new Set<Tile>(), offsets]);

    // const grid = world[0];
    // const tiles = grid.map((gridX, x) => gridX.map((_, y) => getOrCreateGridTile(x, y, 0))).flat(1);    

    // NOTE: we could convert all forEaches to maps, but set doesn't support map
    tiles.forEach((tile) => {
      for (let entityId in tile.entities) {
        const entity: Entity = tile.entities[entityId];
        if (!handledEntities[entityId]) {
          handledEntities[entityId] = 1;
          const {
            entityType,
            bounds,
            renderGroupId: renderId,
            renderTile,
            face,
          } = entity;

          if (!face) {
            if (entityType == ENTITY_TYPE_PLAYER_CONTROLLED || entityType == ENTITY_TYPE_INTELLIGENT) {
              const onGround = entity.lastOnGroundTime + 99 > time && entity.lastOnGroundNormal;
              // do AI stuff
              const entityLateralVelocity = entity.velocity.slice(0, 2) as Vector2;
              const totalEntityLateralVelocity = vectorNLength(entityLateralVelocity);
              const gliding = hasJointAnimation(entity, ACTION_ID_GLIDE);
              const flapping = hasJointAnimation(entity, ACTION_ID_FLAP);

              if (entityType == ENTITY_TYPE_PLAYER_CONTROLLED) {
                const entityFacingNormal = vector3TransformMatrix4(
                  matrix4Rotate(entity.zRotation, 0, 0, 1),
                  0, 1, 0,
                );
                const someLateralInputsWereUnreadOrNonZero = CARDINAL_INPUT_VECTORS.some(
                  ([input]) => someInputUnread(input) || readInput(input),
                );
                const running = readInput(INPUT_RUN);
                let targetUnrotatedLateralOffset: ReadonlyVector2;
                let targetXRotation: number;
                if (onGround) {
                  // set the xRotation to match the ground 
                  const cosXRotation = vectorNDotProduct(
                    entityFacingNormal,
                    entity.lastOnGroundNormal,
                  );
                  
                  targetXRotation = Math.acos(cosXRotation) - Math.PI/2;

                  if (someLateralInputsWereUnreadOrNonZero) {
                    // turn nicely
                    const zDiff = mathAngleDiff(entity.zRotation, cameraZRotation);
                    entity.zRotation += zDiff > 0
                      ? Math.min(zDiff, cappedDelta * Z_TORQUE)
                      : Math.max(zDiff, cappedDelta * -Z_TORQUE);
                    
                  }  
                  targetUnrotatedLateralOffset = CARDINAL_INPUT_VECTORS.reduce<Vector2>((velocity, [input, vector, runMultiplier = 0]) => {
                    const multiplier = (readInput(input) * (running * 2 * runMultiplier + 1))/3;
                    return vectorNScaleThenAdd(
                      velocity,
                      vector,
                      cappedDelta * entity.maximumLateralVelocity * multiplier,
                    );
                  }, [0, 0])
                } else {
                  targetXRotation = someLateralInputsWereUnreadOrNonZero && (gliding || flapping)
                    ? cameraXRotation + Math.PI*.1
                    : entity.xRotation;
                  entity.zRotation = Math.atan2(entity.velocity[1], entity.velocity[0]) - Math.PI/2;
                  if (readInput(INPUT_UP)) {
                    targetUnrotatedLateralOffset = [0, 1];
                  } else {
                    // preemptively undo the rotation below so we continue on in the same direction
                    targetUnrotatedLateralOffset = [
                      Math.cos(entity.zRotation - cameraZRotation + Math.PI/2),
                      Math.sin(entity.zRotation - cameraZRotation + Math.PI/2),
                    ];
                  }
                }
                const xDiff = mathAngleDiff(entity.xRotation, targetXRotation);
                entity.xRotation += xDiff > 0
                  ? Math.min(xDiff, cappedDelta * X_TORQUE)
                  : Math.max(xDiff, cappedDelta * -X_TORQUE);

                const targetLateralOffset = vector3TransformMatrix4(
                  matrix4Rotate(cameraZRotation, 0, 0, 1),
                  ...targetUnrotatedLateralOffset,
                  0,
                );
                // set the friction so we don't slip around when not moving
                entity.inverseFriction = someLateralInputsWereUnreadOrNonZero || totalEntityLateralVelocity > EPSILON
                  ? 1
                  : 0;
                entity.targetLateralPosition = vectorNScaleThenAdd(entity.position, targetLateralOffset);
                const jumpUnread = someInputUnread(INPUT_JUMP);
                if (jumpUnread) {
                  if (!flapping) {
                    if (readInput(INPUT_JUMP)) {
                      // TODO just supply numbers that don't require normalisation
                      const targetNormal = vectorNNormalize(
                        vector3TransformMatrix4(
                          matrix4Multiply(
                            matrix4Rotate(entity.zRotation, 0, 0, 1),
                            matrix4Rotate(entity.xRotation, 1, 0, 0),
                          ),
                          0, 1, 1,
                        )
                      );
                      entity.velocity = vectorNScaleThenAdd(
                        entity.velocity,
                        targetNormal,
                        .005,
                      );
                      entity.lastOnGroundTime = 0;
                      setJointAnimations(entity, DRAGON_ANIMATION_FLAP);    
                    }
                  }
                } else {
                  if (readInput(INPUT_JUMP, 1) && !onGround) {
                    setJointAnimations(entity, DRAGON_ANIMATION_GLIDE);
                  }
                }
                // animate behaviour
                const jointAnimation = (someLateralInputsWereUnreadOrNonZero || totalEntityLateralVelocity > .001) && onGround
                  ? targetUnrotatedLateralOffset[1] < 0
                    ? DRAGON_ANIMATION_WALK_BACKWARD
                    : running || totalEntityLateralVelocity >= entity.maximumLateralVelocity
                      ? DRAGON_ANIMATION_RUN
                      : DRAGON_ANIMATION_WALK
                  : onGround
                    ? DRAGON_ANIMATION_IDLE
                    : DRAGON_ANIMATION_FALL;
                setJointAnimations(entity, jointAnimation);

                // align the neck/head with the camera rotation
                let deltaZRotation = mathAngleDiff(entity.zRotation || 0, cameraZRotation);
                deltaZRotation = deltaZRotation > 0
                  ? Math.min(deltaZRotation, Math.PI/2)
                  : Math.max(deltaZRotation, -Math.PI/2);
                // const neckAndHeadTransform = matrix4Multiply(
                //   matrix4Rotate(deltaZRotation/2, 0, 0, 1),
                //   matrix4Rotate(cameraXRotation/2, 1, 0, 0),
                // );
                // player.joints[DRAGON_PART_ID_NECK].transform = neckAndHeadTransform;
                // player.joints[DRAGON_PART_ID_HEAD].transform = matrix4Multiply(
                //   matrix4Invert(neckAndHeadTransform),
                //   matrix4Rotate(deltaZRotation, 0, 0, 1),
                //   matrix4Rotate(cameraXRotation, 1, 0, 0),
                // );
                // TODO the cumulative rotations applied to the head will make it so there is some x/z rotation
                // from the neck bleeding into the z/x rotation of the head. It's not really noticable though
                const rotation: ReadonlyVector3 = [cameraXRotation/2 + Math.PI*.01, 0, deltaZRotation/2];
                entity.joints[DRAGON_PART_ID_NECK]['r'] = rotation;
                entity.joints[DRAGON_PART_ID_HEAD]['r'] = rotation;

                entity.fireReservior = Math.min((entity.fireReservior || 0) + cappedDelta, 9999);

                if (
                  (entity.lastFired || 0) + 50 - Math.sqrt(entity.fireReservior) < time
                    && readInput(INPUT_FIRE)
                ) {
                  setJointAnimations(entity, DRAGON_ANIMATION_SHOOT);
                  entity.lastFired = time;
                  entity.fireReservior -= 99;
                  // use exact player transform chain
                  const body = entity.body as BodyPart<DragonPartIds>;
                  const neck = body.children[0];
                  const head = neck.children[0];
                  const headPositionTransforms = [body, neck, head].map(part => {
                    const joint = entity.joints[part.id];
                    return [
                      // pre/post rotatoin happen not to be populated on head/neck/body
                      //part.preRotation && matrix4RotateZXY(...part.preRotation),
                      part.preRotationOffset && matrix4Translate(...part.preRotationOffset),
                      joint['r'] && matrix4RotateZXY(...joint['r']),
                      //part.postRotation && matrix4RotateZXY(...part.postRotation),
                    ]
                  }).flat(1);
                  const headPositionTransform = matrix4Multiply(
                    matrix4Translate(...entity.position),
                    matrix4RotateZXY(
                      entity.xRotation + Math.random()*.2-.1,
                      entity.yRotation,
                      entity.zRotation + Math.random()*.2-.1,
                    ),
                    // matrix4Rotate(player.zRotation, 0, 0, 1),
                    // matrix4Rotate(player.xRotation, 1, 0, 0),
                    // matrix4Rotate(player.yRotation, 0, 1, 0),
                    ...headPositionTransforms,
                  );
                  const headPosition = vector3TransformMatrix4(
                    headPositionTransform,
                    0, 0, 0,
                  );
                  const headDirection = vectorNNormalize(
                    vectorNScaleThenAdd(
                      vector3TransformMatrix4(
                        headPositionTransform,
                        0, 1, 0,
                      ),
                      headPosition,
                      -1,
                    )
                  );

                  // const playerTransform = matrix4Multiply(
                  //   matrix4Rotate(cameraZRotation + Math.random()*.2-.1, 0, 0, 1),
                  //   matrix4Rotate(cameraXRotation + Math.PI/20 + Math.random()*.2-.1, 1, 0, 0),
                  // );
                  const velocity: Vector3 = vectorNScaleThenAdd(
                    entity.velocity,
                    headDirection,
                    .01,
                  );

                  const collisionRadius = .1;

                  // fire a ball 
                  const ball: DynamicEntity = {
                    entityType: ENTITY_TYPE_FIREBALL,
                    body: {
                      modelId: MODEL_ID_SPHERE,
                    },
                    resolutions: [0, 1],
                    bounds: rect3FromRadius(collisionRadius),
                    id: nextEntityId++,
                    collisionRadius,
                    collisionGroup: COLLISION_GROUP_PLAYER,
                    collisionMask: COLLISION_GROUP_ENEMY
                      | COLLISION_GROUP_SCENERY
                      | COLLISION_GROUP_TERRAIN,
                    position: headPosition,
                    velocity,
                    renderGroupId: nextRenderGroupId++,
                    inverseMass: 9,
                    transient: 1,
                    modelVariant: VARIANT_FIRE,
                    anims: [[
                      createAttributeAnimation(
                        999 * (Math.random()+entity.fireReservior/9999),
                        'at',
                        EASING_QUAD_IN,
                        createMatrixUpdate(p => matrix4Scale(p + collisionRadius)),
                        e => e.dead = 1,
                      )
                    ]]
                  };

                  addEntity(ball);
                }
              } else {
                // TODO
              }
              const targetLateralPosition = entity.targetLateralPosition || entity.position;
              let targetYRotation = 0;
              if (entity.lastOnGroundTime + 99 > time) {
                const targetLateralDelta = vectorNScaleThenAdd(
                  targetLateralPosition,
                  entity.position,
                  -1,
                ).slice(0, 2) as Vector2;
                const length = vectorNLength(targetLateralDelta);
                const angle = length > EPSILON
                  ? Math.atan2(targetLateralDelta[1], targetLateralDelta[0])
                  : 0;
                const totalTargetVelocity = Math.min(
                  entity.maximumLateralVelocity,
                  length/cappedDelta,
                );
                const targetVelocity = [
                  Math.cos(angle) * totalTargetVelocity,
                  Math.sin(angle) * totalTargetVelocity,
                ];
                const deltaVelocity = vectorNScaleThenAdd(
                  targetVelocity,
                  entityLateralVelocity,
                  -1,
                );
                const totalDeltaVelocity = vectorNLength(deltaVelocity);
                // apply maximum acceleration to delta
                entity.velocity = [
                  ...vectorNScaleThenAdd(
                    entityLateralVelocity,
                    deltaVelocity,
                    Math.min(
                      1,
                      entity.maximumLateralAcceleration * cappedDelta / totalDeltaVelocity,
                    ),
                  ),
                  entity.velocity[2],
                ];
                
              } else {
                // flying/falling
                const gravity = entity.gravity;
                if (gliding && gravity) {
                  const xRotation = entity.xRotation || 0;
                  const targetLateralDirection = vectorNScaleThenAdd(targetLateralPosition, entity.position, -1);
                  const targetLateralNormal = vectorNNormalize(
                    vectorNLength(targetLateralDirection) > EPSILON
                      ? targetLateralDirection
                      : entity.velocity
                  );
                  const velocityNormal = vectorNNormalize(entity.velocity);
                  const targetLateralAngle = Math.atan2(targetLateralNormal[1], targetLateralNormal[0]) - Math.PI/2;
                  // tilt up or down to match the x rotation
                  const targetVelocityNormal = vector3TransformMatrix4(
                    matrix4Rotate(xRotation, Math.cos(targetLateralAngle), Math.sin(targetLateralAngle), 0),
                    ...targetLateralNormal,
                  );
                  let achievableVelocity = entity.velocity;
                  const cosa = vectorNDotProduct(velocityNormal, targetVelocityNormal);
                  if (cosa < 1 - EPSILON) {
                    const targetAngle = Math.acos(cosa);
                    const axis = vectorNNormalize(
                      vector3CrossProduct(velocityNormal, targetVelocityNormal),
                    );
                    
                    const achievableAngle = targetAngle > 0
                      ? Math.min(targetAngle, cappedDelta * TURN_TORQUE)
                      : Math.max(targetAngle, cappedDelta * -TURN_TORQUE);
                    // TODO maybe rotate on the y axis by the amount missing?
                    achievableVelocity = vector3TransformMatrix4(
                      matrix4Rotate(achievableAngle, ...axis),
                      ...vectorNScale(achievableVelocity, 1),
                    );    
                  }
                  const lateralVelocityNormal = vectorNNormalize<ReadonlyVector3>([...velocityNormal.slice(0, 2), 0] as Vector3);
                  const bankCos = vectorNDotProduct<ReadonlyVector3>(
                    lateralVelocityNormal,
                    targetLateralNormal,
                  );
                  if (bankCos < 1 - EPSILON) {
                    const bankAxis = vector3CrossProduct(lateralVelocityNormal, targetLateralNormal);
                    const bankAngle = Math.acos(bankCos);
                    targetYRotation = bankAxis[2] > 0 ? -bankAngle : bankAngle;
                  }

                  // reverse the effects of gravity by the amount we are facing up
                  // achievableVelocity[2] = gravity * cappedDelta
                  //   * (1 + Math.sin(xRotation))
                  //   * Math.min(1, velocityLength*99);
                  entity.velocity = achievableVelocity;
                }
              }
              // bank smoothly
              const yDiff = mathAngleDiff(entity.yRotation, targetYRotation);
              entity.yRotation += yDiff > 0
                ? Math.min(yDiff, cappedDelta * Z_TORQUE)
                : Math.max(yDiff, cappedDelta * -Z_TORQUE);
            }
            
            if (entity.gravity) {
              entity.velocity[2] -= cappedDelta * entity.gravity;
            }
            if (FLAG_DEBUG_PHYSICS) {
              entity.logs = entity.logs?.slice(-30) || [];
            }
            removeEntity(entity);
            const collisionEntities = new Set<Entity>();

            const collidedEntities: Record<EntityId, Truthy> = {};
            let duplicateCollisionCount = 1;
            // TODO enforce max speed
            let remainingCollisionTime = cappedDelta;
            let collisionCount = 0;
            while (
              remainingCollisionTime > EPSILON
              && collisionCount < MAX_COLLISIONS
              && !entity.dead
            ) {
              const {
                position,
                velocity,
                collisionRadius: collisionRadiusFromCenter,
                restitution = 0,
                collisionMask,
              } = entity as DynamicEntity;

              const targetPosition = vectorNScaleThenAdd(position, velocity, remainingCollisionTime);

              const targetUnionBounds: ReadonlyRect3 = [
                velocity.map((v, i) => bounds[0][i] + Math.min(0, v) * remainingCollisionTime - EPSILON) as Vector3,
                velocity.map((v, i) => bounds[1][i] + Math.max(0, v) * remainingCollisionTime + EPSILON) as Vector3,
              ];
              const targetEntity = {
                position: targetPosition,
                bounds: targetUnionBounds,
                resolutions: [0, 1],
              };
              let minCollisionTime = remainingCollisionTime;
              let minCollisionNormal: Vector3 | Falsey;
              let minCollisionEntity: Entity | Falsey;
              const checkedEntities: Record<EntityId, Truthy> = {};
              // update dynamic entity
              iterateEntityBounds(targetEntity, tile => {
                for (let checkEntityId in tile.entities) {
                  let check = tile.entities[checkEntityId];
                  if (!checkedEntities[checkEntityId] && (check.collisionGroup & collisionMask)) {
                    checkedEntities[checkEntityId] = 1;
                    let collisionTime: number | undefined;
                    if (check.face) {
                      let planeCollisionNormal: ReadonlyVector3 | Falsey;
                      const {
                        rotateToPlaneCoordinates,
                        worldToPlaneCoordinates,
                        position: checkPosition,
                        bounds: checkBounds,
                        face: {
                          polygons,
                          rotateToModelCoordinates,
                        },
                      } = check as StaticEntity;

                      
                      if (
                        rectNOverlaps(targetPosition, targetUnionBounds, checkPosition, checkBounds)
                      ) {
                        // only check static collisions
                        const planeVelocity = vector3TransformMatrix4(
                          rotateToPlaneCoordinates,
                          ...velocity,
                        );
                        const planeVelocityZ = planeVelocity[2];
                        // avoid divide by 0
                        if (planeVelocityZ) {
                          // NOTE: the z coordinate here is incorrect, do not use this vector in
                          // 3d transformations (2d is fine)
                          const startPlanePosition = vector3TransformMatrix4(
                            worldToPlaneCoordinates,
                            ...position,
                          );
                          const planeZ = polygons[0][0][2];
                          const startPlanePositionZ = startPlanePosition[2] - planeZ;

                          const minPlaneIntersectionTime = planeVelocityZ < 0
                            ? (collisionRadiusFromCenter - startPlanePositionZ)/planeVelocityZ
                            // start position z should be -ve
                            : (-startPlanePositionZ - collisionRadiusFromCenter)/planeVelocityZ;
                          const maxPlaneIntersectionTime = planeVelocityZ < 0
                            ? (collisionRadiusFromCenter + startPlanePositionZ)/-planeVelocityZ
                            : (collisionRadiusFromCenter - startPlanePositionZ)/planeVelocityZ;

                          // do they already overlap
                          if (FLAG_CHECK_STARTS_OVERLAPPING) {
                            let inside: Booleanish;
                            if (rectNOverlaps(position, bounds, checkPosition, checkBounds)) {
                              if (minPlaneIntersectionTime < 0 && minPlaneIntersectionTime > collisionRadiusFromCenter*2/planeVelocityZ) {
                                if (vector2PolygonsContain(polygons, ...startPlanePosition)) {
                                  inside = 1;
                                  if (FLAG_DEBUG_PHYSICS) {
                                    entity.logs.push(['inside center']);
                                  }
                                } else {
                                  const startIntersectionRadius = Math.sqrt(
                                    collisionRadiusFromCenter * collisionRadiusFromCenter - startPlanePositionZ * startPlanePositionZ
                                  );
                                  const closestPoint = vector2PolygonsEdgeOverlapsCircle(
                                    polygons,
                                    startPlanePosition,
                                    startIntersectionRadius,
                                  );
                                  if (closestPoint) {
                                    const [dx, dy] = vectorNScaleThenAdd(closestPoint, startPlanePosition, -1);
                                    let distanceSquared = dx * dx + dy * dy + startPlanePositionZ * startPlanePositionZ;
                                    if (distanceSquared < startIntersectionRadius * startIntersectionRadius) {
                                      inside = 1;
                                      if (FLAG_DEBUG_PHYSICS) {
                                        entity.logs.push(['inside edge', Math.sqrt(distanceSquared), startIntersectionRadius, collisionRadiusFromCenter]);
                                      }
                                    }
                                  }
                                }
                              }
                            }
                            if (inside && FLAG_DEBUG_PHYSICS) {
                              entity.logs.forEach(log => console.log(...log));
                              console.log('inside', entity.position, check.id, ...toPoints(check), minPlaneIntersectionTime);
                              entity.logs = [];
                            }
                          }

                          if (
                            maxPlaneIntersectionTime >= 0
                            && minPlaneIntersectionTime <= remainingCollisionTime
                          ) {

                            const intersectionPlanePosition = vectorNScaleThenAdd(
                              startPlanePosition,
                              planeVelocity,
                              minPlaneIntersectionTime,
                            );
                            if (
                              planeVelocityZ < 0
                              && vector2PolygonsContain(polygons, ...intersectionPlanePosition)
                              && FLAG_QUICK_COLLISIONS
                            ) {
                              if (minPlaneIntersectionTime > 0) {
                                collisionTime = minPlaneIntersectionTime; 
                                planeCollisionNormal = NORMAL_Z;  
                              }
                            } else {
                              //const planeIntersectionPositionZ = planeIntersectionPosition[2];
                              // handle edge collisions
                              // const intersectionRadius = Math.sqrt(
                              //   collisionRadius * collisionRadius - planeIntersectionPositionZ * planeIntersectionPositionZ
                              // );
                              // const closestCollisionPoint = vector2PolygonsEdgeOverlapsCircle(polygons, planeIntersectionPosition, intersectionRadius);
                              // const planeTargetPosition = vector3TransformMatrix4(
                              //   worldToPlaneCoordinates,
                              //   ...targetPosition,
                              // );
                              // if (closestCollisionPoint || vector2PolygonsContain(polygons, ...planeTargetPosition)) {
                              //let minTime = 0;
                              let minTime = Math.max(0, minPlaneIntersectionTime);
                              let maxTime = Math.min(maxPlaneIntersectionTime, remainingCollisionTime);
                              for (let i=0; i<MAX_COLLISION_STEPS; i++) {
                                const testTime = i ? (minTime + maxTime)/2 : maxTime;
                                const testPlanePosition = vector3TransformMatrix4(
                                  worldToPlaneCoordinates,
                                  ...vectorNScaleThenAdd(position, velocity, testTime),
                                );
                                const testPlanePositionZ = testPlanePosition[2] - planeZ;
                                let hit: Booleanish;
                                if (vector2PolygonsContain(polygons, ...testPlanePosition)) {
                                  planeCollisionNormal = NORMAL_Z;
                                  hit = 1;
                                } else {
                                  const testIntersectionRadius = Math.sqrt(
                                    collisionRadiusFromCenter * collisionRadiusFromCenter - testPlanePositionZ * testPlanePositionZ
                                  );
                                  const closestPoint = vector2PolygonsEdgeOverlapsCircle(
                                    polygons,
                                    testPlanePosition,
                                    testIntersectionRadius,
                                  );
                                  if (closestPoint) {
                                    const [dx, dy] = vectorNScaleThenAdd(closestPoint, testPlanePosition, -1);
                                    let rsq = dx * dx + dy * dy + testPlanePositionZ * testPlanePositionZ;
                                    if (rsq < collisionRadiusFromCenter * collisionRadiusFromCenter) {
                                      const [closestPointX, closestPointY] = closestPoint;
                                      // const angleZ = Math.atan2(
                                      //   closestPointX - testPlanePosition[1],
                                      //   closestPointY - testPlanePosition[0],
                                      // ); 
                                      // const cosAngleX = testPlanePositionZ / collisionRadius;
                                      // const angleX = Math.acos(cosAngleX);
                                      
                                      planeCollisionNormal = vectorNNormalize(
                                        vectorNScaleThenAdd(
                                          testPlanePosition,
                                          [closestPointX, closestPointY, planeZ],
                                          -1,
                                        ),
                                      );
                                      //planeCollisionNormal = NORMAL_Z;
                                      hit = 1;
                                    }
                                  }
                                }
                                if (hit) {
                                  if (i) {
                                    maxTime = testTime;
                                  }
                                  // first loop is a special case
                                } else {
                                  if (!i) {
                                    // no collision, exit loop
                                    i = MAX_COLLISION_STEPS;
                                  } else {
                                    minTime = testTime;
                                  }
                                }
                              }
                              if (planeCollisionNormal) {
                                // if the collisionNormal is already aligned with the velocity
                                // just ignore it
                                if (vectorNDotProduct(planeVelocity, planeCollisionNormal) < 0) {
                                  collisionTime = minTime;
                                } else {
                                  planeCollisionNormal = 0;
                                }
                              }
                            }
                          }
                        }
                      }
                      if (planeCollisionNormal
                        && (collisionTime < minCollisionTime || !minCollisionNormal)
                      ) {
                        const collisionNormal = vector3TransformMatrix4(
                          rotateToModelCoordinates,
                          ...planeCollisionNormal,
                        );
                        minCollisionTime = collisionTime;
                        minCollisionNormal = collisionNormal;
                        minCollisionEntity = check;
                      }
                    } else {

                      // update any dynamic-dynamic collision behaviours

                      const entityDelta = vectorNScaleThenAdd(
                        targetPosition,
                        check.position,
                        -1
                      );
                      const entityDistance = vectorNLength(entityDelta);
                      const entityOverlap = collisionRadiusFromCenter + (check as DynamicEntity).collisionRadius - entityDistance;
                      if (entityOverlap > 0) {
                        collisionEntities.add(check);
                      }
                    }
                  }
                }
              }, 1);
              if (minCollisionNormal) {

                const boundedCollisionTime = Math.max(0, minCollisionTime - EPSILON);

                if (FLAG_DEBUG_PHYSICS) {
                  const minCollisionEntityId = (minCollisionEntity as Entity).id;
                  if (collidedEntities[minCollisionEntityId]) {
                    duplicateCollisionCount++;
                  }
                  collidedEntities[minCollisionEntityId] = 1;
  
                  entity.logs.push([
                    'collision',
                    collisionCount,
                    minCollisionTime,
                    minCollisionNormal,
                    remainingCollisionTime,
                    position,
                    targetUnionBounds,
                  ]);
                  entity.logs.push([
                    '  with',
                    (minCollisionEntity as Entity).id,
                    ...toPoints(minCollisionEntity),
                    vector3TransformMatrix4((minCollisionEntity as Entity).face.rotateToModelCoordinates, 0, 0, 1),
                  ]);  
                  // console.log(
                  //   'collision',
                  //   count,
                  //   (minCollisionEntity as Entity).id,
                  //   minCollisionTime,
                  //   remainingCollisionTime,
                  //   minCollisionNormal,

                  // );
                  entity.logs.push([
                    '  velocity b', vectorNLength(velocity), velocity
                  ]);
                  // console.log('  velocity b', vectorNLength(velocity), velocity);
                }
                

                entity.position = vectorNScaleThenAdd(
                  entity.position,
                  velocity,
                  boundedCollisionTime,
                );

                const inverseFriction = (entity as DynamicEntity).inverseFriction || 0;

                const cosa = vectorNDotProduct(minCollisionNormal, NORMAL_Z);
                const a = Math.acos(cosa);
                const axis = a > EPSILON
                  ? vectorNNormalize(vector3CrossProduct(minCollisionNormal, NORMAL_Z))
                  : NORMAL_X;
                const rotate = matrix4Rotate(a, ...axis);
                const unrotate = matrix4Rotate(-a, ...axis);
                const v = vector3TransformMatrix4(rotate, ...velocity);
                if (FLAG_DEBUG_PHYSICS) {
                  entity.logs.push(['  velocity i', vectorNLength(v), v]);
                }
                // console.log('  velocity i', vectorNLength(v), v);
                const outputV = vectorNMultiply(v, [
                  inverseFriction,
                  inverseFriction,
                  // bounce it out, want the restitution to increase to 1 (or more!) as we
                  // keep colliding so we don't end up in a degenerate state
                  -restitution,
                ]);

                // avoid rounding errors by ensuring that any collision bounces out at 
                // at least EPSILON velocity
                if (FLAG_SAFE_UNROTATED_VELOCITY) {
                  outputV[2] = Math.max(outputV[2], EPSILON/9 * duplicateCollisionCount);
                }
                if (FLAG_DEBUG_PHYSICS) {
                  // console.log('  velocity s', vectorNLength(v), v);
                  entity.logs.push(['  velocity s', vectorNLength(outputV), outputV]);
                }

                (entity as DynamicEntity).velocity = vector3TransformMatrix4(unrotate, ...outputV);
                if (FLAG_DEBUG_PHYSICS) {
                  // console.log('  velocity a', vectorNLength((entity as DynamicEntity).velocity), (entity as DynamicEntity).velocity);
                  entity.logs.push([
                    '  velocity a',
                    vectorNLength((entity as DynamicEntity).velocity),
                    [...(entity as DynamicEntity).velocity],
                  ]);
                }

                (entity as DynamicEntity).lastOnGroundNormal = minCollisionNormal;
                (entity as DynamicEntity).lastOnGroundTime = time;
                collisionEntities.add(minCollisionEntity as Entity);
                
                remainingCollisionTime -= boundedCollisionTime;
              } else {
                entity.position = vectorNScaleThenAdd(
                  entity.position,
                  velocity,
                  Math.max(0, remainingCollisionTime - EPSILON),
                );
                remainingCollisionTime = 0;
              }
              collisionCount++;
              if (collisionCount > MAX_COLLISIONS && FLAG_DEBUG_PHYSICS) {
                entity.logs.forEach(log => console.log(...log));
                console.log('too many collisions');
                entity.logs = [];
              }  
            }
            if (entity.position[2] < 0) {
              // TODO add fake water entity
              //collisionEntities.add(WATER);
            }
          
            collisionEntities.forEach(check => {
              const {
                position,
                inverseMass = 0,
              } = entity;
              
              if (check && !face && !check.face && (inverseMass || check.inverseMass)) {
                const entityDelta = vectorNScaleThenAdd(
                  position,
                  check.position,
                  -1
                );
                const entityDistance = vectorNLength(entityDelta);
                const entityOverlap = (entity as DynamicEntity).collisionRadius
                  + (check as DynamicEntity).collisionRadius
                  - entityDistance;
            
                const divisor = 1999*(inverseMass + (check.inverseMass || 0));
                entity.velocity = entity.velocity && vectorNScaleThenAdd(
                  entity.velocity,
                  entityDelta,
                  entityOverlap*inverseMass/divisor
                );
                check.velocity = check.velocity && vectorNScaleThenAdd(
                  check.velocity,
                  entityDelta,
                  -entityOverlap*(check.inverseMass || 0)/divisor,
                );
              }
            
              let checkInvincible = check && check.anims?.some(([_, actionId]) => actionId == ACTION_ID_TAKE_DAMAGE);
              let checkDamaged: Booleanish;
            
              switch (entity.entityType) {
                case ENTITY_TYPE_FIREBALL:
                  entity.dead = 1;
                  addEntity({
                    body: {
                      modelId: MODEL_ID_SPHERE,
                    },
                    bounds: rect3FromRadius(.3),
                    collisionGroup: COLLISION_GROUP_PLAYER,
                    collisionMask: COLLISION_GROUP_ENEMY | COLLISION_GROUP_SCENERY | COLLISION_GROUP_TERRAIN,
                    collisionRadius: .3,
                    entityType: ENTITY_TYPE_FIRE,
                    id: nextEntityId++,
                    position: entity.position,
                    renderGroupId: nextRenderGroupId++,
                    resolutions: [0, 1, 2, 3, 4],
                    velocity: [0, 0, 0],
                    anims: [
                      [
                        createAttributeAnimation(
                          200,
                          'at',
                          EASING_QUAD_OUT,
                          createMatrixUpdate(matrix4Scale),
                          e => {
                            // turn it into a flame so we can see fires at distance
                            e.body = {
                              modelId: MODEL_ID_BILLBOARD,
                            };
                            // TODO feel like setting all these should be one operation
                            // model id has variant and symbol baked in?
                            e.modelVariant = VARIANT_SYMBOLS_BRIGHT;
                            e.modelAtlasIndex = VARIANT_SYMBOLS_BRIGHT_TEXTURE_ATLAS_INDEX_FIRE;
                            (e as DynamicEntity).gravity = DEFAULT_GRAVITY;
                          },
                        ),
                      ],
                      [
                        createAttributeAnimation(
                          -999,
                          'at',
                          EASING_QUAD_IN_OUT,
                          createMatrixUpdate(p => matrix4Scale(p/5 + .9))
                        ),
                      ]
                    ],
                    transient: 1,
                    inverseFriction: 0,
                    modelVariant: VARIANT_FIRE,
                    health: 9,
                  });
                  checkDamaged = 1;
                  break;
                case ENTITY_TYPE_FIRE:
                  entity.lastCollisionTick = tick;
                  if (
                    check
                      && check.health
                      && !checkInvincible
                  ) {
                    // do damage to thing
                    checkDamaged = 1;
                    // gain some health
                    entity.health += 9;
                  }
                  break;
              }
              if (checkDamaged && check && check.health && !checkInvincible) {
                check.health--;
                check.anims = [
                  ...(check.anims || []),
                  [
                    createAttributeAnimation(
                      300 + 99 * Math.random(),
                      'at',
                      EASING_BOUNCE,
                      createMatrixUpdate(p => matrix4Scale(1 - p/2, 1 - p/2, 1 + p/3)),
                    ),
                    ACTION_ID_TAKE_DAMAGE
                  ],
                ];
              }
            });
            addEntity(entity, tiles);
          }
          if(entity.shadows) {
            shadows.push([...entity.position, (entity as BaseDynamicEntity).collisionRadius]);
          }
          // update any passive behaviours
          let lookAtCamera: Booleanish;
          switch (entity.entityType) {
            case ENTITY_TYPE_FIRE:
              // only fall down if not burning something
              if (entity.lastCollisionTick == tick) {
                entity.gravity = 0;
                entity.velocity = [0, 0, 0];
              } else {
                entity.gravity = DEFAULT_GRAVITY;
              }
              // burn
              if ((entity.lastSpawnedParticle || 0) + 99 < time) {
                addEntity({
                  body: BILLBOARD_PART,
                  transform: matrix4Scale(.4),
                  modelVariant: VARIANT_SYMBOLS_BRIGHT,
                  modelAtlasIndex: VARIANT_SYMBOLS_BRIGHT_TEXTURE_ATLAS_INDEX_FIRE,
                  bounds: rect3FromRadius(.2),
                  collisionGroup: COLLISION_GROUP_NONE,
                  collisionRadius: .2,
                  entityType: ENTITY_TYPE_PARTICLE,
                  id: nextEntityId++,
                  position: vectorNScaleThenAdd(
                    entity.position,
                    new Array(3).fill(0).map(() => Math.pow(Math.random() * 2 - 1, 3)),
                    entity.collisionRadius,
                  ),
                  velocity: [0, 0, .001],
                  renderGroupId: nextRenderGroupId++,
                  resolutions: [0, 1],
                  transient: 1,
                  anims: [
                    [
                      createAttributeAnimation(
                        999 + Math.random() * 999,
                        'at',
                        EASING_QUAD_IN,
                        createMatrixUpdate(p => matrix4Scale(1 - p)),
                        e => e.dead = 1,
                      )
                    ],
                    // TODO this is gold plating really
                    [
                      createAttributeAnimation(
                        -400,
                        'at',
                        EASING_QUAD_IN_OUT,
                        createMatrixUpdate(p => matrix4Translate(0, p/9, 0)),
                      )
                    ]
                  ],
                }, tiles);
                entity.health--;
                entity.lastSpawnedParticle = time;
              }
              lookAtCamera = 1;
              break;
            case ENTITY_TYPE_PARTICLE:
              // not required? particles are now treated like other entities
              // entity.position = vectorNScaleThenAdd(
              //   entity.position,
              //   entity.velocity,
              //   cappedDelta,
              // );
              // fall through
            case ENTITY_TYPE_INTELLIGENT:
            case ENTITY_TYPE_SCENERY:
              lookAtCamera = 1;
              break;
          }
          if( lookAtCamera) {
            // rotate to look at camera
            entity.zRotation = Math.atan2(
              cameraPosition[1] - entity.position[1],
              cameraPosition[0] - entity.position[0],
            );
          }

          if (entity.health <= 0) {
            entity.dead = 1;
          }
          if (entity.transient) {
            let found: Booleanish;
            iterateEntityBounds(entity, tile => {
              found ||= tiles.has(tile);
            });
            entity.dead ||= !found;
          }

          // update any animations
          entity['at'] = entity.transform;
          entity.anims = entity.anims?.filter(([anim]) => !anim(entity, cappedDelta));
          if (entity.transient && entity.lastUpdated < tick - 1) {
            entity.dead = 1;
          }
          entity.lastUpdated = tick;

          if (entity.dead) {
            removeEntity(entity);
          } else if (!renderedEntities[renderId] && (!renderTile || tiles.has(renderTile)) ) {
            // render
            renderedEntities[renderId] = 1;
            const { 
              modelVariant = VARIANT_NULL,
              modelAtlasIndex = 0,
              body,
              xRotation,
              yRotation,
              zRotation,
            } = entity;

            function appendRender(
              {
                id,
                modelId,
                preRotationOffset,
                preRotation,
                postRotation,
                children,
              }: BodyPart,
              position: ReadonlyVector3,
              transform: ReadonlyMatrix4,
            ) {
              const joint = entity.joints?.[id];
              const anim = joint?.anim;
              if (anim) {
                // animatinos return true when done
                if (anim(joint, cappedDelta)) {
                  joint.anim = 0;
                }
              }
              // as the sky cylinder consumes the first model id, and is drawn explicitly above,
              // model id should always be > 0
              if (modelId || children) {
                const jointRotation = joint?.['r'];
                const rotation = matrix4Multiply(
                  transform,
                  postRotation && matrix4RotateZXY(...postRotation),
                  jointRotation && matrix4RotateZXY(...jointRotation),
                  preRotation && matrix4RotateZXY(...preRotation),
                );
                const offsetPosition = preRotationOffset
                  ? vectorNScaleThenAdd(
                    position,
                    vector3TransformMatrix4(
                      transform,
                      ...preRotationOffset,
                    )
                  )
                  : position;

                if (modelId) {
                  let variantRenders = toRender[modelVariant];
                  if (!variantRenders) {
                    variantRenders = {};
                    toRender[modelVariant] = variantRenders;
                  }
                  let modelRenders = variantRenders[modelId];
                  if (!modelRenders) {
                    modelRenders = [];
                    variantRenders[modelId] = modelRenders;
                  }
                  modelRenders.push([
                    offsetPosition,
                    rotation,
                    tile.resolution,
                    modelAtlasIndex,
                  ]);
                }
                children?.forEach(child => appendRender(child, offsetPosition, rotation));
              }
            }
            body && appendRender(
              body,
              entity.position,
              matrix4Multiply(
                matrix4RotateZXY(xRotation, yRotation, zRotation),
                // zRotation && matrix4Rotate(zRotation, 0, 0, 1),
                // xRotation && matrix4Rotate(xRotation, 1, 0, 0),
                // yRotation && matrix4Rotate(yRotation, 0, 1, 0),
                entity['at'],
              ),              
            );
          }
        }
      }
    });

    const orderedShadows = shadows.sort((a, b) => {
      const [da, db] = [a, b].map(
        v => vectorNLength(vectorNScaleThenAdd(player.position, v, -1))
      );
      return da - db;
    }).slice(0, MAX_SHADOWS);

    //
    // render
    //

    const playerHeadPosition = vectorNScaleThenAdd(player.position, [0, 0, 1]);
    const cameraPositionMatrix = matrix4Translate(...playerHeadPosition);
    const cameraPositionAndRotationMatrix = matrix4Multiply(
      cameraPositionMatrix,
      cameraZRotationMatrix,
      matrix4Rotate(cameraXRotation, 1, 0, 0),
      matrix4Translate(0, cameraZoom, 0),
    );
    const cameraPositionAndProjectionMatrix = matrix4Multiply(
      projectionMatrix,
      matrix4Invert(cameraPositionAndRotationMatrix),
    );

    cameraPosition = vector3TransformMatrix4(cameraPositionAndRotationMatrix, 0, 0, 0);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(uProjectionMatrix, false, cameraPositionAndProjectionMatrix as any);
    gl.uniform3fv(uCameraPosition, cameraPosition as any);
    gl.uniform3fv(uFocusPosition, player.position as any);
    gl.uniform4fv(
      uShadows,
      [
        ...orderedShadows.flat(1),
        ...new Array((MAX_SHADOWS - orderedShadows.length)*4).fill(0),
      ],
    );
    gl.uniform1f(uTime, now);

    //
    // draw the sky cylinder
    //
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.uniform1i(uMaterialTexture, TEXTURE_EMPTY_MATERIAL_MIPMAP);
    gl.uniform1i(uMaterialAtlas, TEXTURE_SKYBOX_ATLAS_MIPMAP);
    gl.uniform3f(uAtlasTextureIndexAndMaterialTextureScaleAndDepth, 0, 1, 0);
    gl.uniform4fv(uMaterialColors, [
      // sky
      ...SKY_LOW, 0,
      ...SKY_LOW, 0,
      ...SKY_HIGH, 0,
      ...SKY_HIGH, 0,
      // clouds
      1, 1, 1, 0,
      // unused
      //1, 1, 1, 0,
    ]);

    gl.bindVertexArray(skyCylinderModel.vao);
    gl.uniform4f(
      uWorldPosition,
      ...player.position.slice(0, 2) as Vector2,
      0,
      0,
    );

    gl.uniformMatrix4fv(uWorldRotationMatrix, false, SKY_CYLINDER_SCALE as any);
    gl.drawElements(gl.TRIANGLES, skyCylinderModel.indexCount, gl.UNSIGNED_SHORT, 0);  

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    //
    // end sky cylinder
    //

    for (let variantId in toRender) {
      const variantRenders = toRender[variantId as any as VariantId];
      const {  
        atlasTextureId,
        materialTextureId,
        materialTextureScale = 1,
        materialDepth = 0,
        materialTextureColors,
       } = VARIANTS[variantId as any as VariantId];

      gl.uniform4fv(uMaterialColors, materialTextureColors as any);
      gl.uniform1i(uMaterialAtlas, atlasTextureId);

      for (let modelId in variantRenders) {
        const modelRenders = variantRenders[modelId as any as ModelId];
        const {
          vao,
          indexCount,
        } = models[modelId];
        gl.bindVertexArray(vao);
        modelRenders.forEach(([position, rotationMatrix, resolution, atlasIndex]) => {
          gl.uniform1i(uMaterialTexture, materialTextureId + (resolution < 2 && materialDepth ? 0 : 1) );
          // TODO can we move (some of) this out of the loop?
          gl.uniform3f(
            uAtlasTextureIndexAndMaterialTextureScaleAndDepth,
            atlasIndex,
            materialTextureScale,
            materialDepth,
          );

          gl.uniform4f(uWorldPosition, ...position, 0);
          gl.uniformMatrix4fv(uWorldRotationMatrix, false, rotationMatrix as any);
          gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
        });
      }
    }

    requestAnimationFrame(animate);
  }
  animate(0);
}


function rotateToPlane(normal: ReadonlyVector3, velocity: ReadonlyVector3): Vector3 {
  const cosa = vectorNDotProduct(normal, NORMAL_Z);
  const a = Math.acos(cosa);
  const axis = a > EPSILON
    ? vectorNNormalize(vector3CrossProduct(normal, NORMAL_Z))
    : NORMAL_X;
  const matrix = matrix4Rotate(a, ...axis);
  return vector3TransformMatrix4(matrix, ...velocity);
}

function unrotateFromPlane(normal: ReadonlyVector3, velocity: ReadonlyVector3): Vector3 {
  const cosa = vectorNDotProduct(normal, NORMAL_Z);
  const a = Math.acos(cosa);
  const axis = a > EPSILON
    ? vectorNNormalize(vector3CrossProduct(normal, NORMAL_Z))
    : NORMAL_X;
  const matrix = matrix4Rotate(-a, ...axis);
  return vector3TransformMatrix4(matrix, ...velocity);
}

function toPoints(e: Entity | Falsey) {
  const s = e as StaticEntity;
  return s.face.polygons[0].map(p => vector3TransformMatrix4(s.face.toModelCoordinates, ...p));
}