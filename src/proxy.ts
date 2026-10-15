import { NextResponse, type NextRequest } from "next/server";

/**
 * - /admin sin cookie de sesión → al ingreso (la verificación real se hace en el servidor).
 * - noindex en el panel, en los presupuestos públicos y en dominios de preview.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const esPanel = pathname.startsWith("/admin");

  if (esPanel && pathname !== "/admin/ingresar" && !req.cookies.has("ce_sesion")) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/ingresar";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  const host = req.headers.get("host") ?? "";
  if (esPanel || pathname.startsWith("/p/") || host.endsWith(".vercel.app")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|media/|img/|marca/|favicon.ico|icon|apple-icon).*)"],
};
