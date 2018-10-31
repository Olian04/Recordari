---
name: Constraint
about: Requesting a new Constraint or requesting changes to an existing one.

---

<!--
Thank you for submitting an issue!
This template is for submitting an issue about adding a new Constraint or making a change to an existing Constraint.
Please select which one this issue is about:
-->
__I'm requesting a:__
- [ ] Change to an existing Constraint
- [ ] New Constraint

## What?
<!-- Please explain with words what changes you are suggesting -->

__Code:__ <br>
<!-- Please change the following code snipped to reflect your intended changes, be sure to show how and when the constraint would evaluate to true and when it would evaluate to false -->
```js
const { R, Record } = require('Recordari');

const RDemo = Record('demo', {
  foo: R.<constraint>
});

const okDemo = RDemo({
  foo: <ok value>
}):

const failDemo = RDemo({
  foo: <faulty value>
}):
```

## Why?
__Pros:__ <br>
* <!-- Why should your changes be implemented? -->

__Cons:__ <br>
* <!-- What are the possible drawback of implementing your changes? -->

## How?
<!-- If you have any ideas how this could be implemented (and you don't want to open a PR yourself) this is where you put it -->
