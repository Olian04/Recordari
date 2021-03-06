import { Builder } from './lib/builder';
import { INode } from './lib/builder.interface';
import { Evaluate } from './lib/evaluator';

export const R = Builder;
export const Record = (type: string, objectConstraint: { [k: string]: INode }) => (obj: object) => {
  if (!Evaluate(obj, Builder.Object.Like(objectConstraint))) {
    // TODO: The error message should reflect what part of the record that failed and why
    throw new TypeError(
      `Failed to construct a record of type "${type}", object does not comply to the constraints of a ${type} record.`,
    );
  }
  return obj;
};
