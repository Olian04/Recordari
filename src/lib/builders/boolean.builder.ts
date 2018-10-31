import { _INode, IInternal, INode_Boolean, internal, NodeType } from '../builder.interface';
import { Node_Void } from './void.builder';

export const Node_Boolean = (root: IInternal, self: IInternal): _INode & INode_Boolean => ({
  [internal]: root,
  get False() {
    self.children.push({
      type: NodeType.False,
      data: [],
      children: [],
    });
    return Node_Void(root);
  },
  get True() {
    self.children.push({
      type: NodeType.True,
      data: [],
      children: [],
    });
    return Node_Void(root);
  },
});
