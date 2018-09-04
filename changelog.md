# 1.0.0

## General
* Implemented core structure for builder & evaluator
* Added Array.zip util (used in evaluator for Array.Like)

## Constraints
- Void
- Base
  - and(base[]): Void
  - or(base[]): Void
  - not: Base
  - Any: Void
  - Number
  - Array
- Number
  - Max(v): Number
  - Min(v): Number
  - Exact(v): Number
- Array
  - Length: Number
  - Contains: Base
  - Each: Base
  - Like(base[]): Void
