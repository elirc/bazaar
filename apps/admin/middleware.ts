import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === "production" && !request.cookies.has("bazaar_staff")) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
