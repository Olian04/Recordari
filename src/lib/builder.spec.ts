import { expect, assert } from 'chai';
import { Builder } from './builder';
import { internal, hasInternal, NodeType, IInternal } from './builder.interface';

const child = (node: IInternal, depth: number): IInternal => depth === 0 ? node : child(node.children[0], depth-1);
const assertChildType = (node: IInternal, childDepth: number, type: NodeType) => expect(child(node, childDepth).type).to.equal(type);
const test = (name: string, constraint, cb: (internal: IInternal) => void) => {
  it(name, () => {
    if (hasInternal(constraint)) {
      assertChildType(constraint[internal], 0, NodeType.Base);
      cb(constraint[internal].children[0]);
    } else {
      assert.fail();
    }
  })
}

describe('builder', () => {
  test('Any', Builder.Any, a =>
    assertChildType(a, 0, NodeType.Any)
  );
  test('Number', Builder.Number, a =>
    assertChildType(a, 0, NodeType.Number)
  );
  test('and', Builder.and([ Builder.Number ]), a => {
    assertChildType(a, 0, NodeType.And);
    assertChildType(a, 1, NodeType.Base);
    assertChildType(a, 2, NodeType.Number);
  });
});
