import { expect, test, describe } from "bun:test";
import { getMap, getSeeds, getSeedsRanges, part1, part2, toNextRanges } from "./day5";
import { getInputWith2Eols } from "../../shared/input-reader";

describe("day5 - sub functions", () => {
  test("getSeeds", async () => {
    const input = await getInputWith2Eols('./days/day5/sample-input-1.txt');
    expect(getSeeds(input)).toEqual([79, 14, 55, 13])
  })

  // seeds: 79 14 55 13
  test("getSeedRanges", async () => {
    const input = await getInputWith2Eols('./days/day5/sample-input-1.txt');
    expect(getSeedsRanges(input)).toEqual([
      { start: 79, end: 92 },
      { start: 55, end: 67 },
    ])
  })

  test("getMap", async () => {
    const input = await getInputWith2Eols('./days/day5/sample-input-2.txt');

    expect(getMap(input, 'seed-to-soil')).toEqual([
      { destinationStart: 50, sourceStart: 98, sourceEnd: 99 },
      { destinationStart: 52, sourceStart: 50, sourceEnd: 52 },
    ])

    expect(getMap(input, 'soil-to-fertilizer')).toEqual([
      { destinationStart: 0, sourceStart: 15, sourceEnd: 17 },
      { destinationStart: 37, sourceStart: 52, sourceEnd: 53 },
      { destinationStart: 39, sourceStart: 0, sourceEnd: 0 },
    ])
  })

  test("toNextRanges", () => {
    const maps = [
      { destinationStart: 50, sourceStart: 98, sourceEnd: 99 },
      { destinationStart: 52, sourceStart: 50, sourceEnd: 52 },
    ]

    expect(toNextRanges(maps)({ start: 79, end: 92 })).toEqual([
      { start: 79, end: 92 },
    ])
  })

})

describe("day5", () => {
  test("part 1 - sample", async () => {
    const input = await getInputWith2Eols('./days/day5/sample-input-1.txt');

    const actual = part1(input);

    expect(actual).toBe(35);
  })

  test("part 1 - real", async () => {
    const input = await getInputWith2Eols('./days/day5/real-input-1.txt');

    const actual = part1(input);

    expect(actual).toBe(111627841);
  })

  test("part 2 - sample", async () => {
    const input = await getInputWith2Eols('./days/day5/sample-input-1.txt');

    const actual = part2(input);

    expect(actual).toBe(46);
  })

  test("part 2 - real", async () => {
    const input = await getInputWith2Eols('./days/day5/real-input-1.txt');

    const actual = part2(input);

    expect(actual).toBe(69323688);
  })
})
