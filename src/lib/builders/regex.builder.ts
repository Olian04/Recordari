import { _INode, IInternal, INode_Regex, internal, NodeType } from '../builder.interface';
import { Node_Boolean } from './boolean.builder';

export const Node_Regex = (root: IInternal, self: IInternal): _INode & INode_Regex => ({
  [internal]: root,
  Test(val: string) {
    self.children.push({
      type: NodeType.Run,
      data: [(regex: RegExp) => regex.test(val)],
      children: [{
        type: NodeType.Boolean,
        data: [],
        children: [],
      }],
    });
    return Node_Boolean(root, self.children[0].children[0]);
  },
});
