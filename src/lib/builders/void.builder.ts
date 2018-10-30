import { IInternal, INode_Void, internal } from '../builder.interface';

export const Node_Void = (root: IInternal): INode_Void => ({
  [internal]: root,
});
