import { internal, NodeType, IInternal, _INode, INode_Number } from '../builder.interface';

export const Node_Number = (root: IInternal, self: IInternal): _INode & INode_Number => ({
  [internal]: root,
  get not() {
    self.children.push({
      type: NodeType.Not,
      data: [],
      children: []
    });
    return Node_Number(root, self.children[0]);
  },
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
  get Natural() {
    self.children.push({
      type: NodeType.Min,
      data: [0],
      children: []
    });
    return Node_Number(root, self.children[0]);
  },
  Between(val_a, val_b) {
    self.children.push({
      type: NodeType.Min,
      data: [Math.min(val_a, val_b)],
      children: [{
        type: NodeType.Max,
        data: [Math.max(val_a, val_b)],
        children: []
      }]
    });
    return Node_Number(root, self.children[0].children[0]);
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
