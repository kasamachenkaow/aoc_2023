import FNumber from 'fp-ts/number'
import FArray from 'fp-ts/Array'
import { toProduct } from './to-product'

export const reduceProduct = <T extends number>(arr: Array<T>): number => {
  return FArray.reduce(FNumber.MonoidProduct.empty, toProduct)(arr)
}

