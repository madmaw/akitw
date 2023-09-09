function synthesizeOppositeBodyPart<PartId extends number>(
  {
    id,
    modelId,
    postRotation,
    preRotationOffset,
    preRotation,
    childParts: children
  }: BodyPart<PartId>,
): BodyPart<PartId> {
  const flipXVector: ReadonlyVector3 = [-1, 1, 1];
  const synthesizedChildren = children?.map(synthesizeOppositeBodyPart);
  // want to flip the rotations at 90 degrees
  const [newPostRotation, newPreRotation] = [postRotation, preRotation].map<ReadonlyVector3>(rotation => {
    if (rotation) {
      const [x, y, z] = rotation;
      const newY = PI_1_1DP - y;
      const newX = PI_1_1DP - x;
      const newZ = PI_1_1DP - z;
      return [newX, newY, newZ];  
    }
  });
  return {
    id: (id && -id) as PartId,
    childParts: synthesizedChildren,
    modelId: modelId && (modelId + 1),
    postRotation: newPostRotation,
    preRotationOffset: preRotationOffset && vectorNMultiply(preRotationOffset, flipXVector),
    preRotation: newPreRotation,
  };
}