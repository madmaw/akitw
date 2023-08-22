
const U_WORLD_POSITION_MATRIX = 'uWorldPosition';
const U_WORLD_ROTATION_MATRIX = 'uWorldRotation';
const U_PROJECTION_MATRIX = 'uProjection';
const U_CAMERA_POSITION = 'uCameraPosition';
const U_MATERIAL_TEXTURE = 'uMaterialTexture';
const U_TIME = 'uTime';

const A_VERTEX_MODEL_POSITION = "aVertexModelPosition";
const A_VERTEX_MODEL_ROTATION_MATRIX = 'aVertexModelRotation';
const A_VERTEX_MODEL_SMOOTHING_ROTATION_MATRIX = 'aVertexModelSmoothingRotation';
const A_MODEL_COLOR = 'aColor';
const A_MODEL_TEXTURE_POSITION_MATRIX = 'aModelTexturePosition';

const V_MODEL_POSITION = 'vModelPosition';
const V_WORLD_POSITION = 'vWorldPosition';
const V_MODEL_ROTATION_MATRIX = 'vModelRotation';
const V_MODEL_SMOOTHING_ROTATION_MATRIX = 'vModelSmoothingRotation';
const V_INVERSE_MODEL_SMOOTHING_ROTATION_MATRIX = 'vInverseModelSmoothingRotation';
const V_MODEL_COLOR = 'vColor';
const V_WORLD_PLANE_NORMAL = 'vWorldPlaneNormal';
const V_WORLD_TEXTURE_POSITION_MATRIX = 'vWorldTexturePosition'

const O_COLOR = "oColor";

const VERTEX_SHADER = `#version 300 es
  precision lowp float;

  in vec4 ${A_VERTEX_MODEL_POSITION};
  in mat4 ${A_VERTEX_MODEL_ROTATION_MATRIX};
  in mat4 ${A_VERTEX_MODEL_SMOOTHING_ROTATION_MATRIX};
  in mat4 ${A_MODEL_TEXTURE_POSITION_MATRIX};
  in vec4 ${A_MODEL_COLOR};

  uniform mat4 ${U_WORLD_POSITION_MATRIX};
  uniform mat4 ${U_WORLD_ROTATION_MATRIX};
  uniform mat4 ${U_PROJECTION_MATRIX};
  
  out vec4 ${V_WORLD_POSITION};
  out mat4 ${V_WORLD_TEXTURE_POSITION_MATRIX};
  out vec4 ${V_MODEL_POSITION};
  out mat4 ${V_MODEL_ROTATION_MATRIX};
  out mat4 ${V_MODEL_SMOOTHING_ROTATION_MATRIX};
  out mat4 ${V_INVERSE_MODEL_SMOOTHING_ROTATION_MATRIX};
  out vec4 ${V_MODEL_COLOR};
  out vec4 ${V_WORLD_PLANE_NORMAL};

  void main(void) {
    ${V_MODEL_POSITION} = ${A_VERTEX_MODEL_POSITION};
    //${V_WORLD_TEXTURE_POSITION_MATRIX} = ${U_WORLD_POSITION_MATRIX} * ${U_WORLD_ROTATION_MATRIX} * ${A_MODEL_TEXTURE_POSITION_MATRIX};
    ${V_WORLD_TEXTURE_POSITION_MATRIX} = ${A_MODEL_TEXTURE_POSITION_MATRIX} * inverse(${U_WORLD_POSITION_MATRIX} * ${U_WORLD_ROTATION_MATRIX});
    ${V_WORLD_POSITION} = ${U_WORLD_POSITION_MATRIX} * ${U_WORLD_ROTATION_MATRIX} * ${A_VERTEX_MODEL_POSITION};
    ${V_MODEL_ROTATION_MATRIX} = ${A_VERTEX_MODEL_ROTATION_MATRIX};
    ${V_WORLD_PLANE_NORMAL} = ${U_WORLD_ROTATION_MATRIX} * ${V_MODEL_ROTATION_MATRIX} * vec4(0,0,1,1);
    
    ${V_MODEL_SMOOTHING_ROTATION_MATRIX} = ${A_VERTEX_MODEL_SMOOTHING_ROTATION_MATRIX};
    ${V_INVERSE_MODEL_SMOOTHING_ROTATION_MATRIX} = inverse(${V_MODEL_SMOOTHING_ROTATION_MATRIX});
    ${V_MODEL_COLOR} = ${A_MODEL_COLOR};

    gl_Position = ${U_PROJECTION_MATRIX} * ${V_WORLD_POSITION};
  }
`;

const STEP = .001;
const NUM_STEPS = MATERIAL_DEPTH_RANGE/STEP | 0;
const MATERIAL_DEPTH_SCALE = (256/(MATERIAL_TEXTURE_DIMENSION * MATERIAL_DEPTH_RANGE)).toFixed(1);

