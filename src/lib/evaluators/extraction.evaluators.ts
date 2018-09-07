import { NodeType } from '../builder.interface';

export const extractions: {
  [k: string]: (v: any, args?: any[]) => any;
} = {
  [NodeType.Length]: v => v.length
}
