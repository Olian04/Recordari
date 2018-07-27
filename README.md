![logo](logo.png)

> Record.js is a constraint based type enforcement system for vanilla js.


Fiddle WIP: https://jsfiddle.net/524brseg/407/

```ts
const R = require('record.js');

const RSettings = R('Settings', {
  foo: R.Number.Natural, 
  bar: R.Array.String.Choise(['a', 'b']), 
  biz: R.Object({
    baz: R.Number.Max(8).Min(0)
  })
});

const okRecord = RSettings({
  foo: 5,
  bar: ['b'], 
  biz: { baz: 1.654 }
});

const failRecord = RSettings({
  foo: 5.01, //                     Error: Not a positive integer
  bar: ['c'], //                    Error: 'c' is not in ['a', 'b'] 
  biz: { baz: 1.654, boo: 'd' }  // Error: boo does not exist on object biz
});
```

## Constraints: 
(Note: in docs all constraints should either a) say that they are an alias of another constraint or b) describe what it does and what Ordo (time complexity) it has) 

* [AllTypes] 
	* Not
	* Exact
	* Any === *() 
	* Choice === Select === OneOf === Either

* Number
	* Integer
	* Decimal === Not.Integer
	* Possitive
	* Negative === Not.Possitive
	* Natural === Possitive.Integer
	* Whole === Integer
	* Real === Any (for all intents an purposes you can't read an irrational number from a file) 
	* Rational 
	* Max === LessThan 
	* Min === MoreThan 
	* Between === Min.Max

* String
	* Contains
	* Length === Count === Size
	* Matches === Regex

* Boolean 
