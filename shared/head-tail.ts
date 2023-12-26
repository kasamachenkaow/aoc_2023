import FArray from 'fp-ts/Array'
import FOption from 'fp-ts/Option'
import FFunction from 'fp-ts/function'

export const headTail = <T>(array: T[]): [FOption.Option<T>, T[]] => {
  return [
    FArray.head(array),
    FFunction.pipe(
      array,
      FArray.tail,
      FOption.getOrElse(() => [] as T[]),
    )
  ]
}

