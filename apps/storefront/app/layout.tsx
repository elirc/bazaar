import type { ReactNode } from "react";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content">Skip to main content</a>
        <header>
          <a href="/">Bazaar</a>
        </header>
        <main id="main-content" tabIndex={-1}>{children}</main>
      </body>
    </html>
  );
}
