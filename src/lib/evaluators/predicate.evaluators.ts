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
  [NodeType.False]: v => v === false,
  [NodeType.Modulo]: (v, [m, r]) => Math.abs(v) % m === r,
  [NodeType.Either]: (v, [arr]) => arr.find(a => a===v) !== undefined,
  [NodeType.Custom]: (v, [predicate]) => predicate(v),
  [NodeType.String]: v => typeof v === 'string',
  [NodeType.StartsWith]: (v, [a]) => v.startsWith(a),
  [NodeType.EndsWith]: (v, [a]) => v.endsWith(a),
  [NodeType.Matches]: (v, [regex]) => regex.test(v),
}
