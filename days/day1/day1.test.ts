import { expect, test, describe } from "bun:test";
import { getFirstNumberString, getLastNumberString, part1, part2, toFirstAndLastNumberStrings } from "./day1";
import { getInput } from "../../shared/input-reader";

describe("day1 - sub functions", () => {
  test("getFirstNumberString", () => {
    const input = 'zoneightcsds';

    const actual = getFirstNumberString(input);
    expect(actual).toBe('one');
  })

  test("getLastNumberString", () => {
    const input = 'zoneightcsds';

    const actual = getLastNumberString(input);
    expect(actual).toBe('eight');
  })

  test("toFirstAndLastNumberStrings", () => {
    const input = 'zoneightcsds';

    const actual = toFirstAndLastNumberStrings(input);
    expect(actual).toEqual(['one', 'eight']);
  })
})

describe("day1", () => {
  test("part1 - sample", () => {
    const input = [
      "gtlbhbjgkrb5sixfivefivetwosix", // 55
      "ninesixrgxccvrqscbskgzxh6cpvpxsqnb6", // 66
      "dxxzrlzkksfsffp4", // 44
    ]
    const actual = part1(input);
    expect(actual).toBe(55+66+44);
  });

  test("part1 - real input", async () => {
    const input = await getInput('./days/day1/real-input-1.txt');
    const actual = part1(input);
    expect(actual).toBe(54634);
  });

  test("part2 - sample", async () => {
    const input = await getInput('./days/day1/sample-input-2.txt')
    const actual = part2(input);
    expect(actual).toBe(281);
  });

  test("part2 - real input", async () => {
    const input = await getInput('./days/day1/real-input-2.txt');
    const actual = part2(input);
    expect(actual).toBe(53855);
  });
});

