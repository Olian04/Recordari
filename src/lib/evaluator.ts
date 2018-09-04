import '../util/collections';
import { internal, NodeType, IInternal, INode } from './builder.interface';

const predicates: {
  [k: string]: (v: any, args?: any[]) => boolean;
} = {
	[NodeType.Base]: () => true,
	[NodeType.Any]: () => true,
  [NodeType.Array]: v => Array.isArray(v),
  [NodeType.Number]: v => typeof v === 'number',
  [NodeType.Max]: (v, [a]) => v <= a,
  [NodeType.Min]: (v, [a]) => v >= a,
  [NodeType.Exact]: (v, [a]) => v === a
}
const extractions: {
  [k: string]: (v: any, args?: any[]) => any;
} = {
  [NodeType.Length]: v => v.length
}
const unique: {
  [k: string]: (_eval:  (value:  any, internal: IInternal) => boolean, v: any, node: IInternal) => boolean;
} = {
  [NodeType.Each]: (_eval, value, {children}) => children[0] === undefined || value.reduce((res, val) => res && _eval(val, children[0]), true),
  [NodeType.Contains]: (_eval, value, {children}) => children[0] === undefined || value.reduce((res, val) => res || _eval(val, children[0]), false),
  [NodeType.And]: (_eval, value, {children}) => children[0] === undefined || children.reduce((res, child) => res && _eval(value, child), true),
  [NodeType.Or]: (_eval, value, {children}) => children[0] === undefined || children.reduce((res, child) => res || _eval(value, child), false),
  [NodeType.Not]: (_eval, value, {children}) => !_eval(value, children[0]),
  [NodeType.Like]: (_eval, value, {children}) => (value.length === children.length) && Array.zip(value, children).reduce((res, [value, child]) => res && _eval(value, child), true)
}
export const Evaluate = (value, root: INode): boolean => {
  const _eval: (value:  any, internal: IInternal) => boolean = (value, {type, data, children}) => {
    if (type in predicates) {
      // Predicate
      return predicates[type](value, data) && (children[0] === undefined || _eval(value, children[0]));
    }
    if (type in extractions) {
      // Extraction
      return children[0] === undefined || _eval(extractions[type](value, data), children[0]);
    }
    if (type in unique) {
      // Unique
      return unique[type](_eval, value, {type, data, children});
    }
    throw new Error('Unexpected node type: ' + type);
	};
  return _eval(value, root[internal]);
}
