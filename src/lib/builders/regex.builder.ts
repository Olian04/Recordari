import { internal, NodeType, IInternal, _INode, INode_Regex } from '../builder.interface';
import { Node_Base } from './base.builder';

export const Node_Regex = (root: IInternal, self: IInternal): _INode & INode_Regex => ({
  [internal]: root,
  Test(val: string) {
    self.children.push({
      type: NodeType.Test,
      data: [regex => regex.test(val)],
      children: []
    });
    return Node_Base(root, self.children[0]);
  }
});
