import { NodeType } from '../builder.interface';

export const predicates: {
  [k: string]: (v: any, args?: any[]) => boolean;
} = {
	[NodeType.Base]: () => true,
	[NodeType.Any]: () => true,
  [NodeType.Array]: v => Array.isArray(v),
  [NodeType.Number]: v => typeof v === 'number',
  [NodeType.Max]: (v, [a]) => v <= a,
  [NodeType.Min]: (v, [a]) => v >= a,
  [NodeType.Exact]: (v, [a]) => v === a,
  [NodeType.Boolean]: v => typeof v === 'boolean',
  [NodeType.True]: v => v === true,
  [NodeType.False]: v => v === false
}
