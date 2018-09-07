type Tuple<T, D> = [T, D];
type Maybe<T> = T | undefined;
export const ArrayZip = <T, D>(arrA: T[], arrB: D[]) => new Array(Math.max(arrA.length, arrB.length)).fill(0).map((_, i) => [arrA[i], arrB[i]] as Tuple<Maybe<T>, Maybe<D>>);
