import { expect } from 'chai';
import { R, Record } from './api';

describe('api', () => {
  it('R', () => {
    expect(R).to.not.be.undefined;
  });
  it('Record', () => {
    expect(typeof Record).to.equal('function');
    const RTest = Record('test', {});
    expect(typeof RTest).to.equal('function');
    try {
      const test = RTest({});
      expect(test).to.deep.equal({});
    } catch {
      expect.fail();
    }
    try {
      const test = RTest({ foo: 'i should fail' });
      expect.fail();
    } catch (e) {
      expect(e).to.be.an.instanceof(TypeError);
    }
  });
  describe('Usage examples', () => {
    it('Full example from README', () => {
      const RSettings = Record('Settings', {
        foo: R.Number.Natural,
        bar: R.Array.Each.String.Either(['a', 'b']),
        biz: R.Object.Like({
          baz: R.Number.Between(0, 8)
        }),
        baz: R.or([
          R.String.Length.Max(2),
          R.String.Length.Min(10)
        ]),
        bez: R.and([
          R.Regex.Test('1.1.0').True,
          R.Regex.Test('0.0.0').False
        ])
      });

      try {
        const obj = {
          foo: 5,
          bar: ['b'],
          biz: { baz: 1.654 },
          baz: 'hi',
          bez: /^(?!0\.0\.\d+$)\d+\.\d+\.\d+$/
        };
        const okRecord = RSettings(obj);
        expect(okRecord).to.deep.equal(obj);
      } catch {
        expect.fail();
      }

      try {
        const failRecord = RSettings({
          foo: 5.01, //                     Error: Settings.foo => 5.01 is not a natural number
          bar: ['c'], //                    Error: Settings.bar[0] => 'c' is not in ['a', 'b']
          biz: { baz: 1.654, boo: 'd' }, // Error: Settings.biz => Unexpected key 'boo'.
          baz: 'hello', //                  Error: Settings.baz => 'hello'.length is not, less than 3, nor greater than 9
          hello: 'Record.js', //             Error: Settings => Unexpected key 'hello'.
          bez: /^\d+\.\d+\.\d+$/ //         Error: Settings.bez => '0.0.0'.match should be false
        });
        expect.fail();
      } catch {
        expect(true).true;
      }
    });
  });
});
