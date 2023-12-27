import FArray from 'fp-ts/Array'
import FOption from 'fp-ts/Option'
import FFunction from 'fp-ts/function'
import { toMin } from '../../shared/to-min'
import { Ord } from 'fp-ts/lib/Ord'
import { headTail } from '../../shared/head-tail'

export const getSeeds = (lines: string[][]): number[] => {
  const seedsLine = lines.filter((line) => line[0].startsWith('seeds: '))[0]
  return seedsLine
    .filter((line) => line.startsWith('seeds: '))
    .map((line) => line.split('seeds: ')[1])
    .map((line) => line.split(' '))
    .map((line) => line.map((x) => parseInt(x)))
    .map((line) => line.filter((x) => !isNaN(x)))
  [0]
}

type Range = {
  start: number,
  end: number,
}

export const getSeedsRanges = (lines: string[][]): Range[] => {
  return FFunction.pipe(
    lines,
    getSeeds,
    FArray.chunksOf(2),
    FArray.map(([start, range]) => ({ start, end: start + range - 1 })),
  )
}

type MapInfo = {
  destinationStart: number,
  sourceStart: number,
  sourceEnd: number,
}

const toMapInfo = (line: string): MapInfo => {
  const [destinationStart, sourceStart, range] = line.split(' ').map((x) => parseInt(x))
  return {
    destinationStart,
    sourceStart,
    sourceEnd: sourceStart + range - 1,
  }
}

const isMapName = (mapName: string) => (line: string[]): boolean => {
  return line[0].startsWith(mapName)
}

export const getMap = (lines: string[][], mapName: string): MapInfo[] => {
  return FFunction.pipe(
       lines,
       FArray.filter(isMapName(mapName)),
       FArray.head,
       FOption.getOrElse(() => [] as string[]),
       FArray.tail,
       FOption.getOrElse(() => [] as string[]),
       FArray.map(toMapInfo),
     )
}

const mapInfoOrd: Ord<MapInfo> = {
  compare: (first: MapInfo, second: MapInfo) => first.sourceStart < second.sourceStart ? -1 : 1,
  equals: (first: MapInfo, second: MapInfo) => first.sourceStart === second.sourceStart,
}

const getMapSort = (mapName: string) => (lines: string[][]): MapInfo[] => {
  return FArray.sortBy([mapInfoOrd])(getMap(lines, mapName))
}


const toNext = (map: MapInfo[]) => (seed: number): number => {
  return FFunction.pipe(
    map,
    FArray.findFirst((x) => x.sourceStart <= seed && seed <= x.sourceEnd),
    FOption.fold(
      () => seed,
      (x) => seed - x.sourceStart + x.destinationStart,
    )
  )
}

export const part1 = (lines: string[][]): number => {
  const seeds = getSeeds(lines)
  const seedToSoilMap = FArray.sortBy([mapInfoOrd])(getMap(lines, 'seed-to-soil'))
  const soilToFertilizerMap = getMap(lines, 'soil-to-fertilizer')
  const fertilizerToWaterMap = getMap(lines, 'fertilizer-to-water')
  const waterToLightMap = getMap(lines, 'water-to-light')
  const lightToTemperatureMap = getMap(lines, 'light-to-temperature')
  const temperatureToHumidityMap = getMap(lines, 'temperature-to-humidity')
  const humidityToLocationMap = getMap(lines, 'humidity-to-location')


  return FFunction.pipe(
    seeds,
    FArray.map(toNext(seedToSoilMap)),
    FArray.map(toNext(soilToFertilizerMap)),
    FArray.map(toNext(fertilizerToWaterMap)),
    FArray.map(toNext(waterToLightMap)),
    FArray.map(toNext(lightToTemperatureMap)),
    FArray.map(toNext(temperatureToHumidityMap)),
    FArray.map(toNext(humidityToLocationMap)),
    toMin,
  )
}

