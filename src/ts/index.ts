
const U_WORLD_POSITION_MATRIX = 'uWorldPosition';
const U_WORLD_ROTATION_MATRIX = 'uWorldRotation';
const U_PROJECTION_MATRIX = 'uProjection';

const A_VERTEX_MODEL_POSITION = "aVertexModelPosition";
const A_VERTEX_MODEL_ROTATION_MATRIX = 'aVertexModelRotation';
const A_VERTEX_MODEL_SMOOTHING_ROTATION_MATRIX = 'aVertexModelSmoothingRotation';
const A_MODEL_COLOR = 'aColor';

const V_MODEL_POSITION = 'vModelPosition';
const V_WORLD_POSITION = 'vWorldPosition';
const V_WORLD_NORMAL = 'vWorldNormal';
const V_MODEL_ROTATION_MATRIX = 'vModelRotation';
const V_VERTEX_MODEL_SMOOTHING_ROTATION_MATRIX = 'vModelSmoothingRotation';
const V_MODEL_COLOR = 'vColor';

const O_COLOR = "oColor";

const VERTEX_SHADER = `#version 300 es
  precision lowp float;

  in vec4 ${A_VERTEX_MODEL_POSITION};
  in mat4 ${A_VERTEX_MODEL_ROTATION_MATRIX};
  in mat4 ${A_VERTEX_MODEL_SMOOTHING_ROTATION_MATRIX};
  in vec3 ${A_MODEL_COLOR};

  uniform mat4 ${U_WORLD_POSITION_MATRIX};
  uniform mat4 ${U_WORLD_ROTATION_MATRIX};
  uniform mat4 ${U_PROJECTION_MATRIX};
  
  out vec4 ${V_WORLD_POSITION};
  out vec4 ${V_MODEL_POSITION};
  out vec4 ${V_WORLD_NORMAL};
  out mat4 ${V_MODEL_ROTATION_MATRIX};
  out mat4 ${V_VERTEX_MODEL_SMOOTHING_ROTATION_MATRIX};
  out vec3 ${V_MODEL_COLOR};

  void main(void) {
    ${V_MODEL_POSITION} = ${A_VERTEX_MODEL_POSITION};
    ${V_WORLD_POSITION} = ${U_WORLD_POSITION_MATRIX} * ${U_WORLD_ROTATION_MATRIX} * ${A_VERTEX_MODEL_POSITION};
    ${V_WORLD_NORMAL} = ${U_WORLD_ROTATION_MATRIX} * ${A_VERTEX_MODEL_ROTATION_MATRIX} * vec4(0., 0., 1., 1.);
    ${V_MODEL_ROTATION_MATRIX} = ${A_VERTEX_MODEL_ROTATION_MATRIX};
    ${V_VERTEX_MODEL_SMOOTHING_ROTATION_MATRIX} = ${A_VERTEX_MODEL_SMOOTHING_ROTATION_MATRIX};
    ${V_MODEL_COLOR} = ${A_MODEL_COLOR};

    gl_Position = ${U_PROJECTION_MATRIX} * ${V_WORLD_POSITION};
  }
`;

const FRAGMENT_SHADER = `#version 300 es
  precision lowp float;

  in vec4 ${V_WORLD_POSITION};
  in vec4 ${V_MODEL_POSITION};
  in vec4 ${V_WORLD_NORMAL};
  in mat4 ${V_MODEL_ROTATION_MATRIX};
  in mat4 ${V_VERTEX_MODEL_SMOOTHING_ROTATION_MATRIX};
  in vec3 ${V_MODEL_COLOR};

  uniform mat4 ${U_WORLD_ROTATION_MATRIX};

  out vec4 ${O_COLOR};

  void main(void) {
    vec3 n = normalize(${U_WORLD_ROTATION_MATRIX} * ${V_MODEL_ROTATION_MATRIX} * ${V_VERTEX_MODEL_SMOOTHING_ROTATION_MATRIX} * vec4(0, 0, 1, 1)).xyz;

    ${O_COLOR} = vec4(${V_MODEL_COLOR} * vec3((dot(n, vec3(-.5, -.5, .7)) + 1.) / 2.), 1);
  }
`;

