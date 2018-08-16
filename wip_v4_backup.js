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

const v = R.Array.Length.Max(2).Max(3);
console.log(v);


// All predicates and extractions must have the signature: (value, args[]) => boolean
const predicates = {
	R: v => true,
  Array: v => Array.isArray(v),
  Number: v => typeof v === 'number',
  Max: (v, [a]) => v <= a,  
  Min: (v, [a]) => v >= a,
}
const extractions = {
  Length: v => v.length
}
const assert = (value, root) => {
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
    if (type === 'And') {
      return children.reduce((res, child) => res && _assert(value, child), true);
    }
    return false;
	};
  return _assert(value, root[rootSymbol]);
};

console.log([1, 2], assert([1, 2], v));
console.log([1, 2, 3], assert([1, 2, 3], v));

const vv = R.Array.Each.Number.Max(5);
console.log(vv);

console.log([1, 2, 3], assert([1, 2, 3], vv));
console.log([1, 2, '3'], assert([1, 2, '3'], vv));
console.log([1, 7, 3], assert([1, 7, 3], vv));

const vvv = R.Array.Each.and([
 R.Number.Max(5),
 R.Number.Min(2)
]);
console.log(vvv);
console.log([2, 5], assert([2, 5], vvv));
console.log([1, 5], assert([1, 5], vvv));
console.log([2, 6], assert([2, 6], vvv));