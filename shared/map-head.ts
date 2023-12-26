export const mapHead = <H1, T, H2>(m: (h: H1) => H2) => (headTail: [H1, T]): [H2, T] => {
  const [head, tail] = headTail
  return [
    m(head),
    tail,
  ]
}


