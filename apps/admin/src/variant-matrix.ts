export type EditorOption = { name: string; values: readonly string[] };

export function variantMatrix(options: readonly EditorOption[]) {
  return options.reduce<ReadonlyArray<Record<string, string>>>(
    (rows, option) =>
      rows.flatMap((row) => option.values.map((value) => ({ ...row, [option.name]: value }))),
    [{}],
  );
}
