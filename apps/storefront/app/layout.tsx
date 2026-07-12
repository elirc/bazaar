import type { ReactNode } from "react";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <a href="/">Bazaar</a>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
