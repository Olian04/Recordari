import { internal, NodeType, IInternal, _INode, INode_Object } from '../builder.interface';
import { Node_Array } from './array.builder';
import { Node_Void } from './void.builder';

export const Node_Object = (root: IInternal, self: IInternal): _INode & INode_Object => ({
  [internal]: root,
  get Values() {
    self.children.push({
      type: NodeType.Values,
      data: [],
      children: []
    });
    return Node_Array(root, self.children[0]);
  },
  get Keys() {
    self.children.push({
      type: NodeType.Keys,
      data: [],
      children: []
    });
    return Node_Array(root, self.children[0]);
  },
  Like(obj) {
    self.children.push({
      type: NodeType.LikeObject,
      data: [obj],
      children: []
    });
    return Node_Void(root);
  }
});
