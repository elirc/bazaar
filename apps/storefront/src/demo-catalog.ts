export const demoCollectionProducts = Array.from({ length: 18 }, (_, index) => ({
  handle: `market-good-${index + 1}`,
  title: `Market Good ${index + 1}`,
  description: "Independent goods for everyday rituals.",
  priceCents: 1800 + index * 100,
}));
