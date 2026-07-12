import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/checkout", "/cart", "/api/"] }, sitemap: "https://bazaar.example/sitemap.xml", host: "https://bazaar.example" };
}
