import FArray from 'fp-ts/Array'
import FNonEmptyArray from 'fp-ts/NonEmptyArray'
import FOption from 'fp-ts/Option'
import FRecord from 'fp-ts/Record'
import FFunction from 'fp-ts/function'
import { toMin } from '../../shared/to-min'

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

type MapInfo = {
  destinationStart: number,
  sourceStart: number,
  range: number,
}
const toMapInfo = (line: string): MapInfo => {
  const [destinationStart, sourceStart, range] = line.split(' ').map((x) => parseInt(x))
  return {
    destinationStart,
    sourceStart,
    range,
  }
}

const mapInfoToEntries = (mapInfo: MapInfo): [string, number][] => {
  const { destinationStart, sourceStart, range } = mapInfo

  const destinationRanges = FNonEmptyArray.range(destinationStart, destinationStart + range - 1)
  const sourceRanges = FNonEmptyArray.range(sourceStart, sourceStart + range - 1)

  return FFunction.pipe(
    sourceRanges,
    FArray.map((x) => x.toString()),
    FArray.zip(destinationRanges),
  )
}


export const mapTexttoEntries = (line: string): [string, number][] => {
  return FFunction.pipe(
    line,
    toMapInfo,
    mapInfoToEntries,
  )
}


const isMapName = (mapName: string) => (line: string[]): boolean => {
  return line[0].startsWith(mapName)
}

export const getMap = (lines: string[][], mapName: string): Record<string, number> => {
  return FFunction.pipe(
       lines,
       FArray.filter(isMapName(mapName)),
       FArray.head,
       FOption.getOrElse(() => [] as string[]),
       FArray.tail,
       FOption.getOrElse(() => [] as string[]),
       FArray.flatMap(mapTexttoEntries),
       FRecord.fromEntries,
     )
}

const toNext = (map: Record<string, number>) => (seed: number): number => {
  return FFunction.pipe(
    map,
    FRecord.lookup(seed.toString()),
    FOption.getOrElse(() => seed),
  )
}


export const part1 = (lines: string[][]): number => {
  const seeds = getSeeds(lines)
  const seedToSoilMap = getMap(lines, 'seed-to-soil')
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

