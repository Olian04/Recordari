import { expect  } from 'chai';

import './collections';

describe('util/collections', () => {
  describe('Array.zip', () => {
      it('zip([1, 2, 3], [a, b, c])', () => {
        const a = [1, 2, 3];
        const b = ['a', 'b', 'c'];
        const c = Array.zip(a, b);
        expect(c[0]).to.deep.equal([1, 'a']);
        expect(c[1]).to.deep.equal([2, 'b']);
        expect(c[2]).to.deep.equal([3, 'c']);
      });
      it('zip([1, 2, 3], [a])', () => {
        const a = [1, 2, 3];
        const b = ['a'];
        const c = Array.zip(a, b);
        expect(c[0]).to.deep.equal([1, 'a']);
        expect(c[1]).to.deep.equal([2, undefined]);
        expect(c[2]).to.deep.equal([3, undefined]);
      });
      it('zip([1], [a, b, c])', () => {
        const a = [1];
        const b = ['a', 'b', 'c'];
        const c = Array.zip(a, b);
        expect(c[0]).to.deep.equal([1, 'a']);
        expect(c[1]).to.deep.equal([undefined, 'b']);
        expect(c[2]).to.deep.equal([undefined, 'c']);
      });
  });
});
