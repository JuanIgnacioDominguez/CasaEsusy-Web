import { readFile, stat } from "node:fs/promises";
import { join, normalize, sep } from "node:path";
import { DIR_SUBIDAS } from "@/lib/medios";

const TIPOS: Record<string, string> = { webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", avif: "image/avif" };

/** Sirve las imágenes subidas desde el panel (data/uploads), con caché larga. */
export async function GET(_: Request, { params }: { params: Promise<{ ruta: string[] }> }) {
  const { ruta } = await params;
  const relativa = normalize(ruta.join("/"));
  if (relativa.startsWith("..") || relativa.includes(`..${sep}`)) return new Response("No encontrado", { status: 404 });
  const archivo = join(DIR_SUBIDAS, relativa);
  try {
    const [datos, info] = await Promise.all([readFile(archivo), stat(archivo)]);
    const ext = archivo.split(".").pop()?.toLowerCase() ?? "";
    return new Response(new Uint8Array(datos), {
      headers: {
        "Content-Type": TIPOS[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Last-Modified": info.mtime.toUTCString(),
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("No encontrado", { status: 404 });
  }
}
