function synthesizeOppositeBodyPart<PartId extends number>(
  {
    id,
    modelId,
    postRotationTransform,
    preRotationOffset,
    preRotationTransform,
    children
  }: BodyPart<PartId>,
): BodyPart<PartId> {

  const flipMatrix = matrix4Scale(-1, 1, 1);
  const synthesizedChildren = children?.map(synthesizeOppositeBodyPart);
  return {
    id: (id && -id) as PartId,
    children: synthesizedChildren,
    modelId: modelId && (modelId + 1),
    oppositeAnimationScaling: [1, 1, 1],
    //postRotationTransform,
    postRotationTransform: postRotationTransform && matrix4Multiply(flipMatrix, postRotationTransform, flipMatrix),
    preRotationOffset: preRotationOffset && vector3TransformMatrix4(flipMatrix, ...preRotationOffset),
    //preRotationTransform,
    preRotationTransform: preRotationTransform && matrix4Multiply(flipMatrix, preRotationTransform, flipMatrix),
  };
}