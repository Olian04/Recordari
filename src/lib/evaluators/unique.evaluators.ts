import { ArrayZip } from '../../util/collections';
import { NodeType, IInternal } from '../builder.interface';

export const unique: {
  [k: string]: (_eval:  (value:  any, internal: IInternal) => boolean, v: any, node: IInternal) => boolean;
} = {
  [NodeType.Each]: (_eval, value, {children}) => children[0] === undefined || value.reduce((res, val) => res && _eval(val, children[0]), true),
  [NodeType.Contains]: (_eval, value, {children}) => children[0] === undefined || value.reduce((res, val) => res || _eval(val, children[0]), false),
  [NodeType.And]: (_eval, value, {children}) => children[0] === undefined || children.reduce((res, child) => res && _eval(value, child), true),
  [NodeType.Or]: (_eval, value, {children}) => children[0] === undefined || children.reduce((res, child) => res || _eval(value, child), false),
  [NodeType.Not]: (_eval, value, {children}) => !_eval(value, children[0]),
  [NodeType.Like]: (_eval, value, {children}) => (value.length === children.length) && ArrayZip(value, children).reduce((res, [value, child]) => res && _eval(value, child), true)
}
