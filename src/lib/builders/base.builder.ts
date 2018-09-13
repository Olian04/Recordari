import { internal, NodeType, IInternal, _INode, INode_Base } from '../builder.interface';
import { Node_Number } from './number.builder';
import { Node_Array } from './array.builder';
import { Node_Void } from './void.builder';
import { Node_Boolean } from './boolean.builder';

export const Node_Base = (root: IInternal, self: IInternal): _INode & INode_Base => ({
  [internal]: root,
  get Number() {
    self.children.push({
      type: NodeType.Number,
      data: [],
      children: []
    });
    return Node_Number(root, self.children[0]);
  },
  get Array() {
    self.children.push({
      type: NodeType.Array,
      data: [],
      children: []
    });
    return Node_Array(root, self.children[0]);
  },
  get Boolean() {
    self.children.push({
      type: NodeType.Boolean,
      data: [],
      children: []
    });
    return Node_Boolean(root, self.children[0]);
  },
  and(Rs) {
    self.children.push({
      type: NodeType.And,
      data: [],
      children: Rs.map(r => r[internal])
    });
    return Node_Void(root);
  },
  or(Rs) {
    self.children.push({
      type: NodeType.Or,
      data: [],
      children: Rs.map(r => r[internal])
    });
    return Node_Void(root);
  },
  get not() {
    self.children.push({
      type: NodeType.Not,
      data: [],
      children: []
    });
    return Node_Base(root, self.children[0])
  },
  get Any() {
    self.children.push({
      type: NodeType.Any,
      data: [],
      children: []
    });
    return Node_Void(root);
  }
});
