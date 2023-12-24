import { expect, test, describe } from "bun:test";
import { extractParts, extractSymbolMapLine, getAdjacentCoords, part1, part2 } from "./day3";
import { getInput } from "../../shared/input-reader";

describe("day3 - sub functions", () => {
  test("extractParts", () => {
    expect(extractParts(0)('467$.*114..114')).toEqual([
      { value: 467, positions: [0, 1, 2] },
      { value: 114, positions: [6, 7, 8] },
      { value: 114, positions: [11, 12, 13] },
    ])
  })

  test("extractSymbolMapLine", () => {
    expect(extractSymbolMapLine('467$.*114..114')).toEqual({
      3: '$',
      5: '*',
    })

    expect(extractSymbolMapLine('......#...')).toEqual({
      6: '#',
    })

    expect(extractSymbolMapLine('.........')).toEqual({})
  })

  test("getAdjacentIndexes", () => {
    expect(getAdjacentCoords({ row: 0, cols: [0, 1, 2] })).toEqual([
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 0, col: 3 },
      { row: 1, col: 3 },
    ])

    expect(getAdjacentCoords({ row: 1, cols: [6, 7, 8] })).toEqual([
      { row: 0, col: 5 },
      { row: 1, col: 5 },
      { row: 2, col: 5 },
      { row: 0, col: 6 },
      { row: 2, col: 6 },
      { row: 0, col: 7 },
      { row: 2, col: 7 },
      { row: 0, col: 8 },
      { row: 2, col: 8 },
      { row: 0, col: 9 },
      { row: 1, col: 9 },
      { row: 2, col: 9 },
    ])
  })
})

describe("day3", () => {
  test("part 1 - sample", async () => {
    const input = await getInput('./days/day3/sample-input-1.txt');

    const actual = part1(input);

    expect(actual).toBe(4361);
  })

  test("part 1 - real", async () => {
    const input = await getInput('./days/day3/real-input-1.txt');

    const actual = part1(input);

    expect(actual).toBe(559667);
  })

  test("part 2 - sample", async () => {
    const input = await getInput('./days/day3/sample-input-1.txt');

    const actual = part2(input);

    expect(actual).toBe(467835);
  })

  test("part 2 - real", async () => {
    const input = await getInput('./days/day3/real-input-1.txt');

    const actual = part2(input);

    expect(actual).toBe(86841457);
  })
})
