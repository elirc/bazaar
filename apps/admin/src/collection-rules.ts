export type RuleDraft =
  | { field: "title"; operator: "contains"; value: string }
  | { field: "price"; operator: "between"; minimumCents: number; maximumCents: number };

export function compileRuleDrafts(drafts: readonly RuleDraft[]) {
  return {
    op: "all" as const,
    rules: drafts.map((draft) =>
      draft.field === "title"
        ? { op: "title_contains" as const, value: draft.value }
        : {
            op: "price_between" as const,
            minimumCents: draft.minimumCents,
            maximumCents: draft.maximumCents,
          },
    ),
  };
}
