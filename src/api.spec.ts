import { expect  } from 'chai';

import { foo } from './api';

describe('api', () => {
  it('foo should return "foo"', () => {
    expect(foo('foo')).to.equal('foo');
  });
});
