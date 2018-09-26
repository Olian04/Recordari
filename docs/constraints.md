# Constraints

In Recordjs the way you construct Records are through the use of constraints.<br>
There are many different kinds of constraints. In order to explain them without repeating myself, I've maked each one with one or more of these 6 notations.

|   Notation  | Meaning                                                        |
|:-----------:|:--------------------------------------------------------------:|
|    *{A}*    | will perform type assertions                                   |
|    *{S}*    | will expose a set of sub-constraints                           |
|    *{P}*    | will accept parameters                                         |
|    *{X}*    | will change the nature of the evaluation                       |
|    *{E}*    | will end the constraint construction                           |
|   *(name)*  | will expose the same constraints as the constraint name "name" |

Unless a constraint is maked with *{E}* or *{S}* it will expose the sub-set it self belongs to, allowing for chaining constraints of the same sub-set. Ex: `R.Number.Whole.Min(0).Max(2)` *(0, 1, or 2)*

---

## R *{S}*
`R` is the base constraint of Recordjs, this is where all other constraints originate from. <br>
On its own the `R` constraint doesn't provide any logic, so it will fail if used alone.

```js
const RDemo = Record('Demo', {
  foo: R // This is not valid, and will fail on record constructions
});
```

---

*Following is all available constraints in alphabetical order*

## Any *{E}*
`R.Any` will be true for any value. <br>
This constraint is used if its not important what a key holds, just that the key exists.

```js
const RAny = Record('Any', {
  foo: R.Any
});

RAny({ foo: 10 }); // OK
RAny({ foo: 'hi' }); // OK
RAny({ }); // FAIL
```

---

## and *{EX}*
`R.and` is used when a value needs to comply to multiple constraints which can not be expressed as a single constraint. <br>
`R.and` takes an array of constraints as an argument, and will evaluate to true if all of them evaluates to true.

```js
const Rand = Record('and', {
  foo: R.and([
    R.Regex.Test('a').True,
    R.Regex.Test('b').True,
    R.Regex.Test('ab').False
  ])
});

Rand({ foo: /a|b/ }); // OK
Rand({ foo: /a?b?/ }); // FAIL
```

---

## Array *{AS}*
`R.Array` is used to assert that a value is an array.

```js
const RArray = Record('Array', {
  foo: R.Array
});

RArray({ foo: [10] }); // OK
RArray({ foo: 10 }); // FAIL
```

### Array.Contains *(R)*
`R.Array.Contains` is used to assert that an array contains at least one value that complies to a given constraint.

```js
const RContains = Record('Contains', {
  foo: R.Array.Contains.Number
});

RContains({ foo: [10] }); // OK
RContains({ foo: ['10'] }); // FAIL
RContains({ foo: [] }); // FAIL
```

### Array.Each *(R)*
`R.Array.Each` is used to apply a constraint to every element of an array.

```js
const REach = Record('Each', {
  foo: R.Array.Each.Number
});

REach({ foo: [10, 20] }); // OK
REach({ foo: [10, '20'] }); // FAIL
REach({ foo: [] }); // OK
```

### Array.Length *(Number)*
`R.Array.Length` is used to apply a constraint on the length of an array.

```js
const RLength = Record('Length', {
  foo: R.Array.Length.Exact(2)
});

RLength({ foo: [10, 20] }); // OK
RLength({ foo: [10, '20'] }); // OK
RLength({ foo: [] }); // FAIL
```

### Array.Like *{APE}*
`R.Array.Like` is used to assert the exact shape of an array.<br>
`R.Array.Like` takes an array of constraints and assert each position of the value array to its corresponding index in the constraints array.

```js
const RArrayLike = Record('ArrayLike', {
  foo: R.Array.Like([
    R.Number,
    R.String
  ])
});

RArrayLike({ foo: [10, '20'] }); // OK
RArrayLike({ foo: ['10', 20] }); // FAIL
RArrayLike({ foo: [] }); // FAIL
```

---

## Boolean *{AS}*
`R.Boolean` is used to assert that a value is a boolean.

```js
const RBoolean = Record('Boolean', {
  foo: R.Boolean
});

RBoolean({ foo: false }); // OK
RBoolean({ foo: 10 }); // FAIL
```

### Boolean.False *(Boolean)*
`R.Boolean.False` is used to assert that a value is equal to `false`.

```js
const RFalse = Record('False', {
  foo: R.Boolean.False
});

RFalse({ foo: false }); // OK
RFalse({ foo: true }); // FAIL
```

### Boolean.True *(Boolean)*
`R.Boolean.False` is used to assert that a value is equal to `true`.

```js
const RTrue = Record('True', {
  foo: R.Boolean.True
});

RTrue({ foo: true }); // OK
RTrue({ foo: false }); // FAIL
```

---

## Custom *{AP}*
> *If you find your self using this constraint often, please consider submitting an issue, explaining your usecase!*

`R.Custom` is used in those cases where the constraints provided by Recordjs isn't enough. <br>
`R.Custom` takes a synchronous function as an argument. This function should be of the signature `(value: any) => boolean`, and should return `true` if the value is considered to have passed the custom assertion logic.

