export { buildApi } from "./app.js";
export { CatalogService, type ProductCard } from "./catalog-service.js";
export { mergeVariantMatrix } from "./catalog/variants.js";
export { matchesSmartRule, productsInCollection } from "./catalog/collections.js";
export { SearchService } from "./search-service.js";
export { addCartLine, updateCartLine, mergeCarts, calculateCartTotals, type VariantPriceReader } from "./cart-service.js";
export { CatalogPublisher, type StorefrontRevalidator } from "./catalog-publisher.js";
export { allocateAcrossLocations, AtomicInventoryService, NaiveInventoryService, ReservationService, type AtomicInventoryPort, type InventoryReadWritePort, type ReservationPort } from "./inventory.js";
