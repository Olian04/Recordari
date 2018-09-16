![logo](assets/logo.png)

|         |  Master           | Next  |
|:------------:|:-----------------:|:------:|
| Tests             | [![CI - Master](https://circleci.com/gh/Olian04/Record.js/tree/master.svg?style=svg&circle-token=7dc7a0d0d63d7e8f42cdad6cc08f102a144f72a0)](https://circleci.com/gh/Olian04/Record.js/tree/master) |[![CI - Next](https://circleci.com/gh/Olian04/Record.js/tree/next.svg?style=svg&circle-token=7dc7a0d0d63d7e8f42cdad6cc08f102a144f72a0)](https://circleci.com/gh/Olian04/Record.js/tree/next) |
| Coverage  | [![codecov](https://codecov.io/gh/Olian04/Record.js/branch/master/graph/badge.svg?token=S2jhTAlWAh)](https://codecov.io/gh/Olian04/Record.js/branch/master)  | [![codecov](https://codecov.io/gh/Olian04/Record.js/branch/next/graph/badge.svg?token=S2jhTAlWAh)](https://codecov.io/gh/Olian04/Record.js/branch/next) |
| Dependencies | [![Master - Known Vulnerabilities](https://snyk.io/test/github/Olian04/Record.js/badge.svg)](https://snyk.io/test/github/Olian04/Record.js) | [![Known Vulnerabilities](https://snyk.io/test/github/Olian04/Record.js/next/badge.svg)](https://snyk.io/test/github/Olian04/Record.js/next) |

> Record.js is a type and structure validation tool for configuration files.

```ts
const { Record, R } = require('record.js');

const RConfig = Record('MyConfig', {
  port: R.Number.Natural,
  env: R.String.Either(['dev', 'prod']),
  loglevel: R.String.Either(['none', 'error', 'warn', 'info', 'debug'])
});

const config = RConfig(require('config.json')); // Will throw if a constraint fails
config.loglevel // Will ALWAYS be valid
config.port     // Will ALWAYS be valid
config.env      // Will ALWAYS be valid
```

[Webpack example](examples/RWebpackConfig.js)

[NPM example](examples/RPackageJSON.js)

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
  ]),
  bez: R.and([
    R.Regex.Test('1.1.0').True,
    R.Regex.Test('0.0.0').False
  ])
});

const okRecord = RSettings({
  foo: 5,
  bar: ['b'],
  biz: { baz: 1.654 },
  baz: 'hi',
  boz: (arg1, arg2) => arg1 + arg2,
  bez: /^(?!0\.0\.\d+$)\d+\.\d+\.\d+$/
});

const failRecord = RSettings({
  foo: 5.01, //                     Error: Settings.foo => 5.01 is not a natural number
  bar: ['c'], //                    Error: Settings.bar[0] => 'c' is not in ['a', 'b']
  biz: { baz: 1.654, boo: 'd' }, // Error: Settings.biz => Unexpected key 'boo'.
  baz: 'hello', //                  Error: Settings.baz => 'hello'.length is not, less than 3, nor greater than 9
  boz: (a, b, c) => a, //           Error: Settings.boz => Function does not take exacly 2 arguments.
  hello: 'Record.js' //             Error: Settings => Unexpected key 'hello'.
  bez: /^\d+\.\d+\.\d+$/ //         Error: Settings.bez => '0.0.0'.match should be false
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
  * Null: Void
  * Undefined: Void
  * Any: Void
  * Custom(predicate): R
* Number
  * not: Number
  * Natural: Number
  * Decimal: Number
  * Whole: Number
  * Max(num): Number
  * Min(num): Number
  * Exact(num): Number
  * Either(num[]): Number
  * Between(num_a, num_b): Number
* String
  * not: String
  * Length: Number
  * Each: String
  * Exact(str): String
  * Either(str[]): String
  * StartsWith(str): String
  * EndsWith(str): String
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
