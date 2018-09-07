import { NodeType, INode_Base, _INode } from './builder.interface';
import { Node_Base } from './builders/base.builder';

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
