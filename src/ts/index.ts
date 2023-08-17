
const U_MODEL_VIEW_MATRIX = "uModelView";
const U_MODEL_ROTATION_MATRIX = 'uModelRotation';
const U_PROJECTION_MATRIX = "uProjection";

const A_VERTEX_MODEL_POSITION = "aVertexModelPosition";
const A_VERTEX_PLANE_ROTATION_MATRIX = 'aVertexPlaneRotation';
const A_VERTEX_SMOOTHING_ROTATION_MATRIX = 'aVertexSmoothingRotation';

const V_MODEL_POSITION = 'vModelPosition';
const V_WORLD_POSITION = 'vWorldPosition';
const V_NORMAL = 'vNormal';
const V_PLANE_ROTATION_MATRIX = 'vPlaneRotation';
const V_NORMAL_ROTATION_MATRIX = 'vNormalRotation';

const O_COLOR = "oColor";

const VERTEX_SHADER = `#version 300 es
  precision lowp float;

  in vec4 ${A_VERTEX_MODEL_POSITION};
  in mat4 ${A_VERTEX_PLANE_ROTATION_MATRIX};
  in mat4 ${A_VERTEX_SMOOTHING_ROTATION_MATRIX};

  uniform mat4 ${U_MODEL_VIEW_MATRIX};
  uniform mat4 ${U_MODEL_ROTATION_MATRIX};
  uniform mat4 ${U_PROJECTION_MATRIX};
  
  out vec4 ${V_WORLD_POSITION};
  out vec4 ${V_MODEL_POSITION};
  out vec4 ${V_NORMAL};
  out mat4 ${V_PLANE_ROTATION_MATRIX};
  out mat4 ${V_NORMAL_ROTATION_MATRIX};


  void main(void) {
    ${V_MODEL_POSITION} = ${A_VERTEX_MODEL_POSITION};
    ${V_WORLD_POSITION} = ${U_MODEL_VIEW_MATRIX} * ${U_MODEL_ROTATION_MATRIX} * ${A_VERTEX_MODEL_POSITION};
    ${V_NORMAL} = ${U_MODEL_ROTATION_MATRIX} * ${A_VERTEX_PLANE_ROTATION_MATRIX} * vec4(0., 0., 1., 1.);
    ${V_PLANE_ROTATION_MATRIX} = ${A_VERTEX_PLANE_ROTATION_MATRIX};
    ${V_NORMAL_ROTATION_MATRIX} = ${A_VERTEX_SMOOTHING_ROTATION_MATRIX};

    gl_Position = ${U_PROJECTION_MATRIX} * ${V_WORLD_POSITION};
  }
`;

const FRAGMENT_SHADER = `#version 300 es
  precision lowp float;

  in vec4 ${V_WORLD_POSITION};
  in vec4 ${V_MODEL_POSITION};
  in vec4 ${V_NORMAL};
  in mat4 ${V_PLANE_ROTATION_MATRIX};
  in mat4 ${V_NORMAL_ROTATION_MATRIX};

  out vec4 ${O_COLOR};

  void main(void) {
    vec3 n = normalize(${V_PLANE_ROTATION_MATRIX} * ${V_NORMAL_ROTATION_MATRIX} * vec4(0, 0, 1, 1)).xyz;

    ${O_COLOR} = vec4(vec3((dot(n, vec3(-.5, -.5, .7)) + 1.) / 2.), 1);
  }
`;

// // generate some ground
const baseGroundDepths = [
  [0., 0., 0., 0., 0., 0.],
  [0., .3, .2, .2, 1., 0.],
  [0., .3, 0., 0., .4, 0.],
  [0., .3, 0., 0., .4, 0.],
  [0., .3, 0., 0., .4, 0.],
  [0., .3, .1, .1, 3., 0.],
  [0., 0., 0., 0., 0., 0.],
];
// generate some ground
// const baseGroundDepths = [
//   [0., 0., 0., 0., 0., 0.],
//   [0., 0., 0., 0., 0., 0.],
//   [0., 0., 0., 0., 0., 0.],
//   [0., 0., 0., 0., 0., 0.],
//   [0., 0., 0., 0., 0., 0.],
//   [0., 0., 0., 0., 0., 0.],
//   [0., 0., 0., 0., 0., 0.],
// ];

