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
  createdAt: Date;
  updatedAt: Date;
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
