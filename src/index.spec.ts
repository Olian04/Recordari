import { expect  } from 'chai';

import { foo } from './index';

describe('index.ts', () => {
  it('foo should return "foo"', () => {
    expect(foo()).to.equal('foo');
  });
});
