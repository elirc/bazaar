import { compileRuleDrafts } from "../../src/collection-rules";

export function CollectionEditor() {
  const preview = compileRuleDrafts([
    { field: "title", operator: "contains", value: "tote" },
    { field: "price", operator: "between", minimumCents: 1000, maximumCents: 5000 },
  ]);
  return (
    <section aria-labelledby="collection-editor-heading">
      <h2 id="collection-editor-heading">Collections</h2>
      <label>Membership<select defaultValue="smart"><option>manual</option><option>smart</option></select></label>
      <fieldset>
        <legend>All rules must match</legend>
        <label>Title contains<input defaultValue="tote" /></label>
        <label>Minimum price<input defaultValue="1000" min="0" type="number" /></label>
        <label>Maximum price<input defaultValue="5000" min="0" type="number" /></label>
      </fieldset>
      <pre aria-label="Compiled safe rule">{JSON.stringify(preview, null, 2)}</pre>
    </section>
  );
}
