import { expect, assert } from 'chai';
import { Builder } from './builder';
import { internal, hasInternal, NodeType, IInternal } from './builder.interface';

const child = (node: IInternal, depth: number): IInternal => depth === 0 ? node : child(node.children[0], depth-1);
const assertChild = (node: IInternal, childDepth: number, type: NodeType) => expect(child(node, childDepth).type).to.equal(type);
const test = (name: string, constraint, cb: (internal: IInternal) => void) => {
  it(name, () => {
    if (hasInternal(constraint)) {
      assertChild(constraint[internal], 0, NodeType.Base);
      cb(constraint[internal].children[0]);
    } else {
      assert.fail();
    }
  })
}

describe('builder', () => {
  test('Any', Builder.Any, a =>
    assertChild(a, 0, NodeType.Any)
  );
  test('Number', Builder.Number, a =>
    assertChild(a, 0, NodeType.Number)
  );
  test('and', Builder.and([ Builder.Number ]), a => {
    assertChild(a, 0, NodeType.And);
    assertChild(a, 1, NodeType.Base);
    assertChild(a, 2, NodeType.Number);
  });
  test('or', Builder.or([ Builder.Number ]), a => {
    assertChild(a, 0, NodeType.Or);
    assertChild(a, 1, NodeType.Base);
    assertChild(a, 2, NodeType.Number);
  });
});
