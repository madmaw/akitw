
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

// generate some ground
const baseGroundDepths = [
  [0., 0., 0., 0., 0., 0.],
  [0., .3, .2, .2, 1., 0.],
  [0., .3, 0., 0., .4, 0.],
  [0., .3, 0., 0., .4, 0.],
  [0., .3, 0., 0., .4, 0.],
  [0., .3, .1, .1, 2., 0.],
  [0., 0., 0., 0., 0., 0.],
];
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

  const randomness = .1;
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
    [1]: grid,
  };
  // split the ground up into tiles
  
  const gl = Z.getContext('webgl2');

  let projectionMatrix: ReadonlyMatrix4;
  let modelRotationMatrix = matrix4Identity();
  let previousPosition: ReadonlyVector2 | undefined;
  let cameraX = worldWidth/2;
  let cameraY = -worldHeight/2;
  let cameraZ = 2;

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
            return [...transform] as any;
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
  {
    const modelId = 0;
    const { 
      bounds,
      center,
      faces,
      radius
    } = models[modelId];
    const position: Vector3 = [
      worldWidth/2 + .2,
      worldHeight/2 + .2,
      10,
    ];
    // add in a "player"
    const player: DynamicEntity = {
      body: {
        modelId,
        renderTransform: matrix4Identity(),
        centerOffset: center,
        centerRadius: radius,
      },
      bounds,
      // TODO make it smaller
      collisionRadius: radius,
      id: nextEntityId++,
      position,
      renderGroupId: nextRenderGroupId++,
      velocity: [0, 0, 0],
    };
    addEntity(grid, player);
  }

  //const modelFaces: Face[][] = groundFaces.flat(2).map(faces => [faces]);
  console.log(grid);

  
  window.onmousedown = (e: MouseEvent) => previousPosition = [e.clientX, -e.clientY];
  window.onmouseup = () => previousPosition = undefined;
  window.onmousemove = (e: MouseEvent) => {
    if (previousPosition) {
      const currentPosition: ReadonlyVector2 = [e.clientX, -e.clientY];
      const delta = vectorNScaleThenAdd(currentPosition, previousPosition, -1);
      const axis2d = vector2Rotate(
        Math.PI/2,
        delta
      );
      const axis = vectorNNormalize<ReadonlyVector3>(
        [axis2d[0], 0, axis2d[1]],
      );
      const rotation = vectorNLength(delta)/399;
      if (rotation > EPSILON) {
        const rotationMatrix = matrix4Rotate(
          rotation,
          ...axis,
        );  
        modelRotationMatrix = matrix4Multiply(rotationMatrix, modelRotationMatrix);
        previousPosition = currentPosition;
      }
    }
  };
  window.onwheel = (e: WheelEvent) => {
    const v = e.deltaY/100;
    cameraY -= v;
  };

  const lastFrameTimes: number[] = [];
  let then = 0;
  function animate(now: number) {
    const delta = now - then;
    then = now;
    lastFrameTimes.push(delta);
    const cappedDelta = Math.min(delta, 40);
    const recentFrameTimes = lastFrameTimes.slice(-30);
    const spf = recentFrameTimes.reduce((acc, n) => {
      return acc + n/recentFrameTimes.length;
    }, 0);
    if (spf > 0 && fps) {
      fps.innerText = `${Math.round(1000/spf)}`;
    }

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const cameraPositionAndProjectionMatrix = matrix4Multiply(
      projectionMatrix,
      matrix4Translate(-cameraX, -cameraY, -cameraZ),
    );
    gl.uniformMatrix4fv(uProjectionMatrix, false, cameraPositionAndProjectionMatrix as any);
    gl.uniformMatrix4fv(uModelRotationMatrix, false, modelRotationMatrix as any);
  
    // TODO don't iterate entire world (only do around player), render at lower LoD
    // further away
    const handledEntities: Record<EntityId, Truthy> = {};
    const renderedEntities: Record<RenderGroupId, Truthy> = {};
    const toRender: Record<ModelId, ReadonlyMatrix4[]> = {};
    grid.forEach(gridX => {
      gridX.forEach(tile => {
        for (let entityId in tile) {
          if (!handledEntities[entityId]) {
            handledEntities[entityId] = 1;

            const entity = tile[entityId];
            const {
              body: { renderTransform },
              // TODO test bounds
              bounds,
              renderGroupId: renderId,
            } = entity;
            if (!entity.face) {
              removeEntity(grid, entity);
              // TODO enforce max speed
              (entity as DynamicEntity).velocity[2] -= cappedDelta/9999;
              let remainingCollisionTime = cappedDelta;
              while (remainingCollisionTime > 0) {
                const { velocity, collisionRadius } = entity as DynamicEntity;
                let minCollisionTime = remainingCollisionTime;
                let minCollisionNormal: Vector3 | undefined;
                const checkedEntities: Record<EntityId, Truthy> = {};
                // update dynamic entity
                iterateEntityBounds(grid, entity, tile => {
                  for (let checkEntityId in tile) {
                    if (!checkedEntities[checkEntityId]) {
                      checkedEntities[checkEntityId] = 1;
                      let collisionTime: number | undefined;
                      let collisionNormal: Vector3 | undefined;
                      let check = tile[checkEntityId];
                      if (check.face) {
                        const {
                          rotateToPlaneCoordinates,
                          worldToPlaneCoordinates,
                          face: {
                            polygons,
                            rotateToModelCoordinates,
                          },
                        } = check as StaticEntity;
                        // only check static collisions
                        const planeVelocity = vector3TransformMatrix4(
                          rotateToPlaneCoordinates,
                          ...velocity,
                        );
                        const planeVelocityZ = planeVelocity[2];
                        
                        // TODO need to also calculate intersections from below for edge handling
                        if (planeVelocityZ < 0) {
                          const planeStartPosition = vector3TransformMatrix4(
                            worldToPlaneCoordinates,
                            ...entity.position,
                          );
                          const planeStartPositionZ = planeStartPosition[2];
  

                          const timeToOverlap = (collisionRadius - planeStartPositionZ)/planeVelocityZ;
                          if (timeToOverlap > 0 && (!FLAG_BOUNDED_TIME_CHECK || timeToOverlap <= minCollisionTime)) {
                            const planeIntersectionTime = remainingCollisionTime - timeToOverlap;
                            const planeIntersectionPosition = vectorNScaleThenAdd(
                              planeStartPosition,
                              planeVelocity,
                              planeIntersectionTime,
                            );
                            // TODO get 
                            if (polygons.some(polygon => vector2PolyContains(polygon, ...planeIntersectionPosition))) {
                              collisionTime = planeIntersectionTime - EPSILON; 
                              // TODO account for any rotation transforms
                              collisionNormal = vector3TransformMatrix4(rotateToModelCoordinates, 0, 0, 1);
                            }
                            // TODO handle edges
                          }
                        }
                      }
                      if (collisionNormal && collisionTime < minCollisionTime || !minCollisionNormal) {
                        minCollisionTime = collisionTime;
                        minCollisionNormal = collisionNormal;
                      }
                    }
                  }
                });
                if (minCollisionNormal) {
                  const cosa = vectorNDotProduct(minCollisionNormal, NORMAL_Z);
                  // assume cosa < 0
                  const axis = cosa < 1 - EPSILON
                    ? vectorNNormalize(vector3CrossProduct(minCollisionNormal, NORMAL_Z))
                    : NORMAL_X;
                  const a = Math.acos(cosa);
                  const matrix = matrix4Rotate(a, ...axis);
                  const inverse = matrix4Invert(matrix);
                  const v = vector3TransformMatrix4(matrix, ...velocity);
                  v[2] *= -1;
                  entity.position = vectorNScaleThenAdd(
                    entity.position,
                    velocity,
                    minCollisionTime,
                  );
                  (entity as DynamicEntity).velocity = vector3TransformMatrix4(inverse, ...v);
                  remainingCollisionTime -= minCollisionTime;
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
            if (!renderedEntities[renderId]) {
              renderedEntities[renderId] = 1;
              let render = toRender[modelId];
              if (render == null) {
                render = [];
                toRender[modelId] = render;
              }
              const transform = matrix4Multiply(
                matrix4Translate(...entity.position),
                renderTransform,
              );
              render.push(transform);    
            }
          }
        }
      });
    });

    for (let modelId in toRender) {
      const { vao, indexCount } = models[modelId];
      gl.bindVertexArray(vao);
      const renders = toRender[modelId];
      renders.forEach(transform => {
        gl.uniformMatrix4fv(uModelViewMatrix, false, transform as any);
        gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);  
      });
    }    

    requestAnimationFrame(animate);
  }
  animate(0);


}
