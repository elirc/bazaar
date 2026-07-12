import Link from "next/link";

export default function HomePage() {
  return (
    <section>
      <p>Independent goods from thoughtful merchants.</p>
      <Link href="/products/canvas-market-tote" prefetch>Shop the walking skeleton</Link>
    </section>
  );
}
