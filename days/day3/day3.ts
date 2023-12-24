import FOption from 'fp-ts/Option'
import FArray from 'fp-ts/Array'
import FFunction from 'fp-ts/function'
import FNonEmptyArray from 'fp-ts/NonEmptyArray'
import FRecord from 'fp-ts/Record'
import FMap from 'fp-ts/Map'
import { toSum } from '../../shared/to-sum'
import FEq from 'fp-ts/Eq'
import FNumber from 'fp-ts/number'
import { reduceSum } from '../../shared/reduce-sum'
import { reduceProduct } from '../../shared/reduce-product'

type Input = string[]
type Output = number

type SymbolMapLine = Record<string, string>
type SymbolMap = Record<string, SymbolMapLine>

type FoldablePart = [Coord, number]
type PartMap = Map<Coord, number>

type Gear = {
  symbol: string
  coord: Coord
}

type GearWithAdjacentParts = Gear & {
  adjacentParts: number[]
}

type Part = {
  value: number;
  positions: number[];
}

type WithRow = {
  row: number;
}

type PartWithRow = Part & WithRow

type Coord = { row: number; col: number; }

const findFistPart = (line: string): [string, number, string] => {
  const matches = line.match(/(\d+)(.*)/);
  if (!matches) {
    return ["", -1, ""];
  }

  const [_, valueStr, rest] = matches;

  return [valueStr, matches.index ?? -1, rest];
}

export const extractParts = (startIndex: number) => (line: string): Part[] => {
  if (!line || line.length === 0) {
    return [];
  }

  return FFunction.pipe(
    line,
    findFistPart,
    ([valueStr, foundIndex, rest]) => {
      if (foundIndex === -1) {
        return [];
      }

      const numIndex = startIndex + foundIndex;
      const numLength = valueStr.length;
      const lastIndex = numIndex + numLength - 1;
      const positions = FNonEmptyArray.range(numIndex, lastIndex);
      const num = { value: parseInt(valueStr, 10), positions };

      return [num, ...extractParts(lastIndex + 1)(rest)]
    }
  )
}

export const extractSymbolMapLine = (line: string): SymbolMapLine => {
  return FFunction.pipe(
    line.split(''),
    FArray.mapWithIndex((index, char) => ({ index, char })),
    FArray.filter(({ char }) => /\D/.test(char)),
    FArray.filter(({ char }) => char !== '.'),
    FArray.reduce({}, (acc, { index, char }) => ({ ...acc, [index]: char })),
  )
}

const isNotOriginCoord = (orinalRow: number, orignalCols: number[]) => ({ row, col }: Coord): boolean => row !== orinalRow || !orignalCols.includes(col);

const isValidCoord = ({ row, col }: Coord): boolean => row >= 0 && col >= 0;

export const getAdjacentCoords = ({ row, cols }: { row: number; cols: number[] }): Coord[] => {
  const rowAbove = row - 1;
  const rowBelow = row + 1;

  const colBefore = FFunction.pipe(
    cols,
    FArray.head,
    FOption.fold(
      () => -1,
      (head) => head - 1
    )
  )

  const colAfter = FFunction.pipe(
    cols,
    FArray.last,
    FOption.fold(
      () => -1,
      (head) => head + 1
    )
  )

  return FFunction.pipe(
    [colBefore, ...cols, colAfter],
    FArray.flatMap((col) => [
      { row: rowAbove, col },
      { row, col },
      { row: rowBelow, col },
    ]),
    FArray.filter(isValidCoord),
    FArray.filter(isNotOriginCoord(row, cols)),
  )
}

const toSymbolMap = (index: number, acc: SymbolMap, line: SymbolMapLine): SymbolMap => {
  return { ...acc, [index]: line };
}

const toValue = (num: Part): number => num.value;

