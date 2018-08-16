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
  boz: (a, b, c) => a, //           Error: Does not take exacly 2 arguments that maches /\d$/ + running the function with args (1, 2) does not return 3
  hello: 'Record.js' //             Error: Unexpected key 'hello' on 'Settings'.
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
  * True: Fianl
  * False: Final
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

## Internal design (WIP)

The [current wip](https://jsfiddle.net/524brseg/410) functions like a reversed single linked list, but it is quickly becoming hard to work with. I think that a redesign would get rid of most problems. 

I'm thinking of going with a "proxy based Tree structure" instead. 
* The proxy would get rid of a current problem with infinetly long dependancy graphs, e.g. R.Number.Max(0).Max(1).Max(2)...
* The Tree whould lay the groundworks for both OR & AND operations, as well as getting rid of the current (hacky) way of traversing the constraints. 
  * The goal (which the current demo succeedes at) is to evaluate each constraint Tree from the root and up, including a way of exiting evaluation early if a constraint fails, e.g. "R.Number.Max(2)" should only execute "R.Number" if the input isn't a number and only execude "Max(2)" is all previous constraints have been met.
  * A Tree could also allow for negation on constraints which is NOT possible in the current demo.