function splitGroundDepths(
  groundDepths: readonly (readonly number[])[],
  randomness: number,
): readonly (readonly number[])[] {
  return groundDepths.map((groundDepthsX) => {
    return groundDepthsX.map((groundDepth, x) => {
      const previousGroundDepth = x ? groundDepthsX[x - 1] : 0;
      const nextGroundDepth = groundDepthsX[x + 1] || 0;
      // double the height to account for doubleing the number of entries
      // will scale down later
      // randomness should be sqrt(2) for 100% variance (probably not true)
      return [
        (previousGroundDepth + groundDepth*2)/2 // Math.sqrt(2)/3 ~= .5
          + Math.random() * (previousGroundDepth - groundDepth) * randomness,
        (nextGroundDepth + groundDepth*2)/2
          + Math.random() * (nextGroundDepth - groundDepth) * randomness,
      ];
    }).flat(1);
  });
}


window.onload = async () => {

  // frame
  const shape1: ConvexShape = [
    toPlane(0, 0, 1, 1),
    toPlane(0, 0, -1, 1),
    toPlane(1, 1, 0, 1),
    toPlane(-1, 1, 0, 1),
    toPlane(1, 0, 0, 1),
    toPlane(-1, 0, 0, 1),
    //toPlane(0, 1, 0, 1),
    toPlane(0, -1, 0, 1),
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
    [[cube, []]]
  ];

  const modelShapeFaces = modelShapes.map(shapes => decompose(shapes));
  console.log(modelShapeFaces);

  const randomness = .0;
  const groundDepths = new Array(2).fill(0).reduce<readonly (readonly number[])[]>(
    (acc, _, i) => {
      const input = i % 2 ? acc : transpose2DArray(acc);
      const xGroundDepths = splitGroundDepths(input, randomness);
      const xyGroundDepths = splitGroundDepths(transpose2DArray(xGroundDepths), randomness);
      return i % 2 ? transpose2DArray(xyGroundDepths) : xyGroundDepths;
    },
    baseGroundDepths,
  );

  // turn the depths into faces
  const groundFaces = groundDepths.map(
    (groundDepthsX, x) => {
      return groundDepthsX.map<[Face, Face]>(
        (z00, y) => {
          const z10 = groundDepths[x+1]?.[y] || 0;
          const z01 = groundDepths[x][y+1] || 0;
          const z11 = groundDepths[x+1]?.[y+1] || 0;
          
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
            return toFace(...points);
          }) as [Face, Face];
        },
      );
    },
  );

  const worldWidth = groundDepths.length;
  const worldHeight = groundDepths[0].length;

  const grid: Grid = create2DArray<Record<number, Entity>>(
    worldWidth,
    worldHeight,
    () => ({}),
  );
  const world = {
    [0]: grid,
  };
  // split the ground up into tiles
  
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
    aPlaneRotationMatrix,
    aSmoothingRotationMatrix,
  ] = [
    A_VERTEX_MODEL_POSITION,
    A_VERTEX_PLANE_ROTATION_MATRIX,
    A_VERTEX_SMOOTHING_ROTATION_MATRIX,
  ].map(
    attribute => gl.getAttribLocation(program, attribute)
  );
  const [
    uModelViewMatrix,
    uModelRotationMatrix,
    uProjectionMatrix,
  ] = [
    U_MODEL_VIEW_MATRIX,
    U_MODEL_ROTATION_MATRIX,
    U_PROJECTION_MATRIX,
  ].map(
    uniform => gl.getUniformLocation(program, uniform)
  );

  function getModelPoint(modelPointCache: ReadonlyVector3[], point: ReadonlyVector3, toModelCoordinates: ReadonlyMatrix4): ReadonlyVector3 {
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
  }

  const modelFacesGroups: readonly (readonly (readonly Face[])[])[] = [
    ...modelShapeFaces.map(faces => [faces]),
    groundFaces.flat(1),
  ];
  const models: Model[] = modelFacesGroups.map(
    group => {
      const groupPointsToFaces = new Map<ReadonlyVector3, Set<Face>>();
      const groupPointCache: ReadonlyVector3[] = [];

      // need to populate the points -> faces, otherwise the smoothing
      // doesn't work
      const groupPoints = group.map(
        faces => faces.map(
          face => {
            const { polygons, toModelCoordinates } = face;
            return polygons.map(
              polygon => {
                return polygon.map(
                  point => {
                    const modelPoint = getModelPoint(groupPointCache, point, toModelCoordinates);
                    const faces = groupPointsToFaces.get(point) || new Set();
                    faces.add(face);
                    groupPointsToFaces.set(modelPoint, faces);
                    return modelPoint;
                  }
                );
              }
            );
          }
        ).flat(2),
      );


      return group.map<Model>((faces, i) => {
        const allPoints = groupPoints[i];
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
          indices,
        ] = faces.reduce<[
          // model positions
          ReadonlyVector3[],
          // plane transformation
          ReadonlyMatrix4[],
          // smoothing transformation
          ReadonlyMatrix4[],
          // indices
          number[],
        ]>(([modelPoints, planeTransforms, smoothingTransforms, indices], face) => {
          const {
            polygons,
            rotateToModelCoordinates,
            toModelCoordinates,
          } = face;
          const rotateFromModelCoordinates = matrix4Invert(rotateToModelCoordinates);
      
          const polygonPoints = polygons.flat(1);
          const modelPointsSet = polygonPoints.reduce((acc, point) => {
            return acc.add(getModelPoint(groupPointCache, point, toModelCoordinates));
          }, new Set<ReadonlyVector3>());
          const modelPointsUnique = [...modelPointsSet];
    
          const newPlaneTransforms = new Array<ReadonlyMatrix4>(modelPointsUnique.length)
            .fill(rotateToModelCoordinates);
    
          const newSmoothingTransforms = modelPointsUnique.map(worldPoint => {
            const faces = groupPointsToFaces.get(worldPoint);
            const combined = [...faces].reduce<ReadonlyVector3>((acc, {
              rotateToModelCoordinates,
            }) => {
              const faceNormal = vector3TransformMatrix4(rotateToModelCoordinates, 0, 0, 1);
              return vectorNScaleThenAdd(acc, faceNormal);
            }, [0, 0, 0]);
            const normal = vectorNNormalize(combined);
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
      
      
          const newIndices = polygons.reduce<number[]>((indices, polygon, i) => {
            const polygonIndices = polygon.map(point => {
              const worldPoint = getModelPoint(groupPointCache, point, toModelCoordinates);
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
            [...indices, ...newIndices],
          ];
        }, [[], [], [], []]);

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
      
        ([
          [aModelPosition, modelPoints],
          [aPlaneRotationMatrix, planeTransforms],
          [aSmoothingRotationMatrix, smoothingTransforms],
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
    
        return {
          bounds,
          faces,
          center,
          radius,
          groupPointCache,
          groupPointsToFaces,
          indexCount: indices.length,
          vao,
        };
      });
    }
  ).flat(1);

  console.log('models', models);

  const knownModelOffset = modelShapeFaces.length;

  // add in the terrain
  for (let x=0; x<worldWidth; x++) {
    for (let y=0; y<worldHeight; y++) {
      const modelId = knownModelOffset + x * worldHeight + y;
      const {
        faces,
        bounds,
        center,
        radius,
      } = models[modelId];
      const renderGroupId = nextRenderGroupId++;
      faces.forEach(face => {
        const id = nextEntityId++;

        // Note: we use the model bounds here as they will be about the same
        // for terrain tiles, at least for x/y axis
        const worldToPlaneCoordinates = matrix4Invert(face.toModelCoordinates);
        const rotateToPlaneCoordinates = matrix4Invert(face.rotateToModelCoordinates);
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
          bounds,
          face,
          id,
          renderGroupId,
        };
        addEntity(grid, entity);
      });
    }
  }
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
      worldWidth/2,
      worldHeight/2-3.1,
      10,
    ],
    renderGroupId: nextRenderGroupId++,
    velocity: [0, 0, 0],
  };
  addEntity(grid, player);

  //const modelFaces: Face[][] = groundFaces.flat(2).map(faces => [faces]);
  console.log(grid);

  let playerHeadXRotation = 0;
  
  window.onmousedown = (e: MouseEvent) => previousPosition = [e.clientX, -e.clientY];
  window.onmouseup = () => previousPosition = undefined;
  window.onmousemove = (e: MouseEvent) => {
    if (previousPosition) {
      const currentPosition: ReadonlyVector2 = [e.clientX, -e.clientY];
      const delta = vectorNScaleThenAdd(currentPosition, previousPosition, -1);
      const rotation = vectorNLength(delta)/399;
      if (rotation > EPSILON) {
        const playerBodyRotationMatrix = player.partTransforms[MODEL_KNIGHT_BODY];
        player.partTransforms[MODEL_KNIGHT_BODY] = matrix4Multiply(
          playerBodyRotationMatrix,
          matrix4Rotate(
            delta[0]/399,
            0,
            0,
            1,
          ),
        );
        playerHeadXRotation = Math.max(
          -Math.PI/3,
          Math.min(
            Math.PI/3,
            playerHeadXRotation - delta[1]/199,   
          ),
        ) 
        player.partTransforms[MODEL_KNIGHT_HEAD] = matrix4Rotate(
          playerHeadXRotation,
          1,
          0,
          0
        );
        previousPosition = currentPosition;
      }
    }
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
      return vectorNScaleThenAdd(velocity, vector, .01 * multiplier);
    }, [0, 0]);
    const targetLateralVelocity = vector3TransformMatrix4(
      player.partTransforms[MODEL_KNIGHT_BODY],
      ...targetUnrotatedLateralVelocity,
      0,
    );
    player.velocity[0] = targetLateralVelocity[0];
    player.velocity[1] = targetLateralVelocity[1];     
    player.velocity[2] = inputs[INPUT_JUMP] ? .02 : player.velocity[2];

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
    grid.forEach(gridX => {
      gridX.forEach(tile => {
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
              removeEntity(grid, entity);
              // TODO enforce max speed
              (entity as DynamicEntity).velocity[2] -= cappedDelta/9999;
              let remainingCollisionTime = cappedDelta;
              while (remainingCollisionTime > EPSILON) {
                const {
                  position,
                  velocity,
                  collisionRadius,
                } = entity as DynamicEntity;
                const targetPosition = vectorNScaleThenAdd(position, velocity, remainingCollisionTime);
                const targetUnionBounds: ReadonlyRect3 = [
                  velocity.map((v, i) => bounds[0][i] + Math.min(0, v) * remainingCollisionTime) as Vector3,
                  velocity.map((v, i) => bounds[1][i] + Math.max(0, v) * remainingCollisionTime) as Vector3,
                ];
                const targetEntity = {
                  position: targetPosition,
                  bounds: targetUnionBounds,
                };
                let minCollisionTime = remainingCollisionTime;
                let minCollisionNormal: Vector3 | Falsey;
                const checkedEntities: Record<EntityId, Truthy> = {};
                // update dynamic entity
                iterateEntityBounds(grid, targetEntity, tile => {
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

                        
                        if (rect3Overlaps(targetPosition, targetUnionBounds, checkPosition, checkBounds)) {
                          // only check static collisions
                          const planeVelocity = vector3TransformMatrix4(
                            rotateToPlaneCoordinates,
                            ...velocity,
                          );
                          const planeVelocityZ = planeVelocity[2];
                          if (planeVelocityZ >= 0) {
                            // TODO is this right?
                            // it's not right
                            continue;
                          }
                          
                          // TODO need to also calculate intersections from below for edge handling
                          const startPlanePosition = vector3TransformMatrix4(
                            worldToPlaneCoordinates,
                            ...position,
                          );
                          const planeZ = polygons[0][0][2];
                          const startPlanePositionZ = startPlanePosition[2] - planeZ;

                          const planeIntersectionTime = planeVelocityZ < 0
                            ? (collisionRadius - startPlanePositionZ)/planeVelocityZ
                            // start position z should be -ve
                            : -(collisionRadius + startPlanePositionZ)/planeVelocityZ;

                          if (planeIntersectionTime <= remainingCollisionTime) {

                            // do they already overlap
                            if (FLAG_CHECK_STARTS_OVERLAPPING) {
                              if (rect3Overlaps(position, bounds, checkPosition, checkBounds)) {
                                if (planeIntersectionTime < 0 && planeIntersectionTime > collisionRadius/planeVelocityZ) {
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
                              planeIntersectionTime,
                            );
                            if (
                              planeVelocityZ < 0
                              && planeIntersectionTime > EPSILON
                              && vector2PolygonsContain(polygons, ...intersectionPlanePosition)
                              && FLAG_QUICK_COLLISIONS
                            ) {
                              collisionTime = planeIntersectionTime - EPSILON; 
                              // TODO account for any rotation transforms
                              planeCollisionNormal = vector3TransformMatrix4(rotateToModelCoordinates, 0, 0, 1);
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
                              let minTime = Math.max(0, planeIntersectionTime - EPSILON);
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
                                      
                                      // planeCollisionNormal = vectorNNormalize(
                                      //   vectorNScaleThenAdd(
                                      //     testPlanePosition,
                                      //     [closestPointX, closestPointY, planeZ],
                                      //     -1,
                                      //   ),
                                      // );
                                      planeCollisionNormal = NORMAL_Z;
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
                                //if (vectorNDotProduct(planeCollisionNormal, planeVelocity) < 0) {
                                //if (vectorNDotProduct(planeCollisionNormal, NORMAL_Z) > 0 || true) {
                                // if (planeCollisionNormal[2] > 0) {
                                collisionTime = minTime;
                                // } else {
                                //   planeCollisionNormal = 0;
                                // }
                              }
                            }
                          }
                        }
                        if (planeCollisionNormal
                          && (collisionTime < minCollisionTime || !minCollisionNormal)
                        ) {
                          minCollisionTime = collisionTime;
                          minCollisionNormal = vector3TransformMatrix4(
                            rotateToModelCoordinates,
                            ...planeCollisionNormal as ReadonlyVector3,
                          );
                        }
                      } else {
                        // TODO some basic dynamic, sphere collision
                      }
                    }
                  }
                });
                if (minCollisionNormal) {
                  const boundedCollisionTime = Math.max(0, minCollisionTime);
                  entity.position = vectorNScaleThenAdd(
                    entity.position,
                    velocity,
                    boundedCollisionTime,
                  );

                  const bounciness = .5;
                  const cosa = vectorNDotProduct(minCollisionNormal, NORMAL_Z);
                  // assume cosa > 0
                  if (cosa < 1 - EPSILON) {
                    const axis = vectorNNormalize(vector3CrossProduct(minCollisionNormal, NORMAL_Z))
                    const a = Math.acos(cosa);
                    const matrix = matrix4Rotate(a, ...axis);
                    const inverse = matrix4Invert(matrix);
                    const v = vector3TransformMatrix4(matrix, ...velocity);
                    v[2] *= -bounciness;
                    (entity as DynamicEntity).velocity = vector3TransformMatrix4(inverse, ...v);  
                  } else {
                    // just bounce
                    velocity[2] *= -bounciness;
                  }
                  console.log(minCollisionTime, minCollisionNormal, (entity as DynamicEntity).velocity);

                  
                  remainingCollisionTime -= boundedCollisionTime;
                } else {
                  entity.position = vectorNScaleThenAdd(
                    entity.position,
                    velocity,
                    remainingCollisionTime,
                  );
                  remainingCollisionTime = 0;
                }
              }
              addEntity(grid, entity);
            }

            const modelId = entity.body.modelId;
            if (!renderedEntities[renderId] && modelId != null) {
              renderedEntities[renderId] = 1;
              let render = toRender[modelId];
              if (render == null) {
                render = [];
                toRender[modelId] = render;
              }
              const transform = matrix4Multiply(
                // TODO maybe just pass in position as a vec3
                matrix4Translate(...entity.position),
                partTransforms?.[entity.body.id],
                renderTransform,
              );
              render.push([transform, matrix4Identity()]);    
            }
          }
        }
      });
    });

    for (let modelId in toRender) {
      const { vao, indexCount } = models[modelId];
      gl.bindVertexArray(vao);
      const renders = toRender[modelId];
      renders.forEach(([transform, rotation]) => {
        gl.uniformMatrix4fv(uModelViewMatrix, false, transform as any);
        gl.uniformMatrix4fv(uModelRotationMatrix, false, rotation as any);
        gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);  
      });
    }    

    requestAnimationFrame(animate);
  }
  animate(0);


}
