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
});
