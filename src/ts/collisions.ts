function handleCollision(
  entity: Entity,
  addEntity: (e: Entity) => void,
  check?: Entity | Falsey,
) {
  const {
    position,
    inverseMass = 0,
    bounds,
    face,
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
        anims: [createAttributeAnimation(
          200,
          'animationTransform',
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
        )],
        transient: 1,
        inverseFriction: 0,
        health: 9,
      });
      checkDamaged = 1;
      break;
    case ENTITY_TYPE_FIRE:
      // TODO only allow damage if previous damage animation has completed
      if (check && check.health) {
        // do damage to thing
        checkDamaged = 1;
        // gain some health
        entity.health += 9;
      }
      break;
  }
  if (checkDamaged && check && check.health) {
    check.health--;
    check.anims = [...(check.anims || []), createAttributeAnimation(
      200 + 99 * Math.random(),
      'animationTransform',
      EASING_BOUNCE,
      createMatrixUpdate(p => matrix4Scale(1, 1 + p/(2 + Math.random()), 1 - p/(3 + Math.random()))),
    )];
  }
}