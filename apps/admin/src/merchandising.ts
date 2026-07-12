export type MerchandisingRule = {
  collectionHandle: string;
  pinnedProductIds: readonly string[];
  synonyms: Readonly<Record<string, readonly string[]>>;
  fieldWeights: { title: number; description: number };
};

export function validateMerchandisingRule(rule: MerchandisingRule) {
  if (rule.fieldWeights.title < rule.fieldWeights.description) throw new Error("Title weight must not trail description");
  return rule;
}
