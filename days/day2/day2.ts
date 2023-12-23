import FArray from 'fp-ts/Array'
import FFunction from 'fp-ts/function'
import { toSum } from '../../shared/to-sum';

type Input = string[];
type Output = number;


type GameSet = {
  red: number;
  green: number;
  blue: number;
}

type GameInfo = {
  id: number;
  sets: GameSet[];
}

export const idTextToNumber = (input: string): number => {
  const pattern = /\d+/;
  const matches = input.match(pattern);
  if (!matches || matches.length === 0) {
    throw new Error(`ID is not a number: ${input}`);
  }

  return parseInt(matches[0], 10);
}

export const splitIdAndSets = (input: string): [number, string[]] => {
  const [idText, setsText] = input.split(':');
  const id = idTextToNumber(idText);
  const rawSets = setsText.split(';').map(x => x.trim());


  return [id, rawSets];
}

export const transformToGameSet = (input: string): GameSet => {
  const red = parseInt(input.match(/\d+ red/)?.[0] ?? '0', 10)
  const green = parseInt(input.match(/\d+ green/)?.[0] ?? '0', 10)
  const blue = parseInt(input.match(/\d+ blue/)?.[0] ?? '0', 10)

  return { red, green, blue };
}

const transformToGameInfo = ([id, rawSets]: [number, string[]]): GameInfo => {
  const sets = rawSets.map(transformToGameSet);

  return { id, sets };
}

const toGameInfo = (input: string): GameInfo => {
  return FFunction.pipe(
    input,
    splitIdAndSets,
    transformToGameInfo,
  )
}

const isSetValid = (config: GameSet) => (set: GameSet): boolean =>
  set.red <= config.red && set.green <= config.green && set.blue <= config.blue;

const isValid = (config: GameSet) => (gameInfo: GameInfo): boolean => {
  const { sets } = gameInfo;
  return sets.every(isSetValid(config));
}

const toId = (gameInfo: GameInfo): number => gameInfo.id;

export const part1 = (input: Input): Output => {
  const configuration: GameSet = {
    red: 12,
    green: 13,
    blue: 14,
  }

  const output = FFunction.pipe(
    input,
    FArray.map(toGameInfo),
    FArray.filter(isValid(configuration)),
    FArray.map(toId),
    FArray.reduce(0, toSum),
  )

  return output;
}

const toMinimumPossibleSet = (gameInfo: GameInfo): GameSet => {
  const { sets } = gameInfo;

  const red = Math.max(...sets.map(x => x.red));
  const green = Math.max(...sets.map(x => x.green));
  const blue = Math.max(...sets.map(x => x.blue));

  return { red, green, blue };
}

const toSetPower = (set: GameSet): number => set.red * set.green * set.blue;

export const part2 = (input: Input): Output => {
  const output = FFunction.pipe(
    input,
    FArray.map(toGameInfo),
    FArray.map(toMinimumPossibleSet),
    FArray.map(toSetPower),
    FArray.reduce(0, toSum),
  )

  return output;
}

