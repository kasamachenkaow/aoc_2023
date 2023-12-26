import { expect, test, describe } from "bun:test";
import { part1, part2, part2b, toCardInfo, toWinningCard } from "./day4";
import { getInput } from "../../shared/input-reader";

describe("day4 - sub functions", () => {
  test("toCardInfo", () => {
    expect(toCardInfo('Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53')).toEqual({
      id: 1,
      numbers: [83, 86, 6, 31, 17, 9, 48, 53],
      cardWinningNumbers: [41, 48, 83, 86, 17],
    })
    expect(toCardInfo('Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1')).toEqual({
      id: 3,
      numbers: [69, 82, 63, 72, 16, 21, 14, 1],
      cardWinningNumbers: [1, 21, 53, 59, 44],
    })
    expect(toCardInfo('Card   1: 84 17 45 77 11 66 94 28 71 70 | 45 51 86 83 53 58 64 30 67 96 41 89  8 17 33 50 80 84  6  2 87 72 27 63 77')).toEqual({
      id: 1,
      numbers: [45, 51, 86, 83, 53, 58, 64, 30, 67, 96, 41, 89, 8, 17, 33, 50, 80, 84, 6, 2, 87, 72, 27, 63, 77],
      cardWinningNumbers: [84, 17, 45, 77, 11, 66, 94, 28, 71, 70],
    })
  })

  test("toWinningCard", () => {
    expect(toWinningCard({
      id: 1,
      numbers: [83, 86, 6, 31, 17, 9, 48, 53],
      cardWinningNumbers: [41, 48, 83, 86, 17],
    })).toEqual({
      id: 1,
      winningCardIds: [2, 3, 4, 5],
      numberOfCopies: 1,
    })

    expect(toWinningCard({
      id: 2,
      numbers: [83, 86, 6, 31, 17, 9, 48, 53],
      cardWinningNumbers: [41, 49, 83, 86, 17],
    })).toEqual({
      id: 2,
      winningCardIds: [3, 4, 5],
      numberOfCopies: 1,
    })
  })
})

describe("day4", () => {
  test("part 1 - sample", async () => {
    const input = await getInput('./days/day4/sample-input-1.txt');

    const actual = part1(input);

    expect(actual).toBe(13);
  })

  test("part 1 - real", async () => {
    const input = await getInput('./days/day4/real-input-1.txt');

    const actual = part1(input);

    expect(actual).toBe(23941);
  })

  test("part 2 - sample", async () => {
    const input = await getInput('./days/day4/sample-input-1.txt');

    const actual = part2(input);

    expect(actual).toBe(30);
  })

  test("part 2b - sample", async () => {
    const input = await getInput('./days/day4/sample-input-1.txt');

    const actual = part2b(input);

    expect(actual).toBe(30);
  })

  test("part 2b - real", async () => {
    const input = await getInput('./days/day4/real-input-1.txt');

    const actual = part2b(input);

    expect(actual).toBe(5571760);
  })

})
