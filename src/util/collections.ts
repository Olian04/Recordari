type Tuple<T, D> = [T, D]; 
type Maybe<T> = T | undefined;
interface ArrayConstructor {
    zip<T, D>(arrA: T[], arrB: D[]): Tuple<Maybe<T>, Maybe<D>>[];
}
Array.zip = <T, D>(arrA: T[], arrB: D[]) => new Array(Math.max(arrA.length, arrB.length)).fill(0).map((_, i) => [arrA[i], arrB[i]] as Tuple<Maybe<T>, Maybe<D>>);
