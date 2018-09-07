import { internal, IInternal, INode_Void } from '../builder.interface';

export const Node_Void= (root: IInternal): INode_Void => ({
  [internal]: root
});
