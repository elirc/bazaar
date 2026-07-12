export type Store = {
  id: string;
  name: string;
  handle: string;
};

export type ProductStatus = "draft" | "active" | "archived";

export type Product = {
  id: string;
  storeId: string;
  title: string;
  handle: string;
  description: string;
  priceCents: number;
  status: ProductStatus;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductMedia = {
  id: string;
  productId: string;
  kind: "image" | "video";
  url: string;
  altText: string;
  position: number;
};

export type ProductOption = {
  id: string;
  productId: string;
  name: string;
  position: number;
  values: readonly string[];
};

export type Variant = {
  id: string;
  productId: string;
  sku: string;
  priceCents: number;
  /** One selected value per option name, for example `{ Size: "M", Color: "Blue" }`. */
  selections: Readonly<Record<string, string>>;
};

export type SmartCollectionRule =
  | { op: "all"; rules: readonly SmartCollectionRule[] }
  | { op: "any"; rules: readonly SmartCollectionRule[] }
  | { op: "title_contains"; value: string }
  | { op: "price_between"; minimumCents: number; maximumCents: number }
  | { op: "status_is"; value: ProductStatus };

export type Collection = {
  id: string;
  storeId: string;
  title: string;
  handle: string;
  kind: "manual" | "smart";
  productIds: readonly string[];
  rule?: SmartCollectionRule;
};

export type Cart = {
  id: string;
  storeId: string;
  customerId?: string;
  lines: readonly CartLine[];
  updatedAt: Date;
};

export type CartLine = {
  id: string;
  variantId: string;
  quantity: number;
  /** Trust boundary: the amount shown when the buyer formed this cart intent. */
  priceSnapshotCents: number;
};

export type InventoryItem = {
  id: string;
  variantId: string;
  locationId: string;
  onHand: number;
  reserved: number;
};

export const availableInventory = (item: InventoryItem) => item.onHand - item.reserved;

export type InventoryReservation = {
  id: string;
  inventoryItemId: string;
  cartId: string;
  quantity: number;
  status: "active" | "released" | "committed";
  expiresAt: Date;
};

export type CreateProduct = Pick<
  Product,
  "storeId" | "title" | "handle" | "description" | "priceCents"
> & { status?: ProductStatus };

export interface CatalogRepository {
  createStore(store: Store): Promise<void>;
  createProduct(input: CreateProduct): Promise<Product>;
  listProducts(storeId: string): Promise<readonly Product[]>;
  findProductByHandle(storeId: string, handle: string): Promise<Product | undefined>;
}

export function variantIdentity(selections: Readonly<Record<string, string>>): string {
  return Object.entries(selections)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, value]) => `${name}=${value}`)
    .join("|");
}

type IdFactory = () => string;
type Clock = () => Date;

/**
 * CI injects this adapter instead of Postgres. The service depends on the port
 * above, so replacing this fake with Prisma changes wiring rather than business
 * behavior.
 */
export class InMemoryCatalogRepository implements CatalogRepository {
  readonly #stores = new Map<string, Store>();
  readonly #products = new Map<string, Product>();

  constructor(
    private readonly idFactory: IdFactory,
    private readonly clock: Clock = () => new Date(),
  ) {}

  async createStore(store: Store): Promise<void> {
    this.#stores.set(store.id, structuredClone(store));
  }

  async createProduct(input: CreateProduct): Promise<Product> {
    if (!this.#stores.has(input.storeId)) {
      throw new Error(`Unknown store: ${input.storeId}`);
    }

    const duplicate = [...this.#products.values()].some(
      (product) => product.storeId === input.storeId && product.handle === input.handle,
    );
    if (duplicate) {
      throw new Error(`Product handle already exists: ${input.handle}`);
    }

    const now = this.clock();
    const product: Product = {
      ...input,
      id: this.idFactory(),
      status: input.status ?? "draft",
      createdAt: now,
      updatedAt: now,
    };
    this.#products.set(product.id, structuredClone(product));
    return structuredClone(product);
  }

  async listProducts(storeId: string): Promise<readonly Product[]> {
    return [...this.#products.values()]
      .filter((product) => product.storeId === storeId)
      .map((product) => structuredClone(product));
  }

  async findProductByHandle(storeId: string, handle: string): Promise<Product | undefined> {
    const product = [...this.#products.values()].find(
      (candidate) => candidate.storeId === storeId && candidate.handle === handle,
    );
    return product ? structuredClone(product) : undefined;
  }
}

export { createCatalogSeed, type CatalogSeedProduct } from "./seed.js";
