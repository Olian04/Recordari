import { expect, assert } from 'chai';
import { Builder } from './builder';
import { internal, hasInternal, NodeType } from './builder.interface';

describe('builder', () => {
  it('Any', () => {
    const a = Builder.Any;
    if (hasInternal(a)) {
      expect(
        a[internal].type
        // Builder
      ).to.equal(NodeType.Base);
      expect(
        a[internal].children[0].type
        // Builder.Any
      ).to.equal(NodeType.Any);
    } else {
      assert.fail();
    }
  });
  it('Number', () => {
    const a = Builder.Number;
    if (hasInternal(a)) {
      expect(
        a[internal].type
        // Builder
      ).to.equal(NodeType.Base);
      expect(
        a[internal].children[0].type
        //Builder.Number
      ).to.equal(NodeType.Number);
    } else {
      assert.fail();
    }
  });
  it('and', () => {
    const a = Builder.and([
      Builder.Number
    ]);
    if (hasInternal(a)) {
      expect(
        a[internal].type
        // Builder
      ).to.equal(NodeType.Base);
      expect(
        a[internal].children[0].type
        //Builder.and([])
      ).to.equal(NodeType.And);
      expect(
        a[internal].children[0].children[0].type
        //Builder.and([ Builder ])
      ).to.equal(NodeType.Base);
      expect(
        a[internal].children[0].children[0].children[0].type
        //Builder.and([ Builder.Number ])
      ).to.equal(NodeType.Number);
    } else {
      assert.fail();
    }
  });
});
