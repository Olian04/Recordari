import { internal, NodeType, IInternal, _INode, INode_String } from '../builder.interface';
import { Node_Number } from './number.builder';

export const Node_String = (root: IInternal, self: IInternal): _INode & INode_String => ({
  [internal]: root,
  get not() {
    self.children.push({
      type: NodeType.Not,
      data: [],
      children: []
    });
    return Node_String(root, self.children[0]);
  },
  get Length() {
    self.children.push({
      type: NodeType.Length,
      data: [],
      children: [
        {
          type: NodeType.Number,
          data: [],
          children: []
        }
      ]
    });
    return Node_Number(root, self.children[0].children[0]);
  },
  Exact(val: string) {
    self.children.push({
      type: NodeType.Exact,
      data: [val],
      children: []
    });
    return Node_String(root, self.children[0]);
  },
  Either(vals: string[]) {
    self.children.push({
      type: NodeType.Either,
      data: [vals],
      children: []
    });
    return Node_String(root, self.children[0]);
  },
  StartsWith(val: string) {
    self.children.push({
      type: NodeType.StartsWith,
      data: [val],
      children: []
    });
    return Node_String(root, self.children[0]);
  },
  EndsWith(val: string) {
    self.children.push({
      type: NodeType.EndsWith,
      data: [val],
      children: []
    });
    return Node_String(root, self.children[0]);
  },
  Matches(regex: RegExp) {
    self.children.push({
      type: NodeType.Matches,
      data: [regex],
      children: []
    });
    return Node_String(root, self.children[0]);
  },
});
