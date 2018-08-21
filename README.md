![logo](logo.png)

> Record.js is a constraint based type enforcement system for vanilla js. 

[Webpack example](examples/RWebpackConfig.js)

Fiddle WIP v4: https://jsfiddle.net/09ouas1m/340/

~~Fiddle WIP v3: https://jsfiddle.net/ua1zj9Lk/343/~~

~~Fiddle WIP v2: https://jsfiddle.net/524brseg/410/~~

```ts
const { Record, R } = require('record.js');

const RSettings = Record('Settings', {
  foo: R.Number.Natural, 
  bar: R.Array.Each.String.Either(['a', 'b']), 
  biz: {
    baz: R.Number.Between(0, 8)
  },
  baz: R.or([
    R.String.Length.Max(2),
    R.String.Length.Min(10)
  ]),
  boz: R.and([
    R.Function.Arguments.Length.Exact(2),
    R.Function.Arguments.Each.Matches(/\d$/),
    R.Function.Test(1, 2).Number.Exact(3)
  ])
});

const okRecord = RSettings({
  foo: 5,
  bar: ['b'], 
  biz: { baz: 1.654 },
  baz: 'hi', 
  boz: (arg1, arg2) => arg1 + arg2 
});

const failRecord = RSettings({
  foo: 5.01, //                     Error: Settings.foo => 5.01 is not a natural number
  bar: ['c'], //                    Error: Settings.bar[0] => 'c' is not in ['a', 'b'] 
  biz: { baz: 1.654, boo: 'd' }, // Error: Settings.biz => Unexpected key 'boo'.
  baz: 'hello', //                  Error: Settings.baz => 'hello'.length is not, less than 3, nor greater than 9
  boz: (a, b, c) => a, //           Error: Settings.boz => Function does not take exacly 2 arguments.
  hello: 'Record.js' //             Error: Settings => Unexpected key 'hello'.
});
```

---

```ts
const { Record, R } = require('record.js');

const ROptionals = Record('Optionals', {
  foo: R.Number, // Required
  'bar?': R.Number, // Optional, but need to be a number if pressent
  'bar!': 2,        // Default value for 'bar' if none was passed in.
  '?': R.Number // '?' applies to all unknown keys, if its missing then unknown keys are prohibited
});

const okRecord = ROptionals({
  foo: 1,
  // bar = 2
  biz: 3
});

const failRecord = ROptionals({
  foo: '1', //                 Error: Settings.foo => '1' is not a number
  bar: '2', //                 Error: Settings.bar => '2' is not a number
  biz: '3' //                  Error: Settings.biz => '3' is not a number
});
```

---

```ts
const { Assert, R } = require('record.js');

const constraint = R.Array.Each.Number;

const trueAssert = Assert([1, 2, 3], constraint);

const falseAssert = Assert([1, '2', 3], constraint);

Assert([1, '2', 3], constraint, msg =>
  throw new Error(msg) // Error: this[1] => '2' is not a number.
);
```

## Constraint types:

* R
  * not: R
  * or(R[]): Void
  * and(R[]): Void
  * Number: Number
  * String: String
  * Boolean: Boolean
  * Function: Function
  * Array: Array
  * Object: Object
  * Regex: Regex
* Number
  * Max(num): Number
  * Min(num): Number
  * Exact(num): Number
  * Either(num[]): Number  
  * Between(num_a, num_b): Number
* String
  * Length: Number
  * Exact(str): String
  * Either(str[]): String
  * Matches(regex): String
* Boolean
  * True: Void
  * False: Void
* Function
  * Arguments: Function_Arguments 
  * Test(...args): R
* Function_Arguments
  * Length: Number
  * Contains: String
  * Each: String
* Array
  * Length: Number
  * Contains: R
  * Each: R
  * Like(array): Void
* Object
  * Values: Array
  * Keys: Array
  * Like(obj): Void
* Regex
  * Test(str): Boolean
* Void