```js
const RCustom = Record('Custom', {
  foo: R.Custom(v => v.foo !== undefined)
});

RCustom({ foo: 10 }); // OK
RCustom({ foo: undefined }); // FAIL
```

---

## not *{X}*
`R.not` is used to invert the expected truthyness of any following constraints. <br>
`R.not` will evaluate to true if any constraint following it evaluates to false.

```js
const Rnot = Record('not', {
  foo: R.not.Number
});

Rnot({ foo: '2' }); // OK
Rnot({ foo: 2 }); // FAIL
```

---

## Null *{AE}*
`R.Null` is used to assert that a value is equal to `null`.

```js
const RNull = Record('Null', {
  foo: R.Null
});

RNull({ foo: null }); // OK
RNull({ foo: undefined }); // FAIL
```

---

## Number *{AS}*
`R.Number` is used to assert that a value is a number.

```js
const RNumber = Record('Number', {
  foo: R.Number
});

RNumber({ foo: 2 }); // OK
RNumber({ foo: '2' }); // FAIL
```

### Number.Between *{AP}*
`R.Number.Between` is used to assert that a number is between two number (inclusive). <br>
`R.Number.Between` expects two number as arguments *(the order is not important)*.

```js
const RBetween = Record('Between', {
  foo: R.Number.Between(1, 2)
});

RBetween({ foo: 2 }); // OK
RBetween({ foo: 3 }); // FAIL
```

### Number.Either *{AP}*
`R.Number.Either` is used to assert that a number is equal to one of a given set of numbers. <br>
`R.Number.Either` takes an array of numbers as an argument.

```js
const REither = Record('Either', {
  foo: R.Number.Either([1, 2])
});

REither({ foo: 2 }); // OK
REither({ foo: 1 }); // OK
REither({ foo: 3 }); // FAIL
```

### Number.Exact *{AP}*
`R.Number.Exact` is used to assert that a number is equal to a given number. <br>
`R.Number.Exact` takes a number as an argument.

```js
const RExact = Record('Exact', {
  foo: R.Number.Exact(2)
});

RExact({ foo: 2 }); // OK
RExact({ foo: 3 }); // FAIL
```

### Number.Max *{AP}*
`R.Number.Max` is used to assert that a number less than or equal to a given number. <br>
`R.Number.Max` takes a number as an argument.

```js
const RMax = Record('Max', {
  foo: R.Number.Max(2)
});

RMax({ foo: 2 }); // OK
RMax({ foo: 1 }); // OK
RMax({ foo: 3 }); // FAIL
```

### Number.Min *{AP}*
`R.Number.Min` is used to assert that a number greater than or equal to a given number. <br>
`R.Number.Min` takes a number as an argument.

```js
const RMin = Record('Min', {
  foo: R.Number.Min(2)
});

RMin({ foo: 3 }); // OK
RMin({ foo: 4 }); // OK
RMin({ foo: 2 }); // FAIL
```

### Number.Mod *{AP}*
`R.Number.Mod` is used to assert that a number modulo a number A equals a number B. <br>
`R.Number.Mod` takes two numbers as arguments, `A` & `B`, so that `value % A === B`.

```js
const RMod = Record('Mod', {
  foo: R.Number.Mod(2, 1)
});

RMod({ foo: 3 }); // OK
RMod({ foo: 1 }); // OK
RMod({ foo: 2 }); // FAIL
```

### Number.Natural *{AP}*
`R.Number.Natural` is used to assert that a number is part of the natural numbers, aka is whole and positive *(including 0)*. <br>

```js
const RNatural = Record('Natural', {
  foo: R.Number.Natural
});

RNatural({ foo: 1 }); // OK
RNatural({ foo: 1.1 }); // FAIL
RNatural({ foo: -1 }); // FAIL
```

### Number.not *{X}*
`R.Number.not` is used to invert the expected truthyness of any following constraints. <br>
`R.Number.not` will evaluate to true if any constraint following it evaluates to false.

```js
const Rnot = Record('not', {
  foo: R.Number.not.Natural
});

Rnot({ foo: 1.1 }); // OK
Rnot({ foo: -1 }); // OK
Rnot({ foo: 1 }); // FAIL
```

### Number.Whole
`R.Number.Whole` is used to assert that a number is part of the whole numbers, aka `value % 1 === 0` *(including 0)*. <br>

```js
const RNatural = Record('Natural', {
  foo: R.Number.Natural
});

RNatural({ foo: 1 }); // OK
RNatural({ foo: 1.1 }); // FAIL
RNatural({ foo: -1 }); // FAIL
```

---

## Object *{AS}*
`R.Object` is used to assert that a value is an object.

```js
const RObject = Record('Object', {
  foo: R.Object
});

RObject({ foo: {} }); // OK
RObject({ foo: [] }); // FAIL
RObject({ foo: 2 }); // FAIL
```

### Object.Values *(Array)*
`R.Object.Values` is used to apply a constraint to value of the object.

```js
const RValues = Record('Values', {
  foo: R.Object.Values.Number
});

RValues({ foo: 10 }); // OK
RValues({ foo: '10' }); // FAIL
```

