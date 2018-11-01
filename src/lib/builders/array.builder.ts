import { _INode, hasInternal, IInternal, INode_Array, internal, NodeType } from '../builder.interface';
import { Node_Base } from './base.builder';
import { Node_Number } from './number.builder';
import { Node_Void } from './void.builder';

export const Node_Array = (root: IInternal, self: IInternal): _INode & INode_Array => ({
  [internal]: root,
  get Length() {
    self.children.push({
      type: NodeType.Length,
      data: [],
      children: [
        {
          type: NodeType.Number,
          data: [],
          children: [],
        },
      ],
    });
    return Node_Number(root, self.children[0].children[0]);
  },
  get Each() {
    self.children.push({
      type: NodeType.Each,
      data: [],
      children: [],
    });
    return Node_Base(root, self.children[0]);
  },
  get Contains() {
    self.children.push({
      type: NodeType.Contains,
      data: [],
      children: [],
    });
    return Node_Base(root, self.children[0]);
  },
  Like(Rs) {
    self.children.push({
      type: NodeType.LikeArray,
      data: [],
      children: Rs.map((r) => {
        if (!hasInternal(r)) { throw new Error('Array.Like expects an array of Constraints'); }
        return r[internal];
      }),
    });
    return Node_Void(root);
  },
});