const FRAGMENT_SHADER = `#version 300 es
  precision lowp float;

  in mat4 ${V_WORLD_TEXTURE_POSITION_MATRIX};
  in vec4 ${V_WORLD_POSITION};
  in vec4 ${V_MODEL_POSITION};
  in mat4 ${V_MODEL_ROTATION_MATRIX};
  in mat4 ${V_MODEL_SMOOTHING_ROTATION_MATRIX};
  in mat4 ${V_INVERSE_MODEL_SMOOTHING_ROTATION_MATRIX};
  in vec4 ${V_MODEL_COLOR};
  in vec4 ${V_WORLD_PLANE_NORMAL};

  uniform mat4 ${U_WORLD_ROTATION_MATRIX};
  uniform vec3 ${U_CAMERA_POSITION};
  uniform sampler2D ${U_MATERIAL_TEXTURE};
  uniform float ${U_TIME};

  out vec4 ${O_COLOR};

  void main(void) {
    vec3 distance = ${U_CAMERA_POSITION} - ${V_WORLD_POSITION}.xyz;
    vec4 d = ${V_INVERSE_MODEL_SMOOTHING_ROTATION_MATRIX} * vec4(normalize(distance), 1);
    // NOTE: c will be positive for camera facing surfaces
    float c = dot(${V_WORLD_PLANE_NORMAL}.xyz, d.xyz);
    float depth = ${MATERIAL_DEPTH_RANGE/2};
    // material
    vec4 tm;

    // distances
    vec4 p;
    for (int count = 0; count < ${NUM_STEPS}; count++) {
      depth -= ${STEP};
      p = ${V_WORLD_TEXTURE_POSITION_MATRIX} * vec4(${V_WORLD_POSITION}.xyz + d.xyz * depth / c, 1);
      vec4 tm1 = texture(
        ${U_MATERIAL_TEXTURE},
        p.xy
      );

      float surfaceDepth = (tm1.z - .5) * ${MATERIAL_DEPTH_SCALE};
      if (surfaceDepth > depth) {
        float d0 = depth + ${STEP};
        float s0 = d0 - (tm.z - .5) * ${MATERIAL_DEPTH_SCALE};
        float s1 = d0 - surfaceDepth;
        float divisor = ${STEP} - s1 + s0;
        // make sure it's not almost parallel, if it is, defer until next iteration
        if (abs(divisor) > .0) {  
          float si = s0 * ${STEP}/divisor;
          depth += ${STEP} - si;
          p = ${V_WORLD_TEXTURE_POSITION_MATRIX} * vec4(${V_WORLD_POSITION}.xyz + d.xyz * (d0 - si) / c, 1);
          count = ${NUM_STEPS};
        }
      }
      tm = texture(
        ${U_MATERIAL_TEXTURE},
        p.xy
      );  
    }
    vec2 n = tm.xy * 2. - 1.;
    vec3 m = normalize(${U_WORLD_ROTATION_MATRIX} * ${V_MODEL_ROTATION_MATRIX} * ${V_MODEL_SMOOTHING_ROTATION_MATRIX} * vec4(n, pow(1. - length(n), 2.), 1)).xyz;
    float inverseBrightness = min(${V_MODEL_COLOR}.w*2.,1.);
    vec4 color = mix(
      vec4(${V_MODEL_COLOR}.xyz, 1),
      vec4(1, 0, 0, 1),
      abs(tm.a * 2. - 1.)
    );
    float lighting = max(
      1. - inverseBrightness, 
      (dot(m, normalize(vec3(1, 2, 3)))+1.)/2.
    ) * .5;

    vec3 waterDistance = distance * (1. - max(0., sin(${U_TIME}/1999.)/9.-${V_WORLD_POSITION}.z)/max(distance.z, .1));
    float wateriness = 1. - pow(1. - clamp(distance.z - waterDistance.z, 0., 1.), 9.);
    vec3 sandDistance = distance * (1. - max(0., .2-${V_WORLD_POSITION}.z)/max(distance.z, .1));
    float sandiness = 1. - pow(1. - clamp(distance.z - sandDistance.z, 0., 1.), 9.);

    vec3 fc = mix(
      mix(
        mix(
          color.xyz * lighting,
          vec3(.8, .7, .5),
          sandiness
        ),
        vec3(${WATER.join()}),
        wateriness
      ),
      // fog
      vec3(${SKY.join()}),
      pow(min(1., length(waterDistance)/${MAX_FOG_DEPTH}.), 1.) * max(wateriness, inverseBrightness)
    );
    ${O_COLOR} = vec4(sqrt(fc), 1);
  }
`;

