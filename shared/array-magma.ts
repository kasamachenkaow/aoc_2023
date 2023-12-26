import { Magma } from 'fp-ts/Magma'

export const getArrayMagma = <T>(): Magma<T[]> => {
  return {
    concat: (x: T[], y: T[]) => [...x, ...y],
  }
}
