import { internal, IInternal, INode } from './builder.interface';
import { predicates } from './evaluators/predicate.evaluators';
import { extractions } from './evaluators/extraction.evaluators';
import { unique } from './evaluators/unique.evaluators';

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
    // This error should never be thrown if the tests pass, so the fact that it's not ran by the tests means that it's working as intended
    /* istanbul ignore next */
    throw new Error('Unexpected node type: ' + type);
  };
  return _eval(value, root[internal]);
}
