type JointAnimationSequence<PartId extends number> = readonly [
  PartId,
  number,
  Easing,
  ...readonly ReadonlyVector3[],
];
type JointAnimationSequences<PartId extends number> = JointAnimationSequence<PartId>[];
// partid to animate, duration for each transition, easing to use, angles to transition to in order
type ActionJointAnimationSequences<PartId extends number> = readonly [
  ActionId,
  ...JointAnimationSequences<PartId>,
];

function setJointAnimation<PartId extends number>(
  e: Entity<PartId>,
  jointId: PartId,
  actionId: ActionId,
  animFactory: () => Anim<Joint>,
) {
  const joint = e.joints[jointId] || {};
  e.joints[jointId] = joint;
  if (!joint.anim || joint.animAction < actionId) {
    joint.anim = animFactory();
    joint.animAction = actionId;
  }
}

function setJointAnimations<PartId extends number>(
  e: Entity<PartId>,
  [actionId, ...animationSequences]: ActionJointAnimationSequences<PartId>,
) {
  animationSequences.forEach(([jointId, duration, easing, ...rotations]) => {
    const joint = e.joints[jointId] || {};
    e.joints[jointId] = joint;
    if (!joint.anim || joint.animAction != actionId) {
      joint.anim = createCompositeAnimation(...rotations.map(rotation => {
        return createAttributeAnimation<Joint, 'rotation'>(
          duration,
          'rotation',
          easing,
          createVectorLerpUpdate(rotation, 1),
        );
      }));
      joint.animAction = actionId;
    }

  });
}

function synthesizeFromOppositeJointAnimationSequences<PartId extends number>(
  part: BodyPart<PartId>,
  animationSequences: JointAnimationSequences<PartId>,
): JointAnimationSequences<PartId> {
  const synthesized = part.id < 0;
  const sourcePartId = synthesized ? -part.id : part.id;
  // find the relevant animation
  const animationSequence = animationSequences.find(([partId]) => {
    return partId == sourcePartId;
  });
  const synthesizedAnimations = part.children?.map(child => {
    return synthesizeFromOppositeJointAnimationSequences(child, animationSequences);
  }).flat(1) || [];

  if (animationSequence) {
    const [_, duration, easing, ...rotations] = animationSequence;
    if (synthesized) {
      //const synthesizedRotations = rotations.map(rotation => vectorNMultiply(rotation, animationScaling));
      const synthesizedRotations = rotations.map(
        rotation => vectorNScaleThenAdd<ReadonlyVector3>([Math.PI, Math.PI, Math.PI], rotation, -1)
      );
      synthesizedRotations.push(...synthesizedRotations.splice(0, synthesizedRotations.length/2 | 0));
      const synthesizedAnimation: JointAnimationSequence<PartId> = [
        part.id,
        duration,
        easing,
        ...synthesizedRotations
      ];
      
      synthesizedAnimations.push(synthesizedAnimation)
    } else {
      synthesizedAnimations.push(animationSequence)
    }
  } 
  return synthesizedAnimations;
}