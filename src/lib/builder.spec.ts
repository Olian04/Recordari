import { assert, expect } from 'chai';
import { Builder } from './builder';
import { hasInternal, IInternal, INode, internal, NodeType } from './builder.interface';

const child = (node: IInternal, depth: number): IInternal =>
  depth === 0 ? node : child(node.children[0], depth - 1);
const assertChild = (node: IInternal, childDepth: number, type: NodeType) =>
  expect(child(node, childDepth).type).to.equal(type);

const test = (name: string, constraint: INode, cb: (internal: IInternal) => void) => {
  it(name, () => {
    if (hasInternal(constraint)) {
      assertChild(constraint[internal], 0, NodeType.Base);
      cb(constraint[internal].children[0]);
    } else {
      assert.fail();
    }
  });
};

describe('Builder', () => {
  test('Any', Builder.Any, (a) =>
    assertChild(a, 0, NodeType.Any),
  );
  test('Number', Builder.Number, (a) =>
    assertChild(a, 0, NodeType.Number),
  );
  test('Boolean', Builder.Boolean, (a) =>
    assertChild(a, 0, NodeType.Boolean),
  );
  test('Array', Builder.Array, (a) =>
    assertChild(a, 0, NodeType.Array),
  );
  test('String', Builder.String, (a) =>
    assertChild(a, 0, NodeType.String),
  );
  test('Regex', Builder.Regex, (a) =>
    assertChild(a, 0, NodeType.Regex),
  );
  test('And', Builder.and([ Builder.Number ]), (a) => {
    assertChild(a, 0, NodeType.And);
    assertChild(a, 1, NodeType.Base);
    assertChild(a, 2, NodeType.Number);
  });
  test('Or', Builder.or([ Builder.Number ]), (a) => {
    assertChild(a, 0, NodeType.Or);
    assertChild(a, 1, NodeType.Base);
    assertChild(a, 2, NodeType.Number);
  });
});