const isRangeWithinMap = (map: MapInfo) => (range: Range): boolean => {
  return map.sourceStart <= range.end && range.start <= map.sourceEnd
}

const getGapRange = (range: Range) => (map: MapInfo): Range => {
  return {
    start: range.start,
    end: map.sourceStart - 1,
  }
}

const getNextRange = (range: Range) => (map: MapInfo): Range => {
  const { nextRangeDestination } = FFunction.pipe({
    nextRangeSource: {
      start: Math.max(map.sourceStart, range.start),
      end: Math.min(map.sourceEnd, range.end),
    }
  },
    ({ nextRangeSource }) => ({
      nextRangeDestination: {
        start: map.destinationStart + nextRangeSource.start - map.sourceStart,
        end: map.destinationStart + nextRangeSource.end - map.sourceStart,
      }
    })
  )

  return nextRangeDestination;
}

const getRemainingRange = (range: Range) => (map: MapInfo): Range => {
  return {
    start: map.sourceEnd + 1,
    end: range.end,
  }
}


const applyMap = (range: Range) => (remainingMaps: MapInfo[]) => (map: MapInfo): Range[] => {
  if (!isRangeWithinMap(map)(range)) {
    return toNextRanges(remainingMaps)(range)
  }

  return FFunction.pipe(
    [getGapRange, getNextRange, getRemainingRange],
    FArray.flap(range),
    FArray.flap(map),
    ([gapRange, nextRange, remainingRange]) => [
      gapRange,
      nextRange,
      ...toNextRanges(remainingMaps)(remainingRange),
    ],
    FArray.filter(isValidRange),
  )

  // Alternative implementation
  // return FFunction.pipe({
  //     gapRange: getGapRange(range)(map),
  //     nextRange: getNextRange(range)(map),
  //     remainingRange: getRemainingRange(range)(map),
  //   },
  //   ({ gapRange, nextRange, remainingRange }) => [
  //     gapRange,
  //     nextRange,
  //     ...toNextRanges(remainingMaps)(remainingRange),
  //   ],
  //   FArray.filter(isValidRange),
  // )
}

export const toNextRanges = (maps: MapInfo[]) => (range: Range): Range[] => {
  if (!isValidRange(range)) { return [] }

  return FFunction.pipe(
    maps,
    headTail,
    ([head, remainingMaps]) => {
      return FFunction.pipe(
        head,
        FOption.fold(
          () => [range],
          applyMap(range)(remainingMaps),
        )
      )
    },
  )
}

const isValidRange = (range: Range): boolean => range.start <= range.end

const toStart = (range: Range): number => range.start

export const part2 = (lines: string[][]): number => {
  const seedRanges = getSeedsRanges(lines)
  const seedToSoilMap = getMapSort('seed-to-soil')(lines)
  const soilToFertilizerMap = getMapSort('soil-to-fertilizer')(lines)
  const fertilizerToWaterMap = getMapSort('fertilizer-to-water')(lines)
  const waterToLightMap = getMapSort('water-to-light')(lines)
  const lightToTemperatureMap = getMapSort('light-to-temperature')(lines)
  const temperatureToHumidityMap = getMapSort('temperature-to-humidity')(lines)
  const humidityToLocationMap = getMapSort('humidity-to-location')(lines)

  return FFunction.pipe(
    seedRanges,
    FArray.flatMap(toNextRanges(seedToSoilMap)),
    FArray.flatMap(toNextRanges(soilToFertilizerMap)),
    FArray.flatMap(toNextRanges(fertilizerToWaterMap)),
    FArray.flatMap(toNextRanges(waterToLightMap)),
    FArray.flatMap(toNextRanges(lightToTemperatureMap)),
    FArray.flatMap(toNextRanges(temperatureToHumidityMap)),
    FArray.flatMap(toNextRanges(humidityToLocationMap)),
    FArray.map(toStart),
    toMin,
  )
}

