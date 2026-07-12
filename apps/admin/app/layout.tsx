import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <strong>Bazaar Admin</strong>
          <span> Fresh merchant workspace</span>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
