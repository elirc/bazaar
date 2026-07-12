import { validateMerchandisingRule } from "../../src/merchandising";

export function SearchMerchandising() {
  const rule = validateMerchandisingRule({ collectionHandle: "market-favorites", pinnedProductIds: ["p1"], synonyms: { tote: ["bag", "carryall"] }, fieldWeights: { title: 3, description: 1 } });
  return <section><h2>Search merchandising</h2><p>Collection: {rule.collectionHandle}</p><label>Pinned products<input defaultValue={rule.pinnedProductIds.join(",")} /></label><label>Synonyms<input defaultValue="tote: bag, carryall" /></label><label>Title weight<input defaultValue={rule.fieldWeights.title} min="1" type="number" /></label></section>;
}
