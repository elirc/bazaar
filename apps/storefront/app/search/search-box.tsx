"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBox({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (query !== initialQuery) router.replace(`/search?q=${encodeURIComponent(query)}`);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [initialQuery, query, router]);
  return <input aria-label="Search products" onChange={(event) => setQuery(event.target.value)} placeholder="Search products" value={query} />;
}
