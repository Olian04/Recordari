import { internal, NodeType, IInternal, _INode, INode_Number } from '../builder.interface';

export const Node_Number = (root: IInternal, self: IInternal): _INode & INode_Number => ({
  [internal]: root,
  Max(val) {
    self.children.push({
      type: NodeType.Max,
      data: [val],
      children: []
    });
    return Node_Number(root, self.children[0]);
  },
  Min(val) {
    self.children.push({
      type: NodeType.Min,
      data: [val],
      children: []
    });
    return Node_Number(root, self.children[0]);
  },
  Exact(val) {
    self.children.push({
      type: NodeType.Exact,
      data: [val],
      children: []
    });
    return Node_Number(root, self.children[0]);
  }
});
