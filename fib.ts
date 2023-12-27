export const fib = (n: number): number[] => {
  if (n === 0) return [0]
  if (n === 1) return [1]
  if (n === 2) return [1, 1]

  const previous = fib(n - 1)

  return [previous[0] + previous[1], ...previous]
}
