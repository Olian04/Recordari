![logo](./assets/logo.png)

|         |  Master           | Next  |
|:------------:|:-----------------:|:------:|
| Tests             | [![CI - Master](https://circleci.com/gh/Olian04/Recordari/tree/master.svg?style=svg&circle-token=7dc7a0d0d63d7e8f42cdad6cc08f102a144f72a0)](https://circleci.com/gh/Olian04/Recordari/tree/master) |[![CI - Next](https://circleci.com/gh/Olian04/Recordari/tree/next.svg?style=svg&circle-token=7dc7a0d0d63d7e8f42cdad6cc08f102a144f72a0)](https://circleci.com/gh/Olian04/Recordari/tree/next) |
| Coverage  | [![codecov](https://codecov.io/gh/Olian04/Recordari/branch/master/graph/badge.svg?token=S2jhTAlWAh)](https://codecov.io/gh/Olian04/Recordari/branch/master)  | [![codecov](https://codecov.io/gh/Olian04/Recordari/branch/next/graph/badge.svg?token=S2jhTAlWAh)](https://codecov.io/gh/Olian04/Recordari/branch/next) |
| Dependency Analysis | [![Master - Known Vulnerabilities](https://snyk.io/test/github/Olian04/Recordari/badge.svg)](https://snyk.io/test/github/Olian04/Recordari) | [![Next -  Known Vulnerabilities](https://snyk.io/test/github/Olian04/Recordari/next/badge.svg)](https://snyk.io/test/github/Olian04/Recordari/next) |

> Recordari is a type and structure validation tool for configuration files.

```ts
const { Record, R } = require('Recordari');

// 1) Create a Record of how the configurations should look
const RConfig = Record('MyConfig', {
  port: R.Number.Natural,
  env: R.String.Either(['dev', 'prod']),
  loglevel: R.String.Either(['none', 'error', 'warn', 'info', 'debug'])
});

// 2) Test the actual configurations against the Record
const config = RConfig(require('config.json')); // Will throw if any of the constraints fail

// 3) You can use all of the properties on config without worrying about some of them not being valid.
config.loglevel // Will ALWAYS be valid
config.port     // Will ALWAYS be valid
config.env      // Will ALWAYS be valid
```

# Install

__Latest:__ [`npm install recordari`](https://www.npmjs.com/package/recordari) <br>
__Next:__ [`npm install recordari@next`](https://www.npmjs.com/package/recordari/v/next)

# Using Recordari

Using Recordari is divided into two steps, the `record constructions`, and the `record evaluation`. <br>
In the construction you will be creating a sort of "template" for Recordari to use in the evaluation step. This "template" is what we call a `record` and will be denoted by the capital `R` preceding the variable name. Ex: `ROptions` or `RConfig`. <br>

## Construction

When constructing a record you will be using the `Record` function provided by Recordari. <br>
This function takes two arguments, the first is the name of the record *(this can be anything you like)*, and the second is the constraint object *(this is the important part)*.

```js
const { Record } = require('Recordari');
const RDemo = Record('Demo', {
  // This is the constraint object
});
```

In essence "the constraint object should be a modified copy of the object that you are creating a record for", let me explain. <br>
Lets say you want to create a record for this object: `{ a: 42 }` <br>
And lets assume that the application expects the property `a` to always be a number. <br>
We could then construct a constraint for the property `a` that asserts the type of the value to be a number, like this: `R.Number` <br>

```js
const { R, Record } = require('Recordari');
const RDemo = Record('Demo', {
  a: R.Number
});
```

`R.Number` is a constraint that tells Recordari that when it evaluates an object against the `Demo` record, the property `a` should be a number.

*You can read about all the available constraints [here!](docs/constraints.md)*

## Evaluation

After you've constructed a record you can now use it to assert the validity of objects.

```js
const { R, Record } = require('Recordari');
const RDemo = Record('Demo', {
  a: R.Number
});

const demo = RDemo({ a: 42 });
console.log(demo.a); // 42
```

As you can see above, the Record function returns a function. This function expects a single argument, and it expects this argument to be an object that complies to the constraints of the record that you previously constructed.<br>
If the argument does comply to the constraints, then function will act like the identity function (aka it will return the object that was passed in). <br>
If the argument does not comply to the constraints then the function will throw a TypeError. <br>

```js
const { R, Record } = require('Recordari');
const RDemo = Record('Demo', {
  a: R.Number
});

const demo = RDemo({ a: 'hi' }); // Will throw TypeError
console.log(demo.a); // Won't be executed
```

## Constraints

*See [docs/constraints.md](docs/constraints.md)*

A great way to explore the available constraints is through intellisense exploration. Either by using typescript or by using a typescript enabled editor with javascript *(such as [vscode](https://code.visualstudio.com/))*.

# Contribute

*See [CONTRIBUTE.md](CONTRIBUTE.md)*

# Examples

*See [docs/examples.md](docs/examples.md)*
