import type { MetadataRoute } from "next";

const origin = "https://bazaar.example";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: origin, changeFrequency: "daily", priority: 1 },
    { url: `${origin}/products/canvas-market-tote`, changeFrequency: "daily", priority: 0.9 },
    { url: `${origin}/collections/market-favorites`, changeFrequency: "daily", priority: 0.8 },
  ];
}
