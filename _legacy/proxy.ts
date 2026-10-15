import { NextResponse, type NextRequest } from "next/server";

/**
 * Next 16 renombró `middleware` a `proxy`.
 * - Dominios de preview (*.vercel.app) → noindex, para no duplicar contenido (sección 15).
 * - Fase 1d: protección de /admin y redirecciones 301 desde la tabla `redirects`.
 */
export function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const res = NextResponse.next();
  if (host.endsWith(".vercel.app") || host.startsWith("localhost")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|icon.svg|.*\\.(?:png|jpg|svg|webp|avif)$).*)"],
};