// // generate some ground
const baseGroundDepths = [
  [0., 0., 0., 0., 0., 0., 0.],
  [0., 4., .2, .2, 1., 0., 0.],
  [0., .3, 0., 0., .4, 0., 0.],
  [0., .3, 0., 0., .4, 0., 0.],
  [0., .3, 0., 1., .4, 0., 0.],
  [0., .3, 1., 2., 3., 0., 0.],
  [0., 0., 0., 0., 0., 0., 0.],
];
// const baseGroundDepths = [
//   [.5, .4, .3, .2, .1, .0],
//   [.4, .3, .2, .1, .0, .0],
//   [.3, .2, .1, .0, .0, .0],
//   [.2, .1, .0, .0, .0, .0],
//   [.1, .0, .0, .0, .4, .4],
//   [.0, .0, .4, .4, .4, .4],
//   [.0, .0, .4, .4, .4, .4],
//   [.0, .0, .4, .4, .4, .4],
// ];
// const baseGroundDepths = [
//   [.0, .0, .0, .0, .0, .0],
//   [.0, .0, .0, .0, .0, .0],
//   [.0, .0, .0, .0, .0, .0],
//   [.0, .0, .0, .0, .0, .0],
//   [.0, .0, .0, .0, .0, .0],
//   [.0, .0, .0, .0, .0, .0],
//   [.0, .0, .0, .0, .0, .0],
//   [.0, .0, .0, .0, .0, .0],
// ];

