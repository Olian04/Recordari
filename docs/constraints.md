## Constraints

### R (base constraint)
`R` is the base constraint of Recordjs, this is where all other constraints originate from.
On its own the `R` constraint doesn't provide any logic, so it will fail if used on its own.

```js
const RDemo = Record('Demo', {
  foo: R // This is not valid, and will fail on record constructions
})
```

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
