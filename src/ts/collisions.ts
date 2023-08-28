function handleCollision(
  entity: Entity,
  addEntity: (e: Entity) => void,
  check?: Entity | Falsey,
) {
  const {
    position,
    inverseMass = 0,
    collisionRadiusFromCenter,
    centerOffset,
    bounds,
    face,
  } = entity;
  
  if (check && !face && !check.face && (inverseMass || check.inverseMass)) {
    const entityDelta = vectorNScaleThenAdd(
      vectorNScaleThenAdd(position, centerOffset),
      vectorNScaleThenAdd(check.position, check.centerOffset),
      -1
    );
    const entityDistance = vectorNLength(entityDelta);
    const entityOverlap = collisionRadiusFromCenter + check.collisionRadiusFromCenter - entityDistance;

    const divisor = 999*(inverseMass + (check.inverseMass || 0));
    entity.velocity = entity.velocity && vectorNScaleThenAdd(
      entity.velocity,
      entityDelta,
      -entityOverlap*inverseMass/divisor
    );
    check.velocity = check.velocity && vectorNScaleThenAdd(
      check.velocity,
      entityDelta,
      entityOverlap*check.inverseMass/divisor,
    );
  }

  switch (entity.entityType) {
    case ENTITY_TYPE_FIREBALL:
      entity.dead = 1;
      addEntity({
        bounds,
        centerOffset,
        collisionGroup: COLLISION_GROUP_PLAYER,
        collisionRadiusFromCenter,
        entityType: ENTITY_TYPE_EXPLOSION,
        id: nextEntityId++,
        position: entity.position,
        renderGroupId: nextRenderGroupId++,
        resolutions: [0, 1],
        velocity: [0, 0, 0],
        animations: [createAttributeAnimation(
          300,
          'fire',
          EASING_BACK_IN,
          p => 1 - p,
          e => e.dead = 1,
        )],
        fire: entity.fire,
        transient: 1,
      });
      if (check) {
        check.onFire = (check.onFire || 0) + entity.fire * 99;
      }
      if (check && check.health) {
        check.health--;
        check.animations = [...(check.animations || []), createAttributeAnimation(
          99 + 99 * Math.random(),
          'animationTransform',
          EASING_BOUNCE,
          createEntityMatrixUpdate(p => matrix4Multiply(
            matrix4Translate(0, 0, -check.collisionRadiusFromCenter),
            //matrix4Rotate(-Math.PI*p/4, 0, 1, 0),
            matrix4Scale(1, 1 + p/(2 + Math.random()), 1 - p/(3 + Math.random())),
            matrix4Translate(0, 0, check.collisionRadiusFromCenter),
          )),
        )];
      }
      break;
  }
}