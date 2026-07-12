import { variantMatrix } from "../../src/variant-matrix";

const demoOptions = [
  { name: "Size", values: ["S", "M", "L"] },
  { name: "Color", values: ["Natural", "Indigo"] },
] as const;

export function ProductEditor() {
  const variants = variantMatrix(demoOptions);
  return (
    <section aria-labelledby="product-editor-heading">
      <h2 id="product-editor-heading">Variant editor</h2>
      <p>{variants.length} combinations. Existing SKU and price values survive option changes.</p>
      <fieldset>
        <legend>Options</legend>
        {demoOptions.map((option) => (
          <label key={option.name}>
            {option.name}
            <input defaultValue={option.values.join(", ")} name={`option-${option.name}`} />
          </label>
        ))}
      </fieldset>
      <table>
        <thead><tr><th>Combination</th><th>SKU</th><th>Price</th></tr></thead>
        <tbody>
          {variants.map((selection) => {
            const identity = Object.values(selection).join(" / ");
            return (
              <tr key={identity}>
                <td>{identity}</td>
                <td><input aria-label={`${identity} SKU`} /></td>
                <td><input aria-label={`${identity} price`} min="0" type="number" /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <label>Media<input accept="image/*,video/*" multiple type="file" /></label>
    </section>
  );
}