### Object.Keys *(Array)*
`R.Object.Keys` is used to apply a constraint to value of the object.

```js
const RKeys = Record('Keys', {
  foo: R.Object.Keys.Length.Exact(1)
});

RKeys({ foo: 10 }); // OK
RKeys({ foo: 10, bar: '10' }); // FAIL
```

### Object.Like *(Array)*
`R.Object.Like` is used to apply a constraint to value of the object.

```js
const RLike = Record('Like', {
  foo: R.Object.Like({ bar: R.Number })
});

RLike({ foo: { bar: 10 } }); // OK
RLike({ foo: { bar: '10' } }); // FAIL
RLike({ foo: {} }); // FAIL
```

---

## or *{EX}*
`R.or` is used when a value could be one of many different types.<br>
`R.or` takes an array of constraints as an argument, and will evaluate to true if one or more of them evaluates to true.

```js
const Ror = Record('or', {
  foo: R.or([
    R.String,
    R.Regex
  ])
});

Ror({ foo: / / }); // OK
Ror({ foo: ' ' }); // OK
Ror({ foo: 42 }); // FAIL
```

---

## Regex *{AS}*
`R.Regex` is used to assert that a value is a regex.

```js
const RRegex = Record('Regex', {
  foo: R.Regex
});

RRegex({ foo: / / }); // OK
RRegex({ foo: ' ' }); // FAIL
```

### Regex.Test *{P}(Boolean)*
`R.Regex.Test` is used to assert that a regex should match or not match a given string. <br>
`R.Regex.Test` takes one string argument and tests the regex on it. <br>
`R.Regex.Test` only executes the regex but does not assert the resulting value. You will have to explicitly tell Recordjs if the Test should evaluate to True or False.

```js
const RRegexTest = Record('RegexTest', {
  foo: R.Regex.Test('a').True
});

RRegexTest({ foo: /a/ }); // OK
RRegexTest({ foo: /b/ }); // FAIL
```

---

## String *{AS}*
`R.String` is used to assert that a value is a string`.

```js
const RString = Record('String', {
  foo: R.String
});

RString({ foo: '1' }); // OK
RString({ foo: 1 }); // FAIL
```

### String.Either *{AP}*
`R.String.Either` is used to assert that a string is equal to one of a given set of strings. <br>
`R.String.Either` takes an array of strings as an argument.

```js
const REither = Record('Either', {
  foo: R.String.Either(['1', '2'])
});

REither({ foo: '2' }); // OK
REither({ foo: '1' }); // OK
REither({ foo: '3' }); // FAIL
```

### String.EndsWith *{AP}*
`R.String.EndsWith` is used to assert that the string should end with a given string. <br>
`R.String.EndsWith` takes a string as an argument.

```js
const REndsWith = Record('EndsWith', {
  foo: R.String.EndsWith('2')
});

REndsWith({ foo: '12' }); // OK
REndsWith({ foo: '13' }); // FAIL
```

### String.Exact *{AP}*
`R.String.Exact` is used to assert that a string is equal to a given string. <br>
`R.String.Exact` takes a string as an argument.

```js
const RExact = Record('Exact', {
  foo: R.String.Exact('2')
});

RExact({ foo: '2' }); // OK
RExact({ foo: '3' }); // FAIL
```

### String.Length *(Number)*
`R.String.Length` is used to apply a constraint on the length of an string.

```js
const RLength = Record('Length', {
  foo: R.String.Length.Exact(2)
});

RLength({ foo: 'ab' }); // OK
RLength({ foo: 'a' }); // FAIL
RLength({ foo: 'abc' }); // FAIL
```

### String.Matches *{AP}*
`R.String.Matches` is used to assert that a string matches a given regex.

```js
const RMatches = Record('Matches', {
  foo: R.String.Matches(/a/)
});

RMatches({ foo: 'a' }); // OK
RMatches({ foo: 'b' }); // FAIL
```

### String.not *{X}*
`R.String.not` is used to invert the expected truthyness of any following constraints. <br>
`R.String.not` will evaluate to true if any constraint following it evaluates to false.

```js
const Rnot = Record('not', {
  foo: R.String.not.Exact('1')
});

Rnot({ foo: '2' }); // OK
Rnot({ foo: '1' }); // FAIL
```

### String.StartWith *{AP}*
`R.String.StartWith` is used to assert that the string should start with a given string. <br>
`R.String.StartWith` takes a string as an argument.

```js
const RStartWith = Record('StartWith', {
  foo: R.String.StartWith('2')
});

RStartWith({ foo: '21' }); // OK
RStartWith({ foo: '31' }); // FAIL
```

---

## Undefined *{AE}*
`R.Undefined` is used to assert that a value is equal to `undefined`.

```js
const RUndefined = Record('Undefined', {
  foo: R.Undefined
});

RUndefined({ foo: undefined }); // OK
RUndefined({ foo: null }); // FAIL
```

---

# Planed constraints
These are constraints that are on the roadmap but are yet to be implemented

* Function
  * Arguments: Function_Arguments
  * Test(...args): R
* Function_Arguments
  * Length: Number
  * Contains: String
  * Each: String
