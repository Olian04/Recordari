# Constraints

In Recordjs the way you construct Records are through the use of constraints. There are many different kinds of constraints, and these different kinds will be denoted by a letter in the heading:

|   Denoted           | Meaning                               |
|:-------------------:|:---------------------------------:|
|          *{A}*           | will perform type assertions |
|          *{S}*           | will expose a set of sub-constraints |
|          *{P}*           | will accept parameters |
|          *{X}*           | will change the nature of the evaluation |
|          *{E}*           | will end the constraint construction |
|          *(name)*  | will expose the same constraints as the constraint name "name" |

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
> *If you find your self using this constraint often, please consider submitting an issue about it!* <br>

`R.Custom` is used in those cases where the constraints provided by Recordjs isn't enough. <br>
`R.Custom` takes a synchronous function as an argument. This function should be of the signature `(value: any) => boolean`, and should return `true` if the value is considered to have passed the custom assertion logic.

```js
const RCustom = Record('Custom', {
  foo: R.Custom(v => v.foo !== undefined)
});

RCustom({ foo: 10 }); // OK
RCustom({ foo: undefined }); // FAIL
```

## Null *{AE}*
`R.Null` is used to assert that a value is equal to `null`.

```js
const RNull = Record('Null', {
  foo: R.Null
});

RNull({ foo: null }); // OK
RNull({ foo: undefined }); // FAIL
```

## Number
## Object
## Regex
## String

## Undefined *{AE}*
`R.Undefined` is used to assert that a value is equal to `undefined`.

```js
const RUndefined = Record('Undefined', {
  foo: R.Undefined
});

RUndefined({ foo: undefined }); // OK
RUndefined({ foo: null }); // FAIL
```

# Planed constraints
These are constraints that are on the roadmap but are yet to be implemented

* Function
  * Arguments: Function_Arguments
  * Test(...args): R
* Function_Arguments
  * Length: Number
  * Contains: String
  * Each: String
