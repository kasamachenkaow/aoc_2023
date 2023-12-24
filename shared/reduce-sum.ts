import FNumber from 'fp-ts/number'
import FArray from 'fp-ts/Array'
import { toSum } from "./to-sum";

export const reduceSum = <T extends number>(arr: Array<T>): number => {
  return FArray.reduce(FNumber.MonoidSum.empty, toSum)(arr)
}

