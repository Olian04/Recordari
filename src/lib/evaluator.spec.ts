import { expect } from 'chai';
import { Builder } from './builder';
import { Evaluate } from './evaluator';

const assertAll = (constraint, strRepConstraint: string, valuesToTest: [any, boolean][]) => {
  valuesToTest.forEach(([v, res]) => {
    const evaluation = Evaluate(v, constraint);
    expect(evaluation, `Expected Evaluate(${v}, ${strRepConstraint}) to be ${res}`).to.equal(res);
  });
}

enum DontExhaust {
  Number="Number",
  Array="Array",
  Object="Object",
  Boolean="Boolean",
  Function="Function",
  String="String",
  Regex="Regex"
}
const exhaustBaseCases = (constraint, strRepConstraint: string, dontExhaust: DontExhaust) => {
  // Since js can be a bit tricky with type coersions we need to exhaust all possible types for every assertion.
  assertAll(constraint, strRepConstraint, [
    [1, dontExhaust === DontExhaust.Number],
    [1.1, dontExhaust === DontExhaust.Number],
    [true, dontExhaust === DontExhaust.Boolean],
    [false, dontExhaust === DontExhaust.Boolean],
    [[], dontExhaust === DontExhaust.Array],
    [[1], dontExhaust === DontExhaust.Array],
    [[0], dontExhaust === DontExhaust.Array],
    [{}, dontExhaust === DontExhaust.Object], // Remember to test for func, null, undefined, arr
    [() => {}, dontExhaust === DontExhaust.Function],
    ["a", dontExhaust === DontExhaust.String],
    ["2", dontExhaust === DontExhaust.String],
    ["", dontExhaust === DontExhaust.String],
    ["123", dontExhaust === DontExhaust.String],
    ["abc", dontExhaust === DontExhaust.String],
    [/ /, dontExhaust === DontExhaust.Regex]
    // TODO: Decide on what to do with "null" and "undefined"
  ]);
}

const test = (k: string, cb: () => void) => {
  describe(k, () => {
    it(k, () =>  exhaustBaseCases(Builder[k], k, DontExhaust[k]) );
    cb();
  });
}

describe('Evaluator', () => {
  test('Number', () => {
    it('Exact', () => {
      assertAll(Builder.Number.Exact(2), 'Number.Exact(2)', [
        [2, true],
        [3, false],
        [1, false],
        [22, false],
        [0.2, false],
        [0b10, true], // Binary 2
        [0b1, false], // Binary 1
        [0o2, true], // Octal 2
        [0o1, false] // Octal 1
      ]);
    });
    it('Min', () => {
      assertAll(Builder.Number.Min(2), 'Number.Min(2)', [
        [3, true],
        [2, true],
        [1, false],
        [0b11, true], // Binary 3
        [0b10, true], // Binary 2
        [0b1, false], // Binary 1
        [0o3, true], // Octal 3
        [0o2, true], // Octal 2
        [0o1, false] // Octal 1
      ]);
    });
    it('Max', () => {
      assertAll(Builder.Number.Max(2), 'Number.Max(2)', [
        [1, true],
        [2, true],
        [3, false],
        [0b11, false], // Binary 3
        [0b10, true], // Binary 2
        [0b1, true], // Binary 1
        [0o3, false], // Octal 3
        [0o2, true], // Octal 2
        [0o1, true] // Octal 1
      ]);
    });
  });
  test('Array', () => {
    
  });
});

/*
const AssertAll = (constraint, data) => data.forEach(([d, t]) =>
  console.log(d, Assert(d, constraint) === t)
);

const vv = R.Array.Each.Number.Max(5);
console.log('each', vv);
AssertAll(vv, [
  [[1, 2, 3], true],
  [[1, 2, '3'], false],
  [[1, 7, 3], false]
]);

const vv_ = R.Array.Contains.Number.Min(5);
console.log('contains', vv_);
AssertAll(vv_, [
  [[1, 6], true],
  [[6, '3'], true],
  [[1, 2, 3], false]
]);

const vvv = R.Array.Each.and([
 R.Number.Max(5),
 R.Number.Min(2)
]);
console.log('and', vvv);
AssertAll(vvv, [
  [[2, 5], true],
  [[1, 5], false],
  [[2, 6], false],
  [[1, 6], false]
]);

const vvvv = R.Array.Each.or([
 R.Number,
 R.Array
]);
console.log('or', vvvv);
AssertAll(vvvv, [
  [[2, [5]], true],
  [[1, '5'], false]
]);

const w = R.not.Number;
console.log('not', w);
AssertAll(w, [
  ['2', true],
  [2, false]
]);

const ww = R.Array.Each.not.Number;
console.log('each not', ww);
AssertAll(ww, [
  [['1', [2], false], true],
  [['1', 2, true], false]
]);

const www = R.Array.Like([
  R.Number.Exact(1),
  R.Number.Exact(2)
]);
console.log('array like', www);
AssertAll(www, [
  [[1, 2], true],
  [[1, 3], false],
  [[0, 2], false],
  [['1', 2], false],
  [[1, 2, 3], false],
  [[1], false]
]);
*/
