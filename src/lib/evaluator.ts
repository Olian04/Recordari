import { hasInternal, IInternal, INode, internal } from './builder.interface';
import { extractions } from './evaluators/extraction.evaluators';
import { predicates } from './evaluators/predicate.evaluators';
import { unique } from './evaluators/unique.evaluators';

export const Evaluate = (value: any, root: INode): boolean => {
  const internalEval: (val: any, internal: IInternal) => boolean = (val, {type, data, children}) => {
    if (type in predicates) {
      // Predicate
      return predicates[type](val, data) && (children[0] === undefined || internalEval(val, children[0]));
    }
    if (type in extractions) {
      // Extraction
      return children[0] === undefined || internalEval(extractions[type](val, data), children[0]);
    }
    if (type in unique) {
      // Unique
      return unique[type](internalEval, val, {type, data, children});
    }
    // This error should never be thrown if the tests pass
    // so the fact that it's not ran by the tests means that it's working as intended
    /* istanbul ignore next */
    throw new Error('Unexpected node type: ' + type);
  };

  if (!hasInternal(root)) { throw new Error(
    'Unexpected internal error! Attempted to evaluate root object with missing [internal] field',
  ); }
  return internalEval(value, root[internal]);
};
