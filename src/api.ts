export { Builder as R } from './lib/builder';

import { Evaluate } from './lib/evaluator';

/*
// This is the endgoal for v1.0.0
// v2.0.0 should focus on bringing custom errors based on what failed.
export const Record = (type: string, objectConstraint) => (obj: Object) => {
  if (!Evaluate(obj, R.Object.Like(objectConstraint))) {
    throw new Error(`Assertion for record instance of type ${type} failed!`);
  }
  return obj;
}
*/
