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

    const divisor = 999*(inverseMass + (check.inverseMass || 0));
    entity.velocity = entity.velocity && vectorNScaleThenAdd(
      entity.velocity,
      entityDelta,
      entityOverlap*inverseMass/divisor
    );
    check.velocity = check.velocity && vectorNScaleThenAdd(
      check.velocity,
      entityDelta,
      -entityOverlap*check.inverseMass/divisor,
    );
  }

  switch (entity.entityType) {
    case ENTITY_TYPE_FIREBALL:
      entity.dead = 1;
      addEntity({
        body: {
          modelId: MODEL_ID_SPHERE,
        },
        bounds,
        collisionGroup: COLLISION_GROUP_PLAYER,
        collisionRadius: entity.collisionRadius,
        entityType: ENTITY_TYPE_EXPLOSION,
        id: nextEntityId++,
        position: entity.position,
        renderGroupId: nextRenderGroupId++,
        resolutions: [0, 1],
        velocity: [0, 0, 0],
        anims: [createAttributeAnimation(
          300,
          'animationTransform',
          EASING_BACK_IN,
          createMatrixUpdate(matrix4Scale),
          e => e.dead = 1,
        )],
        transient: 1,
      });
      if (check) {
        check.onFire = (check.onFire || 0) + 1;
      }
      if (check && check.health) {
        check.health--;
        check.anims = [...(check.anims || []), createAttributeAnimation(
          200 + 99 * Math.random(),
          'animationTransform',
          EASING_BOUNCE,
          createMatrixUpdate(p => matrix4Scale(1, 1 + p/(2 + Math.random()), 1 - p/(3 + Math.random()))),
        )];
      }
      break;
  }
}