import { expect } from 'chai';
import { Builder } from './builder';
import { Evaluate } from './evaluator';

import { NodeType } from './builder.interface';
import { extractions } from './evaluators/extraction.evaluators';
import { predicates } from './evaluators/predicate.evaluators';
import { unique } from './evaluators/unique.evaluators';

const assertAll = (constraint, strRepConstraint: string, valuesToTest: Array<[any, boolean]>) => {
  valuesToTest.forEach(([v, res]) => {
    const evaluation = Evaluate(v, constraint);
    expect(evaluation, `Expected Evaluate(${v}, ${strRepConstraint}) to be ${res}`).to.deep.equal(res);
  });
};

enum DontExhaust {
  Number = 'Number',
  Array = 'Array',
  Object = 'Object',
  Boolean = 'Boolean',
  Function = 'Function',
  String = 'String',
  Regex = 'Regex',
  None = 'None',
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
    [({}), dontExhaust === DontExhaust.Object],
    [() => {/* */}, dontExhaust === DontExhaust.Function],
    ['a', dontExhaust === DontExhaust.String],
    ['2', dontExhaust === DontExhaust.String],
    ['', dontExhaust === DontExhaust.String],
    ['123', dontExhaust === DontExhaust.String],
    ['abc', dontExhaust === DontExhaust.String],
    [/ /, dontExhaust === DontExhaust.Regex],
  ].map(([v, b]) => [v, invert ? !b : b]) as Array<[any, boolean]>),
  );
};

const test = (k: string, cb: () => void) => {
  describe(k, () => {
    it(k, () => exhaustBaseCases(Builder[k], k, DontExhaust[k]));
    cb();
  });
};

