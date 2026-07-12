import Image from "next/image";

// Keep the LCP image in a server component. The only client boundary on the
// product route remains the small add-to-cart control below the product facts.
export function ProductMedia({ title }: { title: string }) {
  return <Image alt={`${title} product view`} fetchPriority="high" height={1200} priority quality={75} sizes="(max-width: 768px) 100vw, 50vw" src="/product-placeholder.svg" width={1200} />;
}
