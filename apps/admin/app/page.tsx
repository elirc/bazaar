import { productRows, type AdminProduct } from "../src/catalog-admin";
import { ProductEditor } from "./catalog/product-editor";
import { CollectionEditor } from "./catalog/collection-editor";
import { SearchMerchandising } from "./catalog/search-merchandising";
import { DiscountEditor } from "./catalog/discount-editor";
import { OrderDetail } from "./orders/order-detail";

// Merchant decisions cannot tolerate a stale write-after-read, so this route is
// intentionally dynamic even though the buyer-facing product page can be static.
export const dynamic = "force-dynamic";

const seedProducts: AdminProduct[] = [
  { id: "p_demo", title: "Canvas Market Tote", status: "active", priceCents: 2400 },
];

export default function CatalogPage() {
  return (
    <section>
      <h1>Catalog</h1>
      <p>Changes here read directly from catalog truth and bypass storefront caches.</p>
      <form>
        <label>
          Product title
          <input name="title" required />
        </label>
        <label>
          Price in cents
          <input name="priceCents" min="0" step="1" type="number" required />
        </label>
        <button type="submit">Create draft</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Status</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {productRows(seedProducts).map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{product.status}</td>
              <td>{product.formattedPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ProductEditor />
      <CollectionEditor />
      <SearchMerchandising />
      <DiscountEditor />
      <OrderDetail order={{
        id: "ord_demo",
        customerEmail: "buyer@example.com",
        status: "paid",
        totalCents: 2400,
        currency: "USD",
        events: [{ id: "evt_1", orderId: "ord_demo", kind: "status", message: "Payment captured", occurredAt: "2026-07-12T18:00:00Z" }],
      }} />
    </section>
  );
}
