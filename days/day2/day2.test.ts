import { expect, test, describe } from "bun:test";
import { getInput } from "../../shared/input-reader";
import { idTextToNumber, part1, part2, transformToGameSet } from "./day2";

describe("day2 - sub functions", () => {
  test("idTextToNumber", () => {
    expect(idTextToNumber('Game: 1')).toBe(1);
    expect(idTextToNumber('Game: 12')).toBe(12);
    expect(idTextToNumber('Game: 123')).toBe(123);
  })

  test("transformToGameSet", () => {
    expect(transformToGameSet('8 green, 6 blue, 20 red')).toEqual({ red: 20, green: 8, blue: 6 });
    expect(transformToGameSet('3 blue, 4 red')).toEqual({ red: 4, green: 0, blue: 3 });
    expect(transformToGameSet('2 green')).toEqual({ red: 0, green: 2, blue: 0 });
  })
})

describe("day2", () => {
  test("part 1 - sample", async () => {
    const input = await getInput('./days/day2/sample-input-1.txt');

    const actual = part1(input);

    expect(actual).toBe(8);
  })

  test("part 1 - real input", async () => {
    const input = await getInput('./days/day2/real-input-1.txt');

    const actual = part1(input);

    expect(actual).toBe(2156);
  })

  test("part 2 - sample", async () => {
    const input = await getInput('./days/day2/sample-input-1.txt');

    const actual = part2(input);

    expect(actual).toBe(2286);
  })

  test("part 2 - real input", async () => {
    const input = await getInput('./days/day2/real-input-1.txt');

    const actual = part2(input);

    expect(actual).toBe(66909);
  })
})