describe('Evaluator', () => {
  it('All NodeTypes have evaluators', () => {
    Object.keys(NodeType).forEach((k) =>
      expect(
        k in predicates ||
        k in extractions ||
        k in unique,
        `Evaluator missing for NodeType.${k}`).to.be.true,
      );
  });
  test('Object', () => {
    it('Like', () => {
      assertAll(Builder.Object.Like({ foo: Builder.Number }), 'Object.Keys.Like({ foo: Builder.Number })', [
        [{ foo: 1 }, true],
        [{ foo: '1' }, false],
        [{}, false],
        [{  foo: 1, bar: 2 }, false],
      ]);
    });
    it('Keys', () => {
      assertAll(Builder.Object.Keys.Length.Exact(2), 'Object.Keys.Length.Exact(2)', [
        [{a: 1, b: 2}, true],
        [{ 1: 'a', 2: 'b'}, true],
        [{a: 1}, false],
        [{}, false],
        [{ 1: 'a'}, false],
      ]);
    });
    it('Values', () => {
      assertAll(Builder.Object.Values.Each.Number, 'Object.Values.Each.Number', [
        [{a: 'a', b: 'a'}, false],
        [{a: 'a'}, false],
        [{}, true],
        [{a: 1}, true],
        [{a: 1, b: 2}, true],
      ]);
    });
  });
  test('Boolean', () => {
    it('True', () => {
      assertAll(Builder.Boolean.True, 'Boolean.True', [
        [true, true],
        [false, false],
      ]);
    });
    it('False', () => {
      assertAll(Builder.Boolean.False, 'Boolean.False', [
        [false, true],
        [true, false],
      ]);
    });
  });
  test('Regex', () => {
    it('Test', () => {
      assertAll(Builder.Regex.Test('abc').True, 'Regex.Test("abc")', [
        [/a/, true],
        [/b/, true],
        [/c/, true],
        [/ab/, true],
        [/bc/, true],
        [/abc/, true],
        [/ac/, false],
        [/ /, false],
        [/1/, false],
        [/a1b/, false],
        [/a1c/, false],
      ]);
      // Regex.Test is just an extractor, it doesn't assert the truthyness of the evaluation
      assertAll(Builder.Regex.Test('abc'), 'Regex.Test("abc")', [
        [/a/, true],
        [/b/, true],
        [/c/, true],
        [/ab/, true],
        [/bc/, true],
        [/abc/, true],
        [/ac/, true],
        [/ /, true],
        [/1/, true],
        [/a1b/, true],
        [/a1c/, true],
      ]);
    });
  });
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
        [0o1, false], // Octal 1
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
        [0o1, false], // Octal 1
      ]);
    });
    it('Natural', () => {
      assertAll(Builder.Number.Natural, 'Number.Natural', [
        [-1, false],
        [-0.5, false],
        [0, true],
        [0.5, true],
        [1, true],
      ]);
    });
    it('Whole', () => {
      assertAll(Builder.Number.Whole, 'Number.Whole', [
        [-1, true],
        [-0.5, false],
        [0, true],
        [0.5, false],
        [1, true],
      ]);
    });
    it('Either', () => {
      assertAll(Builder.Number.Either([1, 2]), 'Number.Either([1, 2])', [
        [-1, false],
        [-0.5, false],
        [0, false],
        [0.5, false],
        [1, true],
        [1.5, false],
        [2, true],
      ]);
    });
    it('Mod', () => {
      assertAll(Builder.Number.Mod(2, 1), 'Number.Mod(2, 1)', [
        [-2, false],
        [-1, true],
        [-0.5, false],
        [0, false],
        [0.5, false],
        [1, true],
        [2, false],
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
        [0o1, true], // Octal 1
      ]);
    });
    it('Between', () => {
      assertAll(Builder.Number.Between(1, 2), 'Number.Number.Between(1,2)', [
        [0, false],
        [1, true],
        [2, true],
        [3, false],
        [0b11, false], // Binary 3
        [0b10, true], // Binary 2
        [0b1, true], // Binary 1
        [0o3, false], // Octal 3
        [0o2, true], // Octal 2
        [0o1, true], // Octal 1
      ]);
    });
    it('not', () => {
      assertAll(Builder.Number.not.Exact(2), 'Number.not.Exact(2)', [
        [1, true],
        [2, false],
        [0b11, true], // Binary 3
        [0b10, false], // Binary 2
        [0b1, true], // Binary 1
        [0o3, true], // Octal 3
        [0o2, false], // Octal 2
        [0o1, true], // Octal 1
      ]);
    });
  });
  test('Array', () => {
    it('Each', () => {
      assertAll(Builder.Array.Each, 'Builder.Array.Each', [
        [[], true],
        [[1, '2', [3]], true],
        [undefined, false],
      ]);
      assertAll(Builder.Array.Each.Number, 'Builder.Array.Each.Number', [
        [[], true],
        [[1, 2, 3], true],
        [[1, '2', 3], false],
      ]);
    });
    it('Contains', () => {
      assertAll(Builder.Array.Contains, 'Builder.Array.Contains', [
        [[], true],
        [[1, '2', [3]], true],
        [undefined, false],
      ]);
      assertAll(Builder.Array.Contains.Number, 'Builder.Array.Contains.Number', [
        [[1, 2, 3], true],
        [[], false],
        [['1', '2', '3'], false],
        [['1', 2, '3'], true],
        [undefined, false],
      ]);
    });
    it('Length', () => {
      assertAll(Builder.Array.Length, 'Builder.Array.Length', [
        [[], true],
        [[1, '2', [3]], true],
        [undefined, false],
      ]);
      assertAll(Builder.Array.Length.Exact(3), 'Builder.Array.Length.Exact(3)', [
        [[1, 2, 3], true],
        [['1', '2', '3'], true],
        [['1', 2, '3'], true],
        [[], false],
        [undefined, false],
      ]);
    });
    it('Like', () => {
      assertAll(Builder.Array.Like([]), 'Array.Like([])', [
        [[], true],
        [[1], false],
      ]);
      assertAll(Builder.Array.Like([Builder]), 'Array.Like([ Builder ])', [
        [[1], true],
        [['1'], true],
        [[], false],
        [[1, 2], false],
        [undefined, false],
      ]);
      assertAll(Builder.Array.Like([
        Builder.Number.Exact(2),
        Builder,
      ]), 'Array.Like([ Builder.Number.Exact(2), Builder ])', [
        [[2, 1], true],
        [[2, 1, 3], false],
        [[2, '1'], true],
        [[1], false],
        [[], false],
        [[1, 2], false],
        [[1, 2, 3], false],
        [undefined, false],
      ]);
      assertAll(Builder.Array.Like([
        Builder.Number.Exact(1),
        Builder.Number.Exact(2),
      ]), 'Array.Like([ Builder.Number.Exact(2), Builder ])', [
        [[1, 2], true],
        [[1, 3], false],
        [[0, 2], false],
        [['1', 2], false],
        [[1, 2, 3], false],
        [[1], false],
      ]);
    });
  });
  it('And', () => {
    exhaustBaseCases(Builder.Array.Each.and([]), 'Array.Each.and([])', DontExhaust.Array);
    assertAll(Builder.Array.Each.and([]), 'Array.Each.and([])', [
      [[], true],
      [[1, 2, 3], true],
      [[1], true],
      [undefined, false],
    ]);
    assertAll(Builder.Array.Each.and([
      Builder.Number.Max(5),
      Builder.Number.Min(2),
    ]), 'Array.Each.and([ Builder.Number.Max(5), Builder.Number.Min(2) ])', [
        [[2, 5], true],
        [[1, 5], false],
        [[2, 6], false],
        [[1, 6], false],
      ]);
  });
  it('Or', () => {
    exhaustBaseCases(Builder.Array.Each.or([]), 'Array.Each.or([])', DontExhaust.Array);
    assertAll(Builder.Array.Each.or([]), 'Array.Each.or([])', [
      [[], true],
      [[1, 2, 3], true],
      [[1], true],
      [undefined, false],
    ]);
    assertAll(Builder.Array.Each.or([
      Builder.Number,
      Builder.Array,
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
      [['1', 2, true], false],
    ]);
  });
  it('Any', () => {
    exhaustBaseCases(Builder.Any, 'Any', DontExhaust.None, true);
    exhaustBaseCases(Builder.not.Any, 'Any', DontExhaust.None);
  });
  it('Undefined', () => {
    exhaustBaseCases(Builder.Undefined, 'Undefined', DontExhaust.None);
    assertAll(Builder.Undefined, 'Undefined', [
      [undefined, true],
      [null, false],
    ]);
  });
  it('Null', () => {
    exhaustBaseCases(Builder.Null, 'Null', DontExhaust.None);
    assertAll(Builder.Null, 'Null', [
      [null, true],
      [undefined, false],
    ]);
  });
  it('Custom', () => {
    assertAll(Builder.Custom((v) => v === 0), 'Custom(v => v === 0)', [
      [0, true],
      [0.1, false],
      ['0', false],
      ['', false],
      [undefined, false],
      [null, false],
      [true, false],
      [false, false],
      [1, false],
    ]);
  });
  test('String', () => {
    it('Exact', () => {
      assertAll(Builder.String.Exact('hello'), 'String.Exact("hello")', [
        ['hello', true],
        ['bye', false],
        ['', false],
      ]);
    });
    it('Not', () => {
      assertAll(Builder.String.not.Exact('hello'), 'String.not.Exact("hello")', [
        ['hello', false],
        ['hell', true],
        ['helloj', true],
        ['bye', true],
        ['', true],
      ]);
    });
    it('Length', () => {
      assertAll(Builder.String.Length.Exact(2), 'String.Length.Exact(2)', [
        ['hi', true],
        ['bye', false],
        ['', false],
      ]);
    });
    it('Either', () => {
      assertAll(Builder.String.Either(['ab', 'bc']), 'String.Either(["ab", "bc"])', [
        ['ab', true],
        ['bc', true],
        ['ac', false],
        ['ba', false],
        ['cb', false],
        ['', false],
      ]);
    });
    it('StartsWith', () => {
      assertAll(Builder.String.StartsWith('ab'), 'String.StartsWith("ab")', [
        ['ab', true],
        ['abc', true],
        ['ab c', true],
        ['a b', false],
        ['acb', false],
        ['', false],
      ]);
    });
    it('EndsWith', () => {
      assertAll(Builder.String.EndsWith('ab'), 'String.EndsWith("ab")', [
        ['ab', true],
        ['cab', true],
        ['c ab', true],
        ['a b', false],
        ['acb', false],
        ['', false],
      ]);
    });
    it('Matches', () => {
      assertAll(Builder.String.Matches(/^a+$/), 'String.Matches(/a+/)', [
        ['a', true],
        ['aa', true],
        ['aaa', true],
        ['a a', false],
        ['aa a', false],
        [' aaa', false],
        ['', false],
      ]);
    });
  });
});
