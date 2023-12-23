export const getInput = async (path: string): Promise<string[]> => {
  const inputFile = Bun.file(path);
  const input = await inputFile.text();
  const inputs = input.split('\n').filter(x => !!x);

  return inputs;
}
