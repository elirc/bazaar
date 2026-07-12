import type { CatalogRepository, CreateProduct } from "@bazaar/db";
import Fastify, { type FastifyInstance } from "fastify";

import { CatalogService } from "./catalog-service.js";

type ProductParams = { storeId: string; handle: string };
type StoreParams = { storeId: string };

export function buildApi(catalog: CatalogRepository): FastifyInstance {
  const app = Fastify({ logger: false });
  const service = new CatalogService(catalog);

  app.get("/health", async () => ({ status: "ok" }));

  app.post<{ Body: CreateProduct }>("/admin/products", async (request, reply) => {
    const product = await service.createProduct(request.body);
    return reply.code(201).send(product);
  });

  app.get<{ Params: StoreParams }>("/admin/stores/:storeId/products", async (request) =>
    service.listForAdmin(request.params.storeId),
  );

  app.get<{ Params: ProductParams }>(
    "/storefront/stores/:storeId/products/:handle",
    async (request, reply) => {
      const product = await service.readForStorefront(
        request.params.storeId,
        request.params.handle,
      );
      return product ?? reply.code(404).send({ error: "Product not found" });
    },
  );

  return app;
}
