import { _INode, INode_Base, NodeType } from './builder.interface';
import { Node_Base } from './builders/base.builder';

export const Builder = new Proxy({}, {
  get(__, k) {
    const root = {
      type: NodeType.Base,
      data: [],
      children: [],
    };
    return Node_Base(root, root)[k];
  },
}) as INode_Base;
