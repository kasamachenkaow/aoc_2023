const parseInputToLines = (input: string): string[] => {
  return input.split('\n').filter(x => !!x);
}

export const getInput = async (path: string): Promise<string[]> => {
  const inputFile = Bun.file(path);
  const input = await inputFile.text();

  return parseInputToLines(input);
}

export const getInputWith2Eols = async (path: string): Promise<string[][]> => {
  const inputFile = Bun.file(path);
  const input = await inputFile.text();
  const inputs =  input.split('\n\n').filter(x => !!x).map(parseInputToLines);

  return inputs;
}