window.onload = async () => {

  const defaultPlaneMetadata: PlaneMetadata = {
    color1: [.5, .5, .5, .5],
  }

  // cube
  const cube: ConvexShape<PlaneMetadata> = [
    toPlane(0, 0, 1, .2, defaultPlaneMetadata),
    toPlane(0, 0, -1, .2, defaultPlaneMetadata),
    toPlane(1, 0, 0, .2, defaultPlaneMetadata),
    toPlane(-1, 0, 0, .2, defaultPlaneMetadata),
    toPlane(0, 1, 0, .2, defaultPlaneMetadata),
    toPlane(0, -1, 0, .2, defaultPlaneMetadata),
  ];

  const cubeSmall: ConvexShape<PlaneMetadata> = [
    toPlane(0, 0, 1, .01, defaultPlaneMetadata),
    toPlane(0, 0, -1, .01, defaultPlaneMetadata),
    toPlane(1, 0, 0, .01, defaultPlaneMetadata),
    toPlane(-1, 0, 0, .01, defaultPlaneMetadata),
    toPlane(0, 1, 0, .01, defaultPlaneMetadata),
    toPlane(0, -1, 0, .01, defaultPlaneMetadata),
  ];

  const cubeBig: ConvexShape<PlaneMetadata> = [
    toPlane(0, 0, 1, .9, defaultPlaneMetadata),
    toPlane(0, 0, -1, .9, defaultPlaneMetadata),
    toPlane(1, 0, 0, .9, defaultPlaneMetadata),
    toPlane(-1, 0, 0, .9, defaultPlaneMetadata),
    toPlane(0, 1, 0, .9, defaultPlaneMetadata),
    toPlane(0, -1, 0, .9, defaultPlaneMetadata),
  ];

  const skyCylinderRadius = HORIZON*.6;
  const skyCylinder: ConvexShape<PlaneMetadata> = new Array(12).fill(0).map((_, i, arr) => {
    const a = Math.PI * 2 * i / arr.length;
    const sin = Math.sin(a);
    const cos = Math.cos(a);
    const unrotate = matrix4Multiply(
      // y <-> z (only need z -> y but not sure which dir does that)
      // TODO just rotate around X instead
      matrix4Rotate(-Math.PI/2, 1, 0, 0),
      matrix4Scale(.5/skyCylinderRadius),
      matrix4Rotate(-a, 0, 0, 1),
    );
    return toPlane<PlaneMetadata>(cos, sin, 0, skyCylinderRadius, {
      textureCoordinateTransform: unrotate,
      color1: [...SKY, 0],
    });
  }).concat([
    toPlane(0, 0, 1, skyCylinderRadius, {
      textureCoordinateTransform: matrix4Scale(.5/skyCylinderRadius),
      color1: [...SKY, 0],
    }),
    toPlane(0, 0, -1, skyCylinderRadius, {
      textureCoordinateTransform: undefined,
      color1: [...SKY, 0],
    }),
  ]);

  // const shapes: readonly Shape[] = ([
  //   [shape5, [shape6]],
  //   [shape1, [shape2, shape3, shape4, shape6]],
  // ] as const);

  //console.log(modelShapesFaces);

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
  console.log(depths);
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
            const targetDepth = Math.pow(Math.max(0, 1 - dcenterSquared), 9) * 7;
            
            const rnd = 1 - Math.random() * Math.min(2, 1 + dcenterSquared);
            //const rnd = Math.random();
            const depth = (averageDepth * 2 + targetDepth)/3 + Math.pow(Math.abs(rnd), inverseRandomness) * rnd * 9;
            depths[x][y] = depth;
          }
        })
      }
    }
  }

  // material, flags = generate linear, generate mipmap
  const materials: (Material | Falsey)[] = [
    // empty
    0,
    // skybox
    (ctx, size) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, size/2);
      gradient.addColorStop(0, 'rgb(128,128,128,.5)');
      gradient.addColorStop(.5, 'rgba(128,128,128)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      // TODO clouds
    },
    featureMaterial(
      spikeFeatureFactory(.05, .05),
      12,
      // spikeFeatureFactory(1, 1),
      // 64,
      99999,
      randomDistributionFactory(
        0,
        2,
      ),
    ),
  ];
  // make some textures
  const textureImages = materials.map(material => {
    const materialCanvas = document.createElement('canvas');
    //document.body.appendChild(materialCanvas);
    materialCanvas.width = MATERIAL_TEXTURE_DIMENSION;
    materialCanvas.height = MATERIAL_TEXTURE_DIMENSION; 
    const ctx = materialCanvas.getContext(
      '2d',
      FLAG_FAST_READ_CANVASES
        ? {
          willReadFrequently: true,
        }
        : undefined
    );
    // nx = 0, ny = 0, depth = 0, feature color = 0
    ctx.fillStyle = 'rgba(128,128,128,.5)';
    //ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, MATERIAL_TEXTURE_DIMENSION, MATERIAL_TEXTURE_DIMENSION);

    material && material(ctx, MATERIAL_TEXTURE_DIMENSION);
    return materialCanvas;
  });
  

  const terrain = weightedAverageTerrainFactory(depths);
  
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
      resolutionBodies,
      position,
      bounds: [[minx, miny], [maxx, maxy]],
     }: Pick<Entity, 'position' | 'bounds'> & {
      resolutionBodies: Record<number, any>,
     },
    f: (tile: Tile, x: number, y: number) => void,
    populate?: Booleanish,
  ) {
    for (let resolutionString in resolutionBodies) {
      // in JS strings can be numbers
      const resolution: number = parseInt(resolutionString) as any;
      const divisor = Math.pow(2, resolution);
      const resolutionDimension = Math.pow(2, RESOLUTIONS - resolution);
      const [px, py] = position;
      for (
        let x = Math.max(0, (px + minx)/divisor | 0);
        x <= Math.min(resolutionDimension - 1, (px + maxx)/divisor);
        x++
      ) {
        for (
          let y = Math.max(0, (py + miny)/divisor | 0);
          y <= Math.min(resolutionDimension - 1, (py + maxy)/divisor);
          y++
        ) {
          const tile = populate
            ? getAndMaybePopulateTile(x, y, resolution)
            : world[resolution][x][y];
          f(tile, x, y);
        }
      }  
    }
  }
  
  function addEntity(entity: Entity) {
    iterateEntityBounds(entity, tile => {
      tile.entities[entity.id] = entity;
    });
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
        //const index = 1;
        const cut = points.splice(0, index+1);
        points.push(...cut.slice(0, index));  
        axisPoint = cut[index]
        workingArray = points.slice(0, -1);
      }
      const groundFaces = workingArray.map((point, i) => {
        const nextPoint = points[(i+1)%points.length];
        return toFace<PlaneMetadata>(axisPoint, point, nextPoint, {
          color1: [0, 1, 0, .5],
          textureCoordinateTransform: matrix4Identity(),
        });
      });
      const {
        faces,
        bounds,
        center,
        radius,
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
          // get some samples
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
            const point = vectorNScaleThenAdd(offset, modelPoint, 1/WORLD_DIMENSION);
            
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
          //return vector3TransformMatrix4(_.rotateToModelCoordinates, 0, 0, 1);
        },
      );
      const renderGroupId = nextRenderGroupId++;
      faces.forEach(face => {
        const id = nextEntityId++;

        // Note: we use the model bounds here as they will be about the same
        // for terrain tiles, at least for x/y axis
        const worldToPlaneCoordinates = matrix4Invert(face.toModelCoordinates);
        const rotateToPlaneCoordinates = matrix4Invert(face.rotateToModelCoordinates);
        const expandedBounds: ReadonlyRect3 = [
          vectorNScaleThenAdd(bounds[0], new Array(3).fill(EPSILON), -1),
          vectorNScaleThenAdd(bounds[1], new Array(3).fill(EPSILON)),
        ];
            
        const entity: StaticEntity = {
          resolutionBodies: {
            [resolution]: {
              // terrain is always at position 0, so offset == center
              id: 0,
              centerOffset: center,
              centerRadius: radius,
              modelId,
              renderTransform: matrix4Identity(),
              textures: new Map([[uMaterialTexture, [TEXTURE_GRASS_MIPMAP]]]),
            },
          },
          position: [0, 0, 0],
          worldToPlaneCoordinates,
          rotateToPlaneCoordinates,
          bounds: expandedBounds,
          face,
          id,
          renderGroupId,
          renderTile: tile,
        };
        addEntity(entity);
      });
    }
    return tile;
  }
 
  const gl = Z.getContext('webgl2');

  let projectionMatrix: ReadonlyMatrix4;
  
  let previousPosition: ReadonlyVector2 | undefined;
  let cameraZoom = 0;

  const onResize = () => {
    Z.width = Z.clientWidth;
    Z.height = Z.clientHeight;
    gl.viewport(0, 0, Z.clientWidth, Z.clientHeight);
    projectionMatrix = matrix4Multiply(
      matrix4Perspective(
        Math.PI/4,
        Z.clientWidth/Z.clientHeight,
        .1,
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
  gl.clearColor(...SKY, 1);

  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

  const program = gl.createProgram();
  if (program == null) {
    throw new Error();
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }
  gl.useProgram(program);

  const [
    aModelPosition,
    aModelRotationMatrix,
    aModelSmoothingRotationMatrix,
    aModelTexturePositionMatrix,
    aModelColor,
  ] = [
    A_VERTEX_MODEL_POSITION,
    A_VERTEX_MODEL_ROTATION_MATRIX,
    A_VERTEX_MODEL_SMOOTHING_ROTATION_MATRIX,
    A_MODEL_TEXTURE_POSITION_MATRIX,
    A_MODEL_COLOR,
  ].map(
    attribute => gl.getAttribLocation(program, attribute)
  );
  const [
    uWorldPositionMatrix,
    uWorldRotationMatrix,
    uProjectionMatrix,
    uCameraPosition,
    uMaterialTexture,
    uTime,
  ] = [
    U_WORLD_POSITION_MATRIX,
    U_WORLD_ROTATION_MATRIX,
    U_PROJECTION_MATRIX,
    U_CAMERA_POSITION,
    U_MATERIAL_TEXTURE,
    U_TIME,
  ].map(
    uniform => gl.getUniformLocation(program, uniform)
  );

  const fallbackTextures: Map<WebGLUniformLocation, number[]> = new Map([
    [uMaterialTexture, [TEXTURE_EMPTY]],
  ]);
  const allTextureUniforms = [...fallbackTextures.keys()];

  const models: Model[] = [];
  function appendModel(
    faces: readonly Face<PlaneMetadata>[],
    toModelPoint: (v: ReadonlyVector3, transform: ReadonlyMatrix4) => ReadonlyVector3,
    toSurfaceNormal: (face: Face<PlaneMetadata>, point: ReadonlyVector3) => ReadonlyVector3,
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

    const bounds = allPoints.reduce<[ReadonlyVector3, ReadonlyVector3]>(
      ([min, max], point) => {
        return [
          point.map((v, i) => Math.min(v, min[i])) as Vector3,
          point.map((v, i) => Math.max(v, max[i])) as Vector3,
        ];
      },
      [allPoints[0], allPoints[0]],
    );

    const [min, max] = bounds;
    const center = min.map((v, i) => (v + max[i])/2) as Vector3;
    const radius = bounds.reduce(
      (acc, point) => {
        return Math.max(
          acc,
          vectorNLength(vectorNScaleThenAdd(point, center)),
        );
      },
      0,
    );

    const [
      modelPoints,
      modelRotations,
      smoothingTransforms,
      modelTextureTransforms,
      colors,
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
      // colors
      ReadonlyVector4[],
      // indices
      number[],
    ]>(([
      modelPoints,
      modelRotations,
      smoothingTransforms,
      modelTextureTransforms,
      colors,
      indices,
    ], face) => {
      const {
        polygons,
        rotateToModelCoordinates,
        toModelCoordinates,
        t: {
          textureCoordinateTransform,
          color1,
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
          : matrix4Identity();
        return transform;
        //return matrix4Identity();
      });

      const newColors = modelPointsUnique.map(() => {
        return color1;
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
        [...colors, ...newColors],
        [...indices, ...newIndices],
      ];
    }, [[], [], [], [], [], []]);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
  
    ([
      [aModelPosition, modelPoints],
      [aModelRotationMatrix, modelRotations],
      [aModelSmoothingRotationMatrix, smoothingTransforms],
      [aModelTexturePositionMatrix, modelTextureTransforms],
      [aModelColor, colors],
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
      radius,
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
    cubeSmallModel,
    cubeBigModel,
  ] = ([
    [[skyCylinder, []]],
    [[cube, []]],
    [[cubeSmall, []]],
    [[cubeBig, []]],
  ] as Shape<PlaneMetadata>[][]).map((shapes, i) => {
    let modelShapeFaces = decompose(shapes);
    const modelPointCache: ReadonlyVector3[] = [];
    return appendModel(
      modelShapeFaces,
      (point, toModelCoordinates) => {
        const modelPoint = vector3TransformMatrix4(toModelCoordinates, ...point);
        const cachedModelPoint = modelPointCache.find(cachedPoint => {
          const d = vectorNLength(vectorNScaleThenAdd(cachedPoint, modelPoint, -1));
          return d < EPSILON * 9;
        });
        if (cachedModelPoint != null) {
          return cachedModelPoint;
        }
        modelPointCache.push(modelPoint);
        return modelPoint;
      }, 
      face => {
        // TODO smooth some models/planes
        return vector3TransformMatrix4(face.rotateToModelCoordinates, 0, 0, 1);
      },
    );
  });

  let textureId = gl.TEXTURE0;
  textureImages.forEach(image => {
    // need mipmap and non-mipmap versions of some textures (so we do all textures)
    new Array(2).fill(0).forEach((_, i) => {
      gl.activeTexture(textureId++);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      if (i) {
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // gl.texParameteri(
        //   gl.TEXTURE_2D,
        //   gl.TEXTURE_MAG_FILTER,
        //   gl.NEAREST,
        // );
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          gl.LINEAR,
        );
      }
    });
  });



  // add in the cube

  new Array(2).fill(0).forEach((_, i) => {
    const {
      id,
      faces,
      bounds,
      center,
      radius,
    } = cubeBigModel;
    const renderGroupId = nextRenderGroupId++;
    const cx = WORLD_DIMENSION/2 + i * 2;
    const cy = WORLD_DIMENSION/2;
    const position: Vector3 = [cx, cy, terrain(cx/WORLD_DIMENSION, cy/WORLD_DIMENSION)];

    faces.forEach(face => {
      const worldToPlaneCoordinates = matrix4Multiply(
        matrix4Invert(face.toModelCoordinates),
        matrix4Translate(...vectorNScale(position, -1)),
      );
      const rotateToPlaneCoordinates = matrix4Invert(face.rotateToModelCoordinates);
      const body: Part = {
        id: 0,
        centerOffset: center,
        centerRadius: radius,
        renderTransform: matrix4Identity(),
        modelId: id,
      };
      const entity: StaticEntity = {
        resolutionBodies: {
          [0]: body,
          [1]: body,
          [2]: body,
        },
        face,
        position,
        id: nextEntityId++,
        bounds,
        renderGroupId,
        rotateToPlaneCoordinates,
        worldToPlaneCoordinates,
      };
      addEntity(entity);
    });
  });


  const { 
    id,
    bounds,
    center,
    radius
  } = cubeModel;
  // add in a "player"
  const player: DynamicEntity<KnightPartIds> = {
    resolutionBodies: {
      [0]: {
        id: 0,
        modelId: id,
        renderTransform: matrix4Identity(),
        centerOffset: center,
        centerRadius: radius,
        textures: new Map([[uMaterialTexture, [TEXTURE_GRASS]]])
      },
    },
    bounds,
    partTransforms: {
      [MODEL_KNIGHT_BODY]: matrix4Identity(),
      [MODEL_KNIGHT_HEAD]: matrix4Identity(),
    },
    // collision radius must fit within the bounds, so the model render radius will almost certainly
    // be larger than that
    collisionRadius: rectNMinimalRadius(bounds) - EPSILON,
    id: nextEntityId++,
    position: [
      WORLD_DIMENSION*.5,
      WORLD_DIMENSION*.1,
      terrain(.5, .1) + radius,
    ],
    renderGroupId: nextRenderGroupId++,
    velocity: [0, 0, 0],
    gravity: DEFAULT_GRAVITY,
  };
  addEntity(player);

  //const modelFaces: Face[][] = groundFaces.flat(2).map(faces => [faces]);

  let playerHeadXRotation = 0;
  
  window.onmousedown = (e: MouseEvent) => previousPosition = [e.clientX, e.clientY];
  window.onmouseup = () => previousPosition = null;
  window.onmousemove = (e: MouseEvent) => {
    const currentPosition: ReadonlyVector2 = [e.clientX, e.clientY];
    if (previousPosition) {
      const delta = vectorNScaleThenAdd(currentPosition, previousPosition, -1);
      const rotation = vectorNLength(delta)/399;
      if (rotation > EPSILON) {
        const playerBodyRotationMatrix = player.partTransforms[MODEL_KNIGHT_BODY];
        player.partTransforms[MODEL_KNIGHT_BODY] = matrix4Multiply(
          playerBodyRotationMatrix,
          matrix4Rotate(
            -delta[0]/399,
            0,
            0,
            1,
          ),
        );
        playerHeadXRotation = Math.max(
          -Math.PI/6,
          Math.min(
            Math.PI/2,
            playerHeadXRotation + delta[1]/199,   
          ),
        ) 
        player.partTransforms[MODEL_KNIGHT_HEAD] = matrix4Rotate(
          playerHeadXRotation,
          1,
          0,
          0
        );
      }
      previousPosition = currentPosition;
    }
  };
  window.onclick = (e: MouseEvent) => {
    const {
      id,
      bounds,
      center,
      radius,
    } = cubeSmallModel;

    const velocity: Vector3 = vector3TransformMatrix4(
      matrix4Multiply(
        //player.partTransforms[MODEL_KNIGHT_HEAD],
        player.partTransforms[MODEL_KNIGHT_BODY],
      ),
      0,
      .01,
      0,
    );

    // fire a ball 
    const ball: DynamicEntity = {
      resolutionBodies: {
        [0]: {
          id: 0,
          modelId: id,
          centerOffset: center,
          centerRadius: radius,
          renderTransform: matrix4Identity(),
        },
      },
      bounds,
      id: nextEntityId++,
      collisionRadius: rectNMinimalRadius(bounds) - EPSILON,
      position: player.position,
      velocity,
      renderGroupId: nextRenderGroupId++,
      restitution: 1,
      //gravity: DEFAULT_GRAVITY,
    };

    addEntity(ball);
  };
  window.onwheel = (e: WheelEvent) => {
    const v = e.deltaY/999;
    // TODO 
    if (Math.abs(cameraZoom) < 1) {
      cameraZoom -= v;
    } else {
      if (v < 0 && cameraZoom > 0 || v > 0 && cameraZoom < 0) {
        cameraZoom /= Math.abs(v);
      } else {
        cameraZoom *= Math.abs(v);
      }  
    }
  };
  const inputs: Partial<Record<KeyCode, number>>= {};
  window.onkeydown = (e: KeyboardEvent) => {
    inputs[e.keyCode] = 1;
  };
  window.onkeyup = (e: KeyboardEvent) => {
    inputs[e.keyCode] = 0;
  };

  const lastFrameTimes: number[] = [];
  let then = 0;
  function animate(now: number) {
    const delta = now - then;
    then = now;
    const cappedDelta = 16;
    //const cappedDelta = Math.min(delta, 40);
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

    const targetUnrotatedLateralVelocity = CARDINAL_INPUT_VECTORS.reduce<ReadonlyVector2>((velocity, [keyCode, vector]) => {
      const multiplier = inputs[keyCode] || 0;
      return vectorNScaleThenAdd(velocity, vector, .001 * multiplier);
    }, [0, 0]);
    const targetLateralVelocity = vector3TransformMatrix4(
      player.partTransforms[MODEL_KNIGHT_BODY],
      ...vectorNScale(targetUnrotatedLateralVelocity, (inputs[INPUT_RUN] || 0)*5 + 1),
      0,
    );
    player.velocity[0] = targetLateralVelocity[0];
    player.velocity[1] = targetLateralVelocity[1];     
    player.velocity[2] = inputs[INPUT_JUMP] ? .001 : player.velocity[2];

    const cameraPositionMatrix = matrix4Translate(...player.position);
    const cameraPositionAndRotationMatrix = matrix4Multiply(
      cameraPositionMatrix,
      player.partTransforms[MODEL_KNIGHT_BODY],
      matrix4Invert(player.partTransforms[MODEL_KNIGHT_HEAD]),
      matrix4Translate(0, cameraZoom, 0),
    );
    const cameraPositionAndProjectionMatrix = matrix4Multiply(
      projectionMatrix,
      matrix4Invert(cameraPositionAndRotationMatrix),
    );
    const cameraPosition = vector3TransformMatrix4(cameraPositionAndRotationMatrix, 0, 0, 0);
    gl.uniformMatrix4fv(uProjectionMatrix, false, cameraPositionAndProjectionMatrix as any);
    gl.uniform3fv(uCameraPosition, cameraPosition);
    gl.uniform1f(uTime, now);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //
    // draw the sky cylinder
    //
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.uniform1i(uMaterialTexture, TEXTURE_SKYBOX_MIPMAP);
    //gl.uniform1i(uMaterialTexture, TEXTURE_GRASS);

    gl.bindVertexArray(skyCylinderModel.vao);
    gl.uniformMatrix4fv(
      uWorldPositionMatrix,
      false,
      matrix4Translate(...(player.position.slice(0, 2) as Vector2), 0) as any,
    );
    //gl.uniformMatrix4fv(uWorldPositionMatrix, false, matrix4Translate(WORLD_DIMENSION/2, 0, 0) as any);
    gl.uniformMatrix4fv(uWorldRotationMatrix, false, matrix4Identity() as any);
    gl.drawElements(gl.TRIANGLES, skyCylinderModel.indexCount, gl.UNSIGNED_SHORT, 0);  

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    //
    // end sky cylinder
    //

    // TODO don't iterate entire world (only do around player), render at lower LoD
    // further away
    const handledEntities: Record<EntityId, Truthy> = {};
    const renderedEntities: Record<RenderGroupId, Truthy> = {};
    const toRender: Record<ModelId, [ReadonlyMatrix4, ReadonlyMatrix4, Map<WebGLUniformLocation, number[]>][]> = {};

    // TODO get all the appropriate tiles at the correct resolutions for the entity
    const playerWorldPosition: Vector2 = vectorNScale(player.position, 1/WORLD_DIMENSION).slice(0, 2) as any;
    const offsets: ReadonlyVector2[] = [[0, 0], [0, 1], [1, 0], [1, 1]];
    const [tiles] = reversedWorld.reduce<[Set<Tile>, ReadonlyVector2[]]>(([tiles, cellsToCheck], _, reverseResolution) => {
      const scale = 1/Math.pow(2, reverseResolution + 1);
      const resolution = reversedWorld.length - reverseResolution - 1;
      // add in all the tiles within the bounds, but not in the view area
      //const gridScale = Math.pow(2, resolution);
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
        }
      });
      return [tiles, nextCellsToCheck];
    }, [new Set<Tile>(), offsets]);

    // const grid = world[0];
    // const tiles = grid.map((gridX, x) => gridX.map((_, y) => getOrCreateGridTile(x, y, 0))).flat(1);    

    // NOTE: we convert all forEaches to maps, so although set does support forEach, obfuscation will break
    [...tiles].forEach((tile) => {
      for (let entityId in tile.entities) {
        const entity: Entity = tile.entities[entityId];
        if (!handledEntities[entityId]) {
          handledEntities[entityId] = 1;
          const {
            bounds,
            renderGroupId: renderId,
            resolutionBodies,
            renderTile,
            partTransforms,
            face,
          } = entity;

          if (!face) {
  
            (entity as DynamicEntity).velocity[2] -= cappedDelta * ((entity as DynamicEntity).gravity || 0);
            entity.logs = entity.logs?.slice(-30) || [];
            removeEntity(entity);
            const collidedEntities: Record<EntityId, Truthy> = {};
            let duplicateCollisionCount = 1;
            // TODO enforce max speed
            let remainingCollisionTime = cappedDelta;
            let collisionCount = 0;
            while (remainingCollisionTime > EPSILON && collisionCount < MAX_COLLISIONS) {
              const {
                position,
                velocity,
                collisionRadius,
                restitution = 0,
              } = entity as DynamicEntity;

              const targetPosition = vectorNScaleThenAdd(position, velocity, remainingCollisionTime);
              const targetUnionBounds: ReadonlyRect3 = [
                velocity.map((v, i) => bounds[0][i] + Math.min(0, v) * remainingCollisionTime) as Vector3,
                velocity.map((v, i) => bounds[1][i] + Math.max(0, v) * remainingCollisionTime) as Vector3,
              ];
              const targetEntity = {
                position: targetPosition,
                bounds: targetUnionBounds,
                resolutionBodies: { 0: 1, 1: 1 },
              };
              let minCollisionTime = remainingCollisionTime;
              let minCollisionNormal: Vector3 | Falsey;
              let minCollisionEntity: Entity | Falsey;
              const checkedEntities: Record<EntityId, Truthy> = {};
              // update dynamic entity
              iterateEntityBounds(targetEntity, tile => {
                for (let checkEntityId in tile.entities) {
                  if (!checkedEntities[checkEntityId]) {
                    checkedEntities[checkEntityId] = 1;
                    let collisionTime: number | undefined;
                    let check = tile.entities[checkEntityId];
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

                      
                      if (rectNOverlaps(targetPosition, targetUnionBounds, checkPosition, checkBounds)) {
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
                            ? (collisionRadius - startPlanePositionZ)/planeVelocityZ
                            // start position z should be -ve
                            : (-startPlanePositionZ - collisionRadius)/planeVelocityZ;
                          const maxPlaneIntersectionTime = planeVelocityZ < 0
                            ? (collisionRadius + startPlanePositionZ)/-planeVelocityZ
                            : (collisionRadius - startPlanePositionZ)/planeVelocityZ;

                          // do they already overlap
                          if (FLAG_CHECK_STARTS_OVERLAPPING) {
                            let inside: Booleanish;
                            if (rectNOverlaps(position, bounds, checkPosition, checkBounds)) {
                              if (minPlaneIntersectionTime < 0 && minPlaneIntersectionTime > collisionRadius*2/planeVelocityZ) {
                                if (vector2PolygonsContain(polygons, ...startPlanePosition)) {
                                  inside = 1;
                                  if (FLAG_DEBUG_PHYSICS) {
                                    entity.logs.push(['inside center']);
                                  }
                                } else {
                                  const startIntersectionRadius = Math.sqrt(
                                    collisionRadius * collisionRadius - startPlanePositionZ * startPlanePositionZ
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
                                        entity.logs.push(['inside edge', Math.sqrt(distanceSquared), startIntersectionRadius, collisionRadius]);
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
                                    collisionRadius * collisionRadius - testPlanePositionZ * testPlanePositionZ
                                  );
                                  const closestPoint = vector2PolygonsEdgeOverlapsCircle(
                                    polygons,
                                    testPlanePosition,
                                    testIntersectionRadius,
                                  );
                                  if (closestPoint) {
                                    const [dx, dy] = vectorNScaleThenAdd(closestPoint, testPlanePosition, -1);
                                    let rsq = dx * dx + dy * dy + testPlanePositionZ * testPlanePositionZ;
                                    if (rsq < collisionRadius * collisionRadius) {
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
                      // TODO some basic dynamic, sphere collision
                    }
                  }
                }
              }, 1);
              if (minCollisionNormal) {
                const minCollisionEntityId = (minCollisionEntity as Entity).id;
                if (collidedEntities[minCollisionEntityId]) {
                  duplicateCollisionCount++;
                }
                collidedEntities[minCollisionEntityId] = 1;

                const boundedCollisionTime = Math.max(0, minCollisionTime - EPSILON);

                if (FLAG_DEBUG_PHYSICS) {
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
                const inverseFriction = 1;

                entity.position = vectorNScaleThenAdd(
                  entity.position,
                  velocity,
                  boundedCollisionTime,
                );


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
            addEntity(entity);
          }
          const body = resolutionBodies[tile.resolution]
          const modelId = body?.modelId;
          if (!renderedEntities[renderId] && modelId != null && (!renderTile || tiles.has(renderTile)) ) {
            renderedEntities[renderId] = 1;
            let render = toRender[modelId];
            if (render == null) {
              render = [];
              toRender[modelId] = render;
            }
            const position = matrix4Multiply(
              // TODO maybe just pass in position as a vec3
              matrix4Translate(...entity.position),
              // TODO render transform
              //renderTransform,
              // drop the render down a bit for each resolution to hide edges
              //matrix4Translate(0, 0, -Math.pow(resolution, 2)/30),
            );
            const rotation = partTransforms?.[0] || matrix4Identity();
            render.push([position, rotation, body.textures]);
          }
  
        }
      }
    });

    models.forEach(({ vao, indexCount }, modelId) => {
      const renders = toRender[modelId];
      if (renders) {
        gl.bindVertexArray(vao);
        renders.forEach(([position, rotation, textures]) => {
          gl.uniformMatrix4fv(uWorldPositionMatrix, false, position as any);
          gl.uniformMatrix4fv(uWorldRotationMatrix, false, rotation as any);
          allTextureUniforms.forEach(uniform => {
            const textureIds = textures?.get(uniform) || fallbackTextures.get(uniform);
            gl.uniform1iv(uniform, textureIds);
          });
          gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
        });  
      }
    });

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