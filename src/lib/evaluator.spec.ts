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
  Number = "Number",
  Array = "Array",
  Object = "Object",
  Boolean = "Boolean",
  Function = "Function",
  String = "String",
  Regex = "Regex",
  None = "None"
}
const exhaustBaseCases = (constraint, strRepConstraint: string, dontExhaust: DontExhaust, invert = false) => {
  // Since js can be a bit tricky with type coersions we need to exhaust all possible types for every assertion.
  assertAll(constraint, strRepConstraint, ([
    [1, dontExhaust === DontExhaust.Number],
    [1.1, dontExhaust === DontExhaust.Number],
    [true, dontExhaust === DontExhaust.Boolean],
    [false, dontExhaust === DontExhaust.Boolean],
    [[], dontExhaust === DontExhaust.Array],
    [[1], dontExhaust === DontExhaust.Array],
    [[0], dontExhaust === DontExhaust.Array],
    [{}, dontExhaust === DontExhaust.Object], // Remember to test for func, null, undefined, arr
    [() => { }, dontExhaust === DontExhaust.Function],
    ["a", dontExhaust === DontExhaust.String],
    ["2", dontExhaust === DontExhaust.String],
    ["", dontExhaust === DontExhaust.String],
    ["123", dontExhaust === DontExhaust.String],
    ["abc", dontExhaust === DontExhaust.String],
    [/ /, dontExhaust === DontExhaust.Regex]
    // TODO: Decide on what to do with "null" and "undefined"
  ].map(([v, b]) => [v, invert ? !b : b]) as [any, boolean][])
  );
}

const test = (k: string, cb: () => void) => {
  describe(k, () => {
    it(k, () => exhaustBaseCases(Builder[k], k, DontExhaust[k]));
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
    it('Array.Each', () => {
      assertAll(Builder.Array.Each, 'Builder.Array.Each', [
        [[], true],
        [[1, '2', [3]], true],
        [undefined, false]
      ]);
      assertAll(Builder.Array.Each.Number, 'Builder.Array.Each.Number', [
        [[], true],
        [[1, 2, 3], true],
        [[1, '2', 3], false]
      ]);
    });
    it('Array.Contains', () => {
      assertAll(Builder.Array.Contains, 'Builder.Array.Contains', [
        [[], true],
        [[1, '2', [3]], true],
        [undefined, false]
      ]);
      assertAll(Builder.Array.Contains.Number, 'Builder.Array.Contains.Number', [
        [[1, 2, 3], true],
        [[], false],
        [['1', '2', '3'], false],
        [['1', 2, '3'], true],
        [undefined, false]
      ]);
    });
    it('Array.Length', () => {
      assertAll(Builder.Array.Length, 'Builder.Array.Length', [
        [[], true],
        [[1, '2', [3]], true],
        [undefined, false]
      ]);
      assertAll(Builder.Array.Length.Exact(3), 'Builder.Array.Length.Exact(3)', [
        [[1, 2, 3], true],
        [['1', '2', '3'], true],
        [['1', 2, '3'], true],
        [[], false],
        [undefined, false]
      ]);
    });
    it('Array.Like', () => {
      assertAll(Builder.Array.Like([]), 'Array.Like([])', [
        [[], true],
        [[1], false]
      ]);
      assertAll(Builder.Array.Like([Builder]), 'Array.Like([ Builder ])', [
        [[1], true],
        [['1'], true],
        [[], false],
        [[1, 2], false],
        [undefined, false]
      ]);
      assertAll(Builder.Array.Like([Builder.Number.Exact(2), Builder]), 'Array.Like([ Builder.Number.Exact(2), Builder ])', [
        [[2, 1], true],
        [[2, 1, 3], false],
        [[2, '1'], true],
        [[1], false],
        [[], false],
        [[1, 2], false],
        [[1, 2, 3], false],
        [undefined, false]
      ]);
      assertAll(Builder.Array.Like([Builder.Number.Exact(1), Builder.Number.Exact(2)]), 'Array.Like([ Builder.Number.Exact(2), Builder ])', [
        [[1, 2], true],
        [[1, 3], false],
        [[0, 2], false],
        [['1', 2], false],
        [[1, 2, 3], false],
        [[1], false]
      ]);
    });
  });
  it('And', () => {
    exhaustBaseCases(Builder.Array.Each.and([]), 'Array.Each.and([])', DontExhaust.Array);
    assertAll(Builder.Array.Each.and([]), 'Array.Each.and([])', [
      [[], true],
      [[1, 2, 3], true],
      [[1], true],
      [undefined, false]
    ]);
    assertAll(Builder.Array.Each.and([
      Builder.Number.Max(5),
      Builder.Number.Min(2)
    ]), 'Array.Each.and([ Builder.Number.Max(5), Builder.Number.Min(2) ])', [
        [[2, 5], true],
        [[1, 5], false],
        [[2, 6], false],
        [[1, 6], false]
      ]);
  });
  it('Or', () => {
    exhaustBaseCases(Builder.Array.Each.or([]), 'Array.Each.or([])', DontExhaust.Array);
    assertAll(Builder.Array.Each.or([]), 'Array.Each.or([])', [
      [[], true],
      [[1, 2, 3], true],
      [[1], true],
      [undefined, false]
    ]);
    assertAll(Builder.Array.Each.or([
      Builder.Number,
      Builder.Array
    ]), 'Array.Each.or([ Builder.Number, Builder.Array ])', [
        [[2, [5]], true],
        [[[5]], true],
        [[2], true],
        [[1, '5'], false],
        [[[1], '5'], false],
      ]);
  });
  it('Not', () => {
    exhaustBaseCases(Builder.not.Number, 'not.Number', DontExhaust.Number, true);
    assertAll(Builder.Array.Each.not.Number, 'Array.Each.not.Number', [
      [['1', [2], false], true],
      [['1', 2, true], false]
    ])
  });
  it('Any', () => {
    exhaustBaseCases(Builder.Any, 'Any', DontExhaust.None, true);
  })
});
