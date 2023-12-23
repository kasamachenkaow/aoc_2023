import FArray from 'fp-ts/Array'
import FFunction from 'fp-ts/function'
import { reverseString } from '../../shared/reverse-string';
import { toSum } from '../../shared/to-sum';

type Input = string[];
type Output = number;

const digitTextMapping = {
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9',
}

const numberTextPattern = 'one|two|three|four|five|six|seven|eight|nine';

export const getFirstNumberString = (input: string): string => {
  const pattern = new RegExp(`(${numberTextPattern}|\\d)`);
  const matches = input.match(pattern);

  if (!matches || matches.length === 0) {
    throw new Error(`No digit found in ${input}`);
  }

  return matches[0];
}

export const getLastNumberString = (input: string): string => {
  const pattern = new RegExp(`(${reverseString(numberTextPattern)}|\\d)`);
  const matches = reverseString(input).match(pattern);

  if (!matches || matches.length === 0) {
    throw new Error(`No digit found in ${input}`);
  }

  return reverseString(matches[0]);
}

const toNumberStrings = (input: string): string[] => {
  const pattern = /\d/g;
  const matches = input.match(pattern);
  if (!matches || matches.length === 0) {
    throw new Error(`No digit found in ${input}`);
  }

  return matches;
}

const toFirstAndLast = (input: string[]): [string, string] => {
  const [first] = input;
  const [last] = input.reverse();

  return [first, last];
}

export const toFirstAndLastNumberStrings = (input: string): [string, string] => {
  const first = getFirstNumberString(input);

  const last = getLastNumberString(input);

  return [first, last];
}

const toDigitText = (digitText: string): string => {
  const digit = digitTextMapping[digitText as keyof typeof digitTextMapping];

  if (!digit) {
    return digitText;
  }

  return digit;
}

const tupleToDigitText = (input: [string, string]): [string, string] => {
  const [first, last] = input;
  const firstDigitText = toDigitText(first);
  const lastDigitText = toDigitText(last);

  return [firstDigitText, lastDigitText];
}

const digitTextToInteger = (input: [string, string]): number => {
  const [first, last] = input;
  return parseInt(`${first}${last}`, 10);
}

export const part1 = (input: Input): Output => {
  const output = FFunction.pipe(
    input,
    FArray.map(toNumberStrings),
    FArray.map(toFirstAndLast),
    FArray.map(digitTextToInteger),
    FArray.reduce(0, toSum)
  )

  return output;
}

export const part2 = (input: Input): Output => {
  const output = FFunction.pipe(
    input,
    FArray.map(toFirstAndLastNumberStrings),
    FArray.map(tupleToDigitText),
    FArray.map(digitTextToInteger),
    FArray.reduce(0, toSum)
  )

  return output;
}
