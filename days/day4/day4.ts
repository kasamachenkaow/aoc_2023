import FArray from 'fp-ts/Array'
import FOption from 'fp-ts/Option'
import FRecord from 'fp-ts/Record'
import FFunction from 'fp-ts/function'
import { reduceSum } from '../../shared/reduce-sum'
import { getArrayMagma } from '../../shared/array-magma'
import { Magma } from 'fp-ts/lib/Magma'

type Input = string[]
type Output = number

type CardInfo = {
  id: number,
  numbers: number[],
  cardWinningNumbers: number[],
}

type WinningCard = {
  id: number,
  winningCardIds: number[],
  numberOfCopies: number,
}

type WinningCardFoldable = [string, number[]]
type WinningCardMap = Record<string, number[]>
type WinningCardFoldable2 = [string, WinningCard]
type WinningCardMap2 = Record<string, WinningCard>

export const toCardInfo = (line: string): CardInfo => {
  const [id, allNumbers] = line.split(': ')
  const [cardWinningNumbers, numbers] = allNumbers.split(' | ')
  return {
    id: Number(id.split(' ').filter(x=>!!x)[1]),
    numbers: numbers.split(' ').filter(x => !!x).map(Number),
    cardWinningNumbers: cardWinningNumbers.split(' ').filter(x => !!x).map(Number),
  }
}

const toWinningNumbers = (cardInfo: CardInfo): number[] => {
  return FFunction.pipe(
    cardInfo.numbers,
    FArray.filter(x => cardInfo.cardWinningNumbers.includes(x)),
  )
}

const toPoint = (winningNumbers: number[]): number => {
  return winningNumbers.length > 0 ? Math.pow(2, winningNumbers.length - 1) : 0
}

export const part1 = (lines: Input): Output => {
  return FFunction.pipe(
    lines,
    FArray.map(toCardInfo),
    FArray.map(toWinningNumbers),
    FArray.map(toPoint),
    reduceSum,
  )
}

export const toWinningCard = (cardInfo: CardInfo): WinningCard => {
  return {
    id: cardInfo.id,
    winningCardIds: FFunction.pipe(
      toWinningNumbers(cardInfo),
      FArray.mapWithIndex((index, _) => index + 1 + cardInfo.id),
    ),
    numberOfCopies: 1,
  }
}

const multiplyWiningCards = (winningCardMap: WinningCardMap) => (winningCardIds: number[]): number[] => {
  if (winningCardIds.length === 0) {
    return []
  }

  const [head, ...tail] = winningCardIds

  const newWinningCardIds = FRecord.lookup(String(head), winningCardMap)

  return FFunction.pipe(
    newWinningCardIds,
    FOption.fold(
      () => [...multiplyWiningCards(winningCardMap)(tail)],
      (ids) => [head, ...multiplyWiningCards(winningCardMap)([...ids, ...tail])],
    )
  )
}

const toWinningCardFoldable = (winningCard: WinningCard): WinningCardFoldable => {
  return [String(winningCard.id), winningCard.winningCardIds]
}

export const part2 = (lines: Input): Output => {
  const winningCards = FFunction.pipe(
    lines,
    FArray.map(toCardInfo),
    FArray.map(toWinningCard),
  )

  const winningCardMap = FFunction.pipe(
    winningCards,
    FArray.map(toWinningCardFoldable),
    FRecord.fromFoldable(getArrayMagma<number>(), FArray.Foldable),
  )

  return FFunction.pipe(
    winningCards,
    FArray.map(x => x.id),
    multiplyWiningCards(winningCardMap),
    FArray.size,
  )
}

const toWinningCardFoldable2 = (winningCard: WinningCard): WinningCardFoldable2 => {
  return [String(winningCard.id), winningCard]
}

const winningCardMagma: Magma<WinningCard> = {
  concat: (x, y) => ({
    id: x.id,
    winningCardIds: [...x.winningCardIds, ...y.winningCardIds],
    numberOfCopies: x.numberOfCopies + y.numberOfCopies,
  }),
}

const updateWinningCardMap = (winningCardMap: WinningCardMap2) => (numberOfCopies: number) => (winningCardId: number): void => {
  const cache = winningCardMap[String(winningCardId)]

  if (!cache) {
    return
  }

  cache.numberOfCopies += numberOfCopies
}

const toMultiplyAndUpdateMap = (winningCardMap: WinningCardMap2) => (winningCard: WinningCard): WinningCard => {
  return FFunction.pipe(
    FRecord.lookup(String(winningCard.id), winningCardMap),
    FOption.fold(
      () => winningCard,
      (cache) => {
        FFunction.pipe(
          cache.winningCardIds,
          FArray.map(updateWinningCardMap(winningCardMap)(cache.numberOfCopies)),
        )

        return winningCard;
      }
    )
  )
}

const toNumberOfCopies = (winningCardMap: WinningCardMap2) => (winningCard: WinningCard): number => {
  return FFunction.pipe(
    FRecord.lookup(String(winningCard.id), winningCardMap),
    FOption.fold(
      () => 0,
      (x) => x.numberOfCopies,
    )
  )
}

export const part2b = (lines: Input): Output => {
  const winningCards: WinningCard[] = FFunction.pipe(
    lines,
    FArray.map(toCardInfo),
    FArray.map(toWinningCard),
  )

  const winningCardMap: WinningCardMap2 = FFunction.pipe(
    winningCards,
    FArray.map(toWinningCardFoldable2),
    FRecord.fromFoldable(winningCardMagma, FArray.Foldable),
  )

  return FFunction.pipe(
    winningCards,
    FArray.map(toMultiplyAndUpdateMap(winningCardMap)),
    FArray.map(toNumberOfCopies(winningCardMap)),
    reduceSum,
  )
}

