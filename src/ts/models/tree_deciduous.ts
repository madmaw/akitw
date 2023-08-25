
const MODEL_TREE_DECIDUOUS_BODY = 0;

type TreeDeciduousPartIds = 
  | typeof MODEL_TREE_DECIDUOUS_BODY
  ;

const treeDeciduousTrunk: ConvexShape<PlaneMetadata> = createCylinder(1, 4, 6);

const treeDeciduous: Shape<PlaneMetadata>[] = [
  [treeDeciduousTrunk, []],
];