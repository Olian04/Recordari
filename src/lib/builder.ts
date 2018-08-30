import '../util/collections';
import { internal, NodeType, IInternal, INode_Base, INode_Number, INode_Array, INode_Void, INode } from './builder.interface';

const Node_Void = (root: IInternal): INode => ({
  [internal]: root
});

const Node_Number = (root: IInternal, self: IInternal): INode & INode_Number => ({
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

const Node_Array = (root: IInternal, self: IInternal):  INode & INode_Array => ({
  [internal]: root,
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
  get Each() {
    self.children.push({
      type: NodeType.Each,
      data: [],
      children: []
    });
    return Node_Base(root, self.children[0]);
  },
  get Contains() {
    self.children.push({
      type: NodeType.Contains,
      data: [],
      children: []
    });
    return Node_Base(root, self.children[0]);
  },
  Like(Rs) {
    self.children.push({
      type: NodeType.Like,
      data: [],
      children: Rs.map(r => r[internal])
    });
    return Node_Void(root);
  }
});

const Node_Base = (root: IInternal, self: IInternal): INode & INode_Base => ({
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

export const Builder = <INode_Base>new Proxy({}, {
  get(__, k) {
    const root = {
      type: NodeType.Base,
      data: [],
      children: []
    };
    return Node_Base(root, root)[k];
  }
});
