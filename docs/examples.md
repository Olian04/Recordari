# Usage examples

## Demo - 1

```ts
const { Record, R } = require('Record.js');

const RSettings = Record('Settings', {
  foo: R.Number.Natural,
  bar: R.Array.Each.String.Either(['a', 'b']),
  biz: R.Object.Like({
    baz: R.Number.Between(0, 8)
  }),
  baz: R.or([
    R.String.Length.Max(2),
    R.String.Length.Min(10)
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
  bez: /^(?!0\.0\.\d+$)\d+\.\d+\.\d+$/
});

const failRecord = RSettings({
  foo: 5.01, //                     Error: Settings.foo => 5.01 is not a natural number
  bar: ['c'], //                    Error: Settings.bar[0] => 'c' is not in ['a', 'b']
  biz: { baz: 1.654, boo: 'd' }, // Error: Settings.biz => Unexpected key 'boo'.
  baz: 'hello', //                  Error: Settings.baz => 'hello'.length is not, less than 3, nor greater than 9
  hello: 'Record.js', //             Error: Settings => Unexpected key 'hello'.
  bez: /^\d+\.\d+\.\d+$/ //         Error: Settings.bez => '0.0.0'.match should be false
});
```
