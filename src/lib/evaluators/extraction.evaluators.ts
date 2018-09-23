import { NodeType } from '../builder.interface';

export const extractions: {
  [k: string]: (v: any, args?: any[]) => any;
} = {
  [NodeType.Length]: v => v.length,
  [NodeType.Keys]: v => Object.keys(v),
  [NodeType.Values]: v => Object.values(v),
  [NodeType.Run]: (v, [f]) => f(v),
}