window.onload = async () => {

  // frame
  const shape1: ConvexShape = [
    //toPlane(0, 0, 1, 1),
    toPlane(0, 0, -1, 2),
    toPlane(1, 0, 1, 2),
    toPlane(-1, 0, 1, 2),
    toPlane(1, 0, 0, 2),
    toPlane(-1, 0, 0, 2),
    toPlane(0, 1, 0, 2),
    toPlane(0, -1, 0, 2),
  ];

  // windows
  const shape2: ConvexShape = [
    toPlane(1, 0, 0, 1.2),
    toPlane(-1, 0, 0, 1.2),
    toPlane(0, 1, 0, 0),
    toPlane(0, -1, 0, .5),
    toPlane(0, 0, 1, .3),
    toPlane(0, 0, -1, .3),
  ];

  // door
  const shape3: ConvexShape = [
    toPlane(1, 0, 0, .2),
    toPlane(-1, 0, 0, .2),
    toPlane(0, 1, 0, 0),
    toPlane(0, -1, 0, .8),
    toPlane(0, 0, 1, 0.8),
    toPlane(0, 0, -1, 1.3),
  ];

  // interior
  const shape4: ConvexShape = [
    toPlane(0, 0, 1, .8),
    toPlane(0, 0, -1, .8),
    toPlane(1, 1, 0, .8),
    toPlane(-1, 1, 0, .8),
    toPlane(1, 0, 0, .8),
    toPlane(-1, 0, 0, .8),
    //toPlane(0, 1, 0, .8),
    toPlane(0, -1, 0, .8),
  ];

  // chimney
  const shape5: ConvexShape = [
    toPlane(1, 0, 0, .4),
    toPlane(-1, 0, 0, .4),
    toPlane(0, 1, 0, 1.8),
    toPlane(0, -1, 0, .8),
    toPlane(0, 0, 1, 1),
    //toPlane(0, 0, 1, 2),
    toPlane(0, 0, -1, -.2),
  ];
  
  // chimney hole
  const shape6: ConvexShape = [
    toPlane(1, 0, 0, .2),
    toPlane(-1, 0, 0, .2),
    toPlane(0, 1, 0, 1.9),
    toPlane(0, -1, 0, 1.1),
    toPlane(0, 0, 1, .8),
    toPlane(0, 0, -1, -.4),
  ];

  // cube
  const cube: ConvexShape = [
    toPlane(0, 0, 1, .1),
    toPlane(0, 0, -1, .1),
    toPlane(1, 0, 0, .1),
    toPlane(-1, 0, 0, .1),
    toPlane(0, 1, 0, .1),
    toPlane(0, -1, 0, .1),
  ];

  const cubeSmall: ConvexShape = [
    toPlane(0, 0, 1, .01),
    toPlane(0, 0, -1, .01),
    toPlane(1, 0, 0, .01),
    toPlane(-1, 0, 0, .01),
    toPlane(0, 1, 0, .01),
    toPlane(0, -1, 0, .01),
  ];

  const cubeBig: ConvexShape = [
    toPlane(0, 0, 1, 1),
    toPlane(0, 0, -1, 1),
    toPlane(1, 0, 0, 1),
    toPlane(-1, 0, 0, 1),
    toPlane(0, 1, 0, 1),
    toPlane(0, -1, 0, 1),
  ];

  // const shapes: readonly Shape[] = ([
  //   [shape5, [shape6]],
  //   [shape1, [shape2, shape3, shape4, shape6]],
  // ] as const);
  const modelShapes: Shape[][] = [
    [[cube, []]],
    [[cubeSmall, []]],
    [[cubeBig, []]],
  ];

  const modelShapesFaces = modelShapes.map(shapes => decompose(shapes));
  console.log(modelShapesFaces);

  const terrain = weightedAverageTerrainFactory(baseGroundDepths, 1.2, .5);

  const resolutions = 8;
  const worldDimension = Math.pow(2, resolutions);
  // TODO if this is 1, we can get rid of it
  // That said, it probably shouldn't be 1 as we want more detail on each tile
  const worldTerrainScale = 1;

  const world: World = new Array(resolutions).fill(0).map((_, resolution) => {
    const resolutionDimension = Math.pow(2, resolutions - resolution);
    return create2DArray<Tile | Falsey>(
      resolutionDimension,
      resolutionDimension,
      () => 0,
    );
  });
  const reversedWorld = [...world].reverse();

  function iterateEntityBounds(
    resolution: number,
    { position, bounds: [[minx, miny], [maxx, maxy]] }: Pick<Entity, 'position' | 'bounds'>,
    f: (tile: Tile, x: number, y: number) => void,
  ) {
    const divisor = Math.pow(2, resolution);
    const resolutionDimension = Math.pow(2, resolutions - resolution);
    const [px, py] = position;
    for (
      let x = Math.max(0, (px + minx)/divisor | 0);
      x < Math.min(resolutionDimension, (px + maxx)/divisor);
      x++
    ) {
      for (
        let y = Math.max(0, (py + miny)/divisor | 0);
        y < Math.min(resolutionDimension, (py + maxy)/divisor);
        y++
      ) {
        const tile = getOrCreateGridTile(x, y, resolution);
        f(tile, x, y);
      }
    }
  }
  
  function addEntity(resolution: number, entity: Entity) {
    iterateEntityBounds(resolution, entity, tile => {
      tile[entity.id] = entity;
    });
  }
  
  function removeEntity(resolution: number, entity: Entity) {
    iterateEntityBounds(resolution, entity, tile => {
      delete tile[entity.id];
    });
  }
  

  const groundPointCache: Record<number, Record<number, ReadonlyVector3>> = {};
  function getOrCreateGridTile(tx: number, ty: number, resolution: number): Tile {
    const grid = world[resolution];
    const resolutionScale = Math.pow(2, resolution);
    const resolutionDimension = Math.pow(2, resolutions - resolution - 1);
    let tile = grid[tx][ty];
    const gx = tx * resolutionScale;
    const gy = ty * resolutionScale;
    if (!tile) {
      tile = {};
      grid[tx][ty] = tile;
      // generate terrain
      const groundDepths = create2DArray(worldTerrainScale+1, worldTerrainScale+1, (ix, iy) =>{
        const terrainX = (tx + ix/worldTerrainScale) / resolutionDimension;
        const terrainY = (ty + iy/worldTerrainScale) / resolutionDimension;
        return terrain(terrainX, terrainY);
      });
      const groundFaces = groundDepths.slice(0, -1).map(
        (groundDepthsX, x) => {
          return groundDepthsX.slice(0, -1).map<[Face, Face]>(
            (z00, y) => {
              const z10 = groundDepths[x+1][y];
              const z01 = groundDepths[x][y+1];
              const z11 = groundDepths[x+1][y+1];
              
              const params: [[ReadonlyVector3, ReadonlyVector3, ReadonlyVector3], [ReadonlyVector3, ReadonlyVector3, ReadonlyVector3]] = 
                (x+y) % 2
                ? [
                  [[x, y, z00], [x+1, y, z10], [x+1, y+1, z11]],
                  [[x, y, z00], [x+1, y+1, z11], [x, y+1, z01]],
                ]
                : [
                  [[x, y+1, z01], [x, y, z00], [x+1, y, z10]],
                  [[x, y+1, z01], [x+1, y, z10], [x+1, y+1, z11]],
                ];
              return params.map(points => {
                const scaledPoints = points.map(
                  point => vectorNScaleThenAdd(
                    vectorNMultiply(
                      point,
                      [
                        resolutionScale/worldTerrainScale,
                        resolutionScale/worldTerrainScale,
                        1,
                      ],
                    ),
                    [gx, gy, 0],
                  ),
                ) as [ReadonlyVector3, ReadonlyVector3, ReadonlyVector3];
                return toFace(...scaledPoints);
              }) as [Face, Face];
            },
          );
        },
      ).flat(2);
      const resolutionColors: Vector3[] = [
        [.8, .8, 1],
        [.8, 1, .8],
        [1, .8, .8],
        [1, .9, 1],
        [1, 1, .9],
        [.9, 1, 1],
      ];
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
          const [x, y] = vectorNScale(uncachedResult, worldTerrainScale);
          const ix = x + .1 | 0;
          const iy = y + .1 | 0;
          const xGroundPointCache = groundPointCache[ix] || {};
          groundPointCache[ix] = xGroundPointCache;
          const cachedResult = xGroundPointCache[iy] || uncachedResult;
          xGroundPointCache[iy] = cachedResult;
          return cachedResult;
        },
        (_, groundPoint) => {
          // get some samples
          const offsets: ReadonlyVector2[] = [[-EPSILON, 0], [EPSILON, -EPSILON], [EPSILON, EPSILON]];
          // const offsets: ReadonlyVector2[] = [
          //   [-1/(worldWidth * worldTerrainScale), 0],
          //   [1/(worldWidth * worldTerrainScale), -1/(worldHeight * worldTerrainScale)],
          //   [1/(worldWidth * worldTerrainScale), 1/(worldHeight * worldTerrainScale)],
          // ];
          const [p0, p1, p2] = offsets.map<Vector3>(offset => {
            const point = vectorNScaleThenAdd(offset, groundPoint, 1/worldDimension);
            
            return [
              ...point,
              // this division appears to be right... but why?
              terrain(...point)/worldDimension,
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
        resolutionColors[resolution % resolutionColors.length],
      );
      const renderGroupId = nextRenderGroupId++;
      faces.forEach(face => {
        const id = nextEntityId++;

        // Note: we use the model bounds here as they will be about the same
        // for terrain tiles, at least for x/y axis
        const worldToPlaneCoordinates = matrix4Invert(face.toModelCoordinates);
        const rotateToPlaneCoordinates = matrix4Invert(face.rotateToModelCoordinates);
        // if the resolution > 0 we are only using this for rendering, so make sure the bounds fit within the
        // current tile
        const fittedBounds: ReadonlyRect3 = resolution
          ? [
            [gx + EPSILON, gy + EPSILON, bounds[0][2]],
            [gx + resolutionScale - EPSILON, gy + resolutionScale - EPSILON, bounds[1][2]],
          ]
          : bounds;

        const entity: StaticEntity = {
          body: {
            // terrain is always at position 0, so offset == center
            id: 0,
            centerOffset: center,
            centerRadius: radius,
            modelId,
            renderTransform: matrix4Identity(),
          },
          position: [0, 0, 0],
          worldToPlaneCoordinates,
          rotateToPlaneCoordinates,
          bounds: fittedBounds,
          face,
          id,
          renderGroupId,
        };
        addEntity(resolution, entity);
      });
    }
    return tile as Tile;
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
        999,
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
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(.1, .1, .1, 1);
  gl.enable(gl.CULL_FACE);

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
    aModelColor,
  ] = [
    A_VERTEX_MODEL_POSITION,
    A_VERTEX_MODEL_ROTATION_MATRIX,
    A_VERTEX_MODEL_SMOOTHING_ROTATION_MATRIX,
    A_MODEL_COLOR,
  ].map(
    attribute => gl.getAttribLocation(program, attribute)
  );
  const [
    uWorldPositionMatrix,
    uWorldRotationMatrix,
    uProjectionMatrix,
  ] = [
    U_WORLD_POSITION_MATRIX,
    U_WORLD_ROTATION_MATRIX,
    U_PROJECTION_MATRIX,
  ].map(
    uniform => gl.getUniformLocation(program, uniform)
  );

  const models: Model[] = [];
  function appendModel(
    faces: readonly Face[],
    toModelPoint: (v: ReadonlyVector3, transform: ReadonlyMatrix4) => ReadonlyVector3,
    toSurfaceNormal: (face: Face, point: ReadonlyVector3) => ReadonlyVector3,
    color: ReadonlyVector3,
  ): Model & { id: number } {
    const groupPointsToFaces = new Map<ReadonlyVector3, Set<Face>>();

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
      planeTransforms,
      smoothingTransforms,
      colors,
      indices,
    ] = faces.reduce<[
      // model positions
      ReadonlyVector3[],
      // plane transformation
      ReadonlyMatrix4[],
      // smoothing transformation
      ReadonlyMatrix4[],
      // colors
      ReadonlyVector3[],
      // indices
      number[],
    ]>(([modelPoints, planeTransforms, smoothingTransforms, colors, indices], face) => {
      const {
        polygons,
        rotateToModelCoordinates,
        toModelCoordinates,
      } = face;
      const rotateFromModelCoordinates = matrix4Invert(rotateToModelCoordinates);
  
      const polygonPoints = polygons.flat(1);
      const modelPointsSet = polygonPoints.reduce((acc, point) => {
        return acc.add(toModelPoint(point, toModelCoordinates));
      }, new Set<ReadonlyVector3>());
      const modelPointsUnique = [...modelPointsSet];

      const newPlaneTransforms = new Array<ReadonlyMatrix4>(modelPointsUnique.length)
        .fill(rotateToModelCoordinates);

      const newSmoothingTransforms = modelPointsUnique.map(modelPoint => {
        const normal = toSurfaceNormal(face, modelPoint);
        // TODO, pass in the smoothing function
        // const faces = groupPointsToFaces.get(worldPoint);
        // const combined = [...faces].reduce<ReadonlyVector3>((acc, {
        //   rotateToModelCoordinates,
        // }) => {
        //   const faceNormal = vector3TransformMatrix4(rotateToModelCoordinates, 0, 0, 1);
        //   return vectorNScaleThenAdd(acc, faceNormal);
        // }, [0, 0, 0]);
        // const normal = vectorNNormalize(combined);
        // // rotate the normal back to the face coordinates
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
        return matrix4Identity();
      });

      const newColors = modelPointsUnique.map(() => {
        return color;
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
        [...planeTransforms, ...newPlaneTransforms],
        [...smoothingTransforms, ...newSmoothingTransforms],
        [...colors, ...newColors],
        [...indices, ...newIndices],
      ];
    }, [[], [], [], [], []]);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
  
    ([
      [aModelPosition, modelPoints],
      [aModelRotationMatrix, planeTransforms],
      [aModelSmoothingRotationMatrix, smoothingTransforms],
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

    const model = {
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


  modelShapesFaces.map(modelShapeFaces => {
    const modelPointCache: ReadonlyVector3[] = [];
    appendModel(
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
      [1, 1, 1],
    );
  });

  console.log('models', models);

  // add in the cube

  const cubeModelId = 2;
  const cubeModel = models[cubeModelId];
  new Array(2).fill(0).forEach((_, i, arr) => {
    const {
      faces,
      bounds,
      center,
      radius,
    } = cubeModel;
    const renderGroupId = nextRenderGroupId++;

    faces.forEach(face => {
      const position: Vector3 = [worldDimension/2 + (i - arr.length/2) * 3, worldDimension/2, 0];
      const worldToPlaneCoordinates = matrix4Multiply(
        matrix4Invert(face.toModelCoordinates),
        matrix4Translate(...vectorNScale(position, -1)),
      );
      const rotateToPlaneCoordinates = matrix4Invert(face.rotateToModelCoordinates);
      const entity: StaticEntity = {
        body: {
          id: 0,
          centerOffset: center,
          centerRadius: radius,
          renderTransform: matrix4Identity(),
          modelId: cubeModelId,
        },
        face,
        position,
        id: nextEntityId++,
        bounds,
        renderGroupId,
        rotateToPlaneCoordinates,
        worldToPlaneCoordinates,
      };
      addEntity(0, entity);
    });
  });


  const modelId = 0;
  const { 
    bounds,
    center,
    radius
  } = models[modelId];
  // add in a "player"
  const player: DynamicEntity<KnightPartIds> = {
    body: {
      id: 0,
      modelId,
      renderTransform: matrix4Identity(),
      centerOffset: center,
      centerRadius: radius,
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
      worldDimension/2,
      worldDimension/2,
      4,
    ],
    renderGroupId: nextRenderGroupId++,
    velocity: [0, 0, 0],
    gravity: DEFAULT_GRAVITY,
  };
  addEntity(0, player);

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
    const modelId = 1;
    const {
      bounds,
      center,
      radius,
    } = models[modelId];

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
      body: {
        id: 0,
        modelId,
        centerOffset: center,
        centerRadius: radius,
        renderTransform: matrix4Identity(),
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

    addEntity(0, ball);
  };
  window.onwheel = (e: WheelEvent) => {
    const v = e.deltaY/100;
    // TODO 
    cameraZoom -= v;
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
    lastFrameTimes.push(delta);
    //const cappedDelta = Math.min(delta, 40);
    const cappedDelta = 16;
    const recentFrameTimes = lastFrameTimes.slice(-30);
    const spf = recentFrameTimes.reduce((acc, n) => {
      return acc + n/recentFrameTimes.length;
    }, 0);
    if (spf > 0 && fps) {
      fps.innerText = `${Math.round(1000/spf)}`;
    }

    const targetUnrotatedLateralVelocity = CARDINAL_INPUT_VECTORS.reduce<ReadonlyVector2>((velocity, [keyCode, vector]) => {
      const multiplier = inputs[keyCode] || 0;
      return vectorNScaleThenAdd(velocity, vector, .001 * multiplier);
    }, [0, 0]);
    const targetLateralVelocity = vector3TransformMatrix4(
      player.partTransforms[MODEL_KNIGHT_BODY],
      ...targetUnrotatedLateralVelocity,
      0,
    );
    player.velocity[0] = targetLateralVelocity[0];
    player.velocity[1] = targetLateralVelocity[1];     
    player.velocity[2] = inputs[INPUT_JUMP] ? .001 : player.velocity[2];

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const cameraPositionAndProjectionMatrix = matrix4Multiply(
      projectionMatrix,
      matrix4Translate(0, -cameraZoom, 0),
      player.partTransforms[MODEL_KNIGHT_HEAD],
      matrix4Invert(player.partTransforms[MODEL_KNIGHT_BODY]),
      matrix4Translate(...vectorNScale(player.position, -1)),
    );
    gl.uniformMatrix4fv(uProjectionMatrix, false, cameraPositionAndProjectionMatrix as any);
  
    // TODO don't iterate entire world (only do around player), render at lower LoD
    // further away
    const handledEntities: Record<EntityId, Truthy> = {};
    const renderedEntities: Record<RenderGroupId, Truthy> = {};
    const toRender: Record<ModelId, [ReadonlyMatrix4, ReadonlyMatrix4][]> = {};

    // TODO get all the appropriate tiles at the correct resolutions for the entity
    const playerWorldPosition: Vector2 = vectorNScale(player.position, 1/worldDimension).slice(0, 2) as any;
    const offsets: ReadonlyVector2[] = [[0, 0], [0, 1], [1, 0], [1, 1]];
    const [tiles] = reversedWorld.reduce<[[Tile, number][], ReadonlyVector2[]]>(([tiles, cellsToCheck], _, reverseResolution) => {
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
        //const minResolution = Math.pow(Math.max(0, distance), .9) * resolutions * 2;
        const minResolution = distance * resolutions;
        if (resolution > minResolution && resolution) {
          nextCellsToCheck.push(
            ...offsets.map(offset => vectorNScaleThenAdd(vectorNScale(cell, 2), offset)),
          );
        } else {
          tiles.push([getOrCreateGridTile(gridX | 0, gridY | 0, resolution), resolution]);
        }
      });
      return [tiles, nextCellsToCheck];
    }, [[], offsets]);

    // const grid = world[0];
    // const tiles = grid.map((gridX, x) => gridX.map((_, y) => getOrCreateGridTile(x, y, 0))).flat(1);    

    tiles.forEach(([tile, resolution]) => {
      for (let entityId in tile) {
        if (!handledEntities[entityId]) {
          handledEntities[entityId] = 1;

          const entity = tile[entityId];
          const {
            body: { renderTransform },
            partTransforms,
            bounds,
            renderGroupId: renderId,
          } = entity;
          if (!entity.face) {
            (entity as DynamicEntity).velocity[2] -= cappedDelta * ((entity as DynamicEntity).gravity || 0);

            removeEntity(0, entity);
            // TODO enforce max speed
            let remainingCollisionTime = cappedDelta;
            let count = 0;
            while (remainingCollisionTime > EPSILON) {
              const {
                position,
                velocity,
                collisionRadius,
                restitution = 0,
              } = entity as DynamicEntity;

              const targetPosition = vectorNScaleThenAdd(position, velocity, remainingCollisionTime);
              const targetUnionBounds = rectNExpand(bounds, targetPosition);
              // const targetUnionBounds: ReadonlyRect3 = [
              //   velocity.map((v, i) => bounds[0][i] + Math.min(0, v) * remainingCollisionTime) as Vector3,
              //   velocity.map((v, i) => bounds[1][i] + Math.max(0, v) * remainingCollisionTime) as Vector3,
              // ];
              const targetEntity = {
                position: targetPosition,
                bounds: targetUnionBounds,
              };
              let minCollisionTime = remainingCollisionTime;
              let minCollisionNormal: Vector3 | Falsey;
              let minCollisionEntity: Entity | Falsey;
              const checkedEntities: Record<EntityId, Truthy> = {};
              // update dynamic entity
              iterateEntityBounds(0, targetEntity, tile => {
                for (let checkEntityId in tile) {
                  if (!checkedEntities[checkEntityId]) {

                    checkedEntities[checkEntityId] = 1;
                    let collisionTime: number | undefined;
                    let check = tile[checkEntityId];
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
                        if (planeVelocityZ >= 0) {
                          // TODO is this right?
                          // it's not right
                          // it might be right
                          // it's right
                          // TODO don't use continue
                          continue;
                        }
                        
                        // TODO need to also calculate intersections from below for edge handling
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
                          : -(collisionRadius + startPlanePositionZ)/planeVelocityZ;
                        const maxPlaneIntersectionTime = planeVelocityZ < 0
                          ? -(collisionRadius + startPlanePositionZ)/planeVelocityZ
                          : (collisionRadius - startPlanePositionZ)/planeVelocityZ;

                        if (
                          minPlaneIntersectionTime <= remainingCollisionTime
                          && maxPlaneIntersectionTime >= remainingCollisionTime
                        ) {

                          // do they already overlap
                          if (FLAG_CHECK_STARTS_OVERLAPPING) {
                            if (rectNOverlaps(position, bounds, checkPosition, checkBounds)) {
                              if (minPlaneIntersectionTime < 0 && minPlaneIntersectionTime > collisionRadius/planeVelocityZ) {
                                if (vector2PolygonsContain(polygons, ...startPlanePosition)) {
                                  console.log('started inside');
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
                                    let rsq = dx * dx + dy * dy + startPlanePositionZ * startPlanePositionZ;
                                    if (rsq < collisionRadius * collisionRadius) {
                                      console.log('started inside (edge)');
                                    }
                                  }
                                }
                              }
                            }
                          } 


                          const intersectionPlanePosition = vectorNScaleThenAdd(
                            startPlanePosition,
                            planeVelocity,
                            minPlaneIntersectionTime,
                          );
                          if (
                            planeVelocityZ < 0
                            && minPlaneIntersectionTime > EPSILON
                            && vector2PolygonsContain(polygons, ...intersectionPlanePosition)
                            && FLAG_QUICK_COLLISIONS
                          ) {
                            collisionTime = minPlaneIntersectionTime; 
                            planeCollisionNormal = NORMAL_Z;
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
                            let minTime = minPlaneIntersectionTime;
                            let maxTime = remainingCollisionTime;
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
                              // don't allow it to bounce deeper into the plane
                              const cosa = vectorNDotProduct(planeCollisionNormal, NORMAL_Z);
                              const a = Math.acos(cosa);
                              const axis = a > EPSILON
                                ? vectorNNormalize(vector3CrossProduct(planeCollisionNormal, NORMAL_Z))
                                : NORMAL_X;
                              const matrix = matrix4Rotate(a, ...axis);
                              const v = vector3TransformMatrix4(matrix, ...planeVelocity);
                              if (v[2] < 0) {
                                collisionTime = minTime;
                              } else {
                                planeCollisionNormal = 0;
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
              });
              if (minCollisionNormal) {
                const boundedCollisionTime = Math.max(0, minCollisionTime - EPSILON);

                // console.log(
                //   'collision',
                //   count,
                //   (minCollisionEntity as Entity).id,
                //   minCollisionTime,
                //   remainingCollisionTime,
                //   minCollisionNormal,

                // );
                // console.log('  velocity b', vectorNLength(velocity), velocity);
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
                const matrix = matrix4Rotate(a, ...axis);
                const inverse = matrix4Invert(matrix);
                const v = vector3TransformMatrix4(matrix, ...velocity);
                // console.log('  velocity i', vectorNLength(v), v);
                const outputV = vectorNMultiply(v, [
                  inverseFriction,
                  inverseFriction,
                  // bounce it out, want the restitution to increase to 1 (or more!) as we
                  // keep colliding so we don't end up in a degenerate state
                  -(restitution + (1 - restitution) * Math.pow(count/(MAX_COLLISIONS - 2), 2)),
                ]);
                // console.log('  velocity s', vectorNLength(v), v);
                (entity as DynamicEntity).velocity = vector3TransformMatrix4(inverse, ...outputV);
                // console.log('  velocity a', vectorNLength((entity as DynamicEntity).velocity), (entity as DynamicEntity).velocity);
                
                remainingCollisionTime -= boundedCollisionTime;
              } else {
                entity.position = vectorNScaleThenAdd(
                  entity.position,
                  velocity,
                  remainingCollisionTime,
                );
                remainingCollisionTime = 0;
              }
              count++;
              if (count > MAX_COLLISIONS) {
                console.log('too many collisions');
                break;
              }  
            }
            addEntity(0, entity);
          }

          const modelId = entity.body.modelId;
          if (!renderedEntities[renderId] && modelId != null) {
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
              matrix4Translate(0, 0, -Math.pow(resolution, 2)/30),
            );
            const rotation = partTransforms?.[entity.body.id] || matrix4Identity();
            render.push([position, rotation]);
          }
        }
      }
    });

    models.forEach(({ vao, indexCount }, modelId) => {
      const renders = toRender[modelId];
      if (renders) {
        gl.bindVertexArray(vao);
        renders.forEach(([position, rotation]) => {
          gl.uniformMatrix4fv(uWorldPositionMatrix, false, position as any);
          gl.uniformMatrix4fv(uWorldRotationMatrix, false, rotation as any);
          gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);  
        });  
      }
    });

    requestAnimationFrame(animate);
  }
  animate(0);
}


function rotateOnAxis(normal: ReadonlyVector3, velocity: ReadonlyVector3): Vector3 {
  const cosa = vectorNDotProduct(normal, NORMAL_Z);
  const a = Math.acos(cosa);
  const axis = a > EPSILON
    ? vectorNNormalize(vector3CrossProduct(normal, NORMAL_Z))
    : NORMAL_X;
  const matrix = matrix4Rotate(a, ...axis);
  return vector3TransformMatrix4(matrix, ...velocity);
}

function unrotateOnAxis(normal: ReadonlyVector3, velocity: ReadonlyVector3): Vector3 {
  const cosa = vectorNDotProduct(normal, NORMAL_Z);
  const a = Math.acos(cosa);
  const axis = a > EPSILON
    ? vectorNNormalize(vector3CrossProduct(normal, NORMAL_Z))
    : NORMAL_X;
  const matrix = matrix4Rotate(-a, ...axis);
  return vector3TransformMatrix4(matrix, ...velocity);
}
