Array.zip = (...arrays) => Array(Math.max(...arrays.map(arr => arr.length))).fill().map((_, i) => arrays.map(arr => arr[i]));

// START OF "API" LEVEL
const rootSymbol = Symbol('R-root');

const R_Void = root => ({
	[rootSymbol]: root
});

const R_Number = (root, self) => ({
	[rootSymbol]: root,
  Max(val) {
    self.children.push({
      type: 'Max',
      data: [val],
      children: []
    });
    return R_Number(root, self.children[0]);
  },
  Min(val) {
    self.children.push({
      type: 'Min',
      data: [val],
      children: []
    });
    return R_Number(root, self.children[0]);
  },
  Exact(val) {
    self.children.push({
      type: 'Exact',
      data: [val],
      children: []
    });
    return R_Number(root, self.children[0]);
  }
});

const R_Array = (root, self) => ({
	[rootSymbol]: root,
  get Length() {
  	self.children.push({
      type: 'Length',
      data: [],
      children: [
        {
          type: 'Number',
          data: [],
          children: []
        }
      ]
    });
    return R_Number(root, self.children[0].children[0]);
  },
  get Each() {
    self.children.push({
      type: 'Each',
      data: [],
      children: []
    });
    return R_Base(root, self.children[0]);
  },
  get Contains() {
    self.children.push({
      type: 'Contains',
      data: [],
      children: []
    });
    return R_Base(root, self.children[0]);
  },
  Like(Rs) {
    self.children.push({
      type: 'Like',
      data: [],
      children: Rs.map(r => r[rootSymbol])
    });
    return R_Void(root);
  }
});

const R_Base = (root, self) => ({
	[rootSymbol]: root,
  get Number() {
    self.children.push({
      type: 'Number',
      data: [],
      children: []
    });
    return R_Number(root, self.children[0]);
  },
  get Array() {
    self.children.push({
      type: 'Array',
      data: [],
      children: []
    });
    return R_Array(root, self.children[0]);
  },
  and(Rs) {
  	self.children.push({
      type: 'And',
      data: [],
      children: Rs.map(r => r[rootSymbol])
    });
    return R_Void(root);
  },
  or(Rs) {
  	self.children.push({
      type: 'Or',
      data: [],
      children: Rs.map(r => r[rootSymbol])
    });
    return R_Void(root);
  },
  get not() {
    self.children.push({
      type: 'Not',
      data: [],
      children: []
    });
    return R_Base(root, self.children[0])
  }
});

const R = new Proxy({}, {
  get(__, k) {
    const root = {
      type: 'R',
      data: [],
      children: []
    };
    return R_Base(root, root)[k];
  }
});

// END OF "API" LEVEL
// START OF "IMPLEMENTATION" LEVEL

// All predicates and extractions must have the signature: (value, args[]) => boolean
const predicates = {
	R: v => true,
  Array: v => Array.isArray(v),
  Number: v => typeof v === 'number',
  Max: (v, [a]) => v <= a,  
  Min: (v, [a]) => v >= a,
  Exact: (v, [a]) => v === a
}
const extractions = {
  Length: v => v.length
}
const Assert = (value, root) => {
  const _assert = (value, {type, data, children}) => {
    if (type in predicates) {
      // Standard predicates
      return predicates[type](value, data) && (children[0] === undefined || _assert(value, children[0]));
    }
    if (type in extractions) {
      // Standard extractions
      return children[0] === undefined || _assert(extractions[type](value, data), children[0]);
    }
    // Special rules
    if (type === 'Each') {
      return value.reduce((res, val) => res && _assert(val, children[0]), true);
    }
    if (type === 'Contains') {
      return value.reduce((res, val) => res || _assert(val, children[0]), false);
    }
    if (type === 'And') {
      return children.reduce((res, child) => res && _assert(value, child), true);
    }
    if (type === 'Or') {
      return children.reduce((res, child) => res || _assert(value, child), false);
    }
    if (type === 'Not') {
      return !_assert(value, children[0]);
    }
    if (type === 'Like') {
      return (value.length === children.length) && Array.zip(value, children).reduce((res, [value, child]) => res && _assert(value, child), true);
    }
    return false;
	};
  return _assert(value, root[rootSymbol]);
};

// END OF "IMPLEMENTATION" LEVEL
// START OF "TESTING"

console.clear();
const AssertAll = (constraint, data) => data.forEach(([d, t]) => 
  console.log(d, Assert(d, constraint) === t)
);

const vv = R.Array.Each.Number.Max(5);
console.log('each', vv);
AssertAll(vv, [
  [[1, 2, 3], true],
  [[1, 2, '3'], false],
  [[1, 7, 3], false]
]);

const vv_ = R.Array.Contains.Number.Min(5);
console.log('contains', vv_);
AssertAll(vv_, [
  [[1, 6], true],
  [[6, '3'], true],
  [[1, 2, 3], false]
]);

const vvv = R.Array.Each.and([
 R.Number.Max(5),
 R.Number.Min(2)
]);
console.log('and', vvv);
AssertAll(vvv, [
  [[2, 5], true],
  [[1, 5], false],
  [[2, 6], false],
  [[1, 6], false]
]);

const vvvv = R.Array.Each.or([
 R.Number,
 R.Array
]);
console.log('or', vvvv);
AssertAll(vvvv, [
  [[2, [5]], true],
  [[1, '5'], false]
]);

const w = R.not.Number;
console.log('not', w);
AssertAll(w, [
  ['2', true],
  [2, false]
]);

const ww = R.Array.Each.not.Number;
console.log('each not', ww);
AssertAll(ww, [
  [['1', [2], false], true],
  [['1', 2, true], false]
]);

const www = R.Array.Like([
  R.Number.Exact(1),
  R.Number.Exact(2)
]);
console.log('array like', www);
AssertAll(www, [
  [[1, 2], true],
  [[1, 3], false],
  [[0, 2], false],
  [['1', 2], false],
  [[1, 2, 3], false],
  [[1], false]
]);
