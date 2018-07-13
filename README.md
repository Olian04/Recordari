![logo](logo.png)

> Record.js is a constraint based data verification library. <br>
> Javascript has always suffered from the "curse" of dynamic ducktyping. It makes development fast and prototyping simple, but it comes with some major drawbacks. One of which is that accessing data can (and should, according to ecmascript) fail silently and without a trace. <br>
> Record.js aims to help fix this by providing an easy way of making sure that data reforms to the schema that you've provided. Most importatly it wont fail silently, it will scream!

```ts
const R = require('record.js');

const RSettings = R({
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
