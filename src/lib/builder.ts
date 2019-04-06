import { _INode, INode_Base, internal, NodeType } from './builder.interface';
import { Node_Base } from './builders/base.builder';

export const Builder = new Proxy({}, {
  get(__, k) {
    const root = {
      type: NodeType.Base,
      data: [],
      children: [],
    };
    if (k === internal) {
      throw new Error('Please do not use Base on its own, please use Base.Any if you want to match any value.');
    }
    // This is a workaround so that we can type Base.<something> and always get a new instance of the root element.
    // @ts-ignore
    return Node_Base(root, root)[k];
  },
}) as INode_Base;