const isAdjacentToSymbol = (symbolMap: SymbolMap) => (coord: Coord): boolean => {
  return FFunction.pipe(
    symbolMap,
    FRecord.lookup(coord.row.toString()),
    FOption.fold(
      () => FOption.none,
      (line) => FRecord.lookup(coord.col.toString(), line),
    ),
    FOption.fold(
      () => false,
      () => true,
    )
  )
}

const isPartPart = (symbolMap: SymbolMap) => (num: PartWithRow): boolean => {
  return FFunction.pipe(
    { row: num.row, cols: num.positions},
    getAdjacentCoords,
    FArray.some(isAdjacentToSymbol(symbolMap))
  )
}

const toPartWithRows = (index: number, nums: Part[]): PartWithRow[] => {
  return FFunction.pipe(
    nums,
    FArray.map((num) => ({ ...num, row: index })),
  )
}

export const part1 = (lines: Input): Output => {
  const parts: PartWithRow[] = FFunction.pipe(
    lines,
    FArray.map(extractParts(0)),
    FArray.mapWithIndex(toPartWithRows),
    FArray.flatten,
  )

  const symbolMap: SymbolMap = FFunction.pipe(
    lines,
    FArray.map(extractSymbolMapLine),
    FArray.reduceWithIndex({}, toSymbolMap)
  )

  return FFunction.pipe(
    parts,
    FArray.filter(isPartPart(symbolMap)),
    FArray.map(toValue),
    FArray.reduce(0, toSum),
  )
}

const symbolMapToGears = (symbolMap: SymbolMap): Gear[] => {
  return FFunction.pipe(
    symbolMap,
    FRecord.toArray,
    FArray.flatMap(([row, line]) => {
      return FFunction.pipe(
        line,
        FRecord.toArray,
        FArray.map(([col, symbol]) => {
          return {
            symbol,
            coord: { row: parseInt(row, 10), col: parseInt(col, 10) },
          };
        }),
      )
    }),
  )
}

const isStarGear = (gear: Gear): boolean => gear.symbol === '*';

const toFoldableParts = (part: PartWithRow): FoldablePart[] => {
  return FFunction.pipe(
    part.positions,
    FArray.map((col) => ({ row: part.row, col })),
    FArray.map((coord) => [coord, part.value]),
  )
}

const eqCoord: FEq.Eq<Coord> = {
  equals: (first: Coord, second: Coord) => first.row === second.row && first.col === second.col,
}

const toGearWithAdjacentParts = (partMap: PartMap) => (gear: Gear): GearWithAdjacentParts => {
  return {
    ...gear,
    adjacentParts: FFunction.pipe(
      gear.coord,
      ({row, col}) => getAdjacentCoords({ row, cols: [col] }),
      FArray.map((coord) => FMap.lookup(eqCoord)(coord)(partMap)),
      FArray.map(FOption.fold(
        () => -1,
        (value) => value,
      )),
      FArray.filter((value) => value !== -1),
      FArray.uniq(FNumber.Eq),
    )
  }
}

const isAdjacentToExactlyTwoparts = (gear: GearWithAdjacentParts): boolean => gear.adjacentParts.length === 2;

const toGearRatio = (gear: GearWithAdjacentParts): number => reduceProduct(gear.adjacentParts)

export const part2 = (lines: Input): Output => {
  const gears: Gear[] = FFunction.pipe(
    lines,
    FArray.map(extractSymbolMapLine),
    FArray.reduceWithIndex({}, toSymbolMap),
    symbolMapToGears,
  )

  const partMap: PartMap = FFunction.pipe(
    lines,
    FArray.map(extractParts(0)),
    FArray.mapWithIndex(toPartWithRows),
    FArray.flatten,
    FArray.flatMap(toFoldableParts),
    FMap.fromFoldable(eqCoord, FNumber.MagmaSub, FArray.Foldable),
  )


  return FFunction.pipe(
    gears,
    FArray.filter(isStarGear),
    FArray.map(toGearWithAdjacentParts(partMap)),
    FArray.filter(isAdjacentToExactlyTwoparts),
    FArray.map(toGearRatio),
    reduceSum,
  )
}
