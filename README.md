![logo](logo.png)

> Record.js is a constraint based type enforcement system for vanilla js.


Fiddle WIP: https://jsfiddle.net/524brseg/410

```ts
const R = require('record.js');

const RSettings = R('Settings', {
  foo: R.Number.Natural, 
  bar: R.Array.String.Choise(['a', 'b']), 
  biz: {
    baz: R.Number.Max(8).Min(0)
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
  biz: { baz: 1.654, boo: 'd' }, // Error: boo does not exist on object biz
  baz: 'hello', //                  Error: Length is not either less than 3 or greater than 9
  boz: (a, b, c) => a //            Error: Does not take exacly 2 arguments that maches /\d$/ + running the function with args (1, 2) does not return 3
});
```

## Constraint types:

* R
  * not: R
  * or(R[]): Final
  * and(R[]): Final
  * Number: Number
  * String: String
  * Boolean: Boolean
  * Function: Function
  * Array: Array
  * Any: Final
* Number
  * Max(num): Number
  * Min(num): Number
  * Exact(num): Number
  * Either(num[]): Number  
  * Between(num_a, num_b): Number
  * Any: Number
* String
  * Length: Number
  * Contains(str): String
  * Matches(regex): String
  * Any: Fianl
* Boolean
  * True: Fianl
  * False: Final
  * Any: Final
* Function
  * Arguments: Function_Arguments 
  * Test(...args): R
  * Any: Final
* Function_Arguments
  * Length: Number
  * Contains(str): Function_Arguments
  * Each: String
  * Any: Final
* Array
  * Length: Number
  * Contains(str): Array
  * Each: R
  * Any: Final
* Final

## Internal design (WIP)


