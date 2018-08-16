![logo](logo.png)

> Record.js is a constraint based type enforcement system for vanilla js. <br>
> Record.js draws insperation from the way webpack handels its configuration file.

[Webpack example](examples/RWebpackConfig.js)

Fiddle WIP v4: https://jsfiddle.net/09ouas1m/298/

~~Fiddle WIP v3: https://jsfiddle.net/ua1zj9Lk/343/~~

~~Fiddle WIP v2: https://jsfiddle.net/524brseg/410/~~

```ts
const R = require('record.js');

const RSettings = R('Settings', {
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
  foo: 5.01, //                     Error: Not a positive integer
  bar: ['c'], //                    Error: 'c' is not in ['a', 'b'] 
  biz: { baz: 1.654, boo: 'd' }, // Error: Unexpected key 'boo' on 'Settings.biz'.
  baz: 'hello', //                  Error: Length is not either less than 3 or greater than 9
  boz: (a, b, c) => a, //           Error: Does not take exacly 2 arguments that maches /\d$/
  hello: 'Record.js' //             Error: Unexpected key 'hello' on 'Settings'.
});
```

---

```ts
const ROptionals = R('Optionals', {
  foo: R.Number, // Required
  'bar?': R.Number, // Optional, but need to be a number if pressent
  '?': R.Number // '?' applies to all unknown keys, if its missing then unknown keys are prohibited
});

const okRecord = ROptionals({
  foo: 1,
  biz: 3
});

const okRecord = ROptionals({
  foo: '1', //                 Error: Not a number
  bar: '2', //                 Error: Not a number
  biz: '3' //                  Error: Not a number
});
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
